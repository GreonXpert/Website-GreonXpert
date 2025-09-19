import axios from 'axios';

// This function uses the Gemini API to generate synthetic emissions data
export const fetchGeminiEmissionsData = async () => {
  const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
  if (!apiKey) {
    console.error('API key not found. Please ensure REACT_APP_GEMINI_API_KEY is set in your .env.local file.');
    return [];
  }

  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

  // We are instructing the Gemini model to generate a JSON array of emissions data
  const userPrompt = "Generate a JSON array of historical emissions data for a company. The data should include 5 years, with values for 'year', 'scope1', 'scope2', 'scope3', and 'total'. Make the 'total' value the sum of the three scopes. The values should be in metric tons of CO₂e and decrease slightly each year to show progress in sustainability.";

  const payload = {
    contents: [{ parts: [{ text: userPrompt }] }],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "ARRAY",
        items: {
          type: "OBJECT",
          properties: {
            "year": { "type": "NUMBER" },
            "scope1": { "type": "NUMBER" },
            "scope2": { "type": "NUMBER" },
            "scope3": { "type": "NUMBER" },
            "total": { "type": "NUMBER" }
          },
          "propertyOrdering": ["year", "scope1", "scope2", "scope3", "total"]
        }
      }
    }
  };

  try {
    const response = await axios.post(apiUrl, payload, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 10000 // Set a timeout for the API request
    });

    const generatedJson = response.data.candidates[0].content.parts[0].text;
    return JSON.parse(generatedJson);

  } catch (error) {
    console.error('Error fetching data from Gemini API:', error);
    // Return an empty array in case of an error to prevent the app from crashing
    return [];
  }
};
