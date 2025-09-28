// src/components/Career/ApplicationForm.js - Backend Integration

import React, { useState } from 'react';
import {
  Dialog, DialogContent, TextField, Button, Grid, Typography, Box,
  IconButton, Alert, FormControl, InputLabel, Select, MenuItem,
  Paper, Avatar, Step, Stepper, StepLabel, Fade, CircularProgress, Stack
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import BusinessIcon from '@mui/icons-material/Business';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkIcon from '@mui/icons-material/Work';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import { keyframes } from '@emotion/react';
import axios from 'axios';
import { API_BASE } from '../../utils/api';

// API Configuration
const API_URL = `${API_BASE}/api/careers`;

// Animations
const slideUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Reusable Styles for Inputs
const commonInputStyles = (theme) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 2,
    backgroundColor: 'white',
    transition: 'border-color 0.3s, box-shadow 0.3s',
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.primary.light,
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.primary.main,
      borderWidth: '2px',
    },
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: theme.palette.primary.main,
  },
});

const iconInputStyles = (theme) => ({
  ...commonInputStyles(theme),
  '& .MuiOutlinedInput-root': {
    ...commonInputStyles(theme)['& .MuiOutlinedInput-root'],
    paddingLeft: '45px',
  },
  '& .MuiInputLabel-root': {
    paddingLeft: '40px',
  },
});

// Step Components
const BasicDetailsStep = ({ formData, handleFormChange, errors }) => {
  const theme = useTheme();
  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 3, color: '#1AC99F', fontWeight: 600 }}>
        Tell us about yourself
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="First Name"
            value={formData.firstName}
            onChange={(e) => handleFormChange('firstName', e.target.value)}
            sx={iconInputStyles(theme)}
            error={!!errors.firstName}
            helperText={errors.firstName}
            InputProps={{
              startAdornment: <PersonIcon sx={{ position: 'absolute', left: 14, color: '#1AC99F' }} />
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Last Name"
            value={formData.lastName}
            onChange={(e) => handleFormChange('lastName', e.target.value)}
            sx={iconInputStyles(theme)}
            error={!!errors.lastName}
            helperText={errors.lastName}
            InputProps={{
              startAdornment: <PersonIcon sx={{ position: 'absolute', left: 14, color: '#1AC99F' }} />
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={(e) => handleFormChange('email', e.target.value)}
            sx={iconInputStyles(theme)}
            error={!!errors.email}
            helperText={errors.email}
            InputProps={{
              startAdornment: <EmailIcon sx={{ position: 'absolute', left: 14, color: '#1AC99F' }} />
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Phone Number"
            value={formData.phone}
            onChange={(e) => handleFormChange('phone', e.target.value)}
            sx={iconInputStyles(theme)}
            error={!!errors.phone}
            helperText={errors.phone}
            InputProps={{
              startAdornment: <PhoneIcon sx={{ position: 'absolute', left: 14, color: '#1AC99F' }} />
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Current Location"
            value={formData.currentLocation}
            onChange={(e) => handleFormChange('currentLocation', e.target.value)}
            sx={iconInputStyles(theme)}
            InputProps={{
              startAdornment: <LocationOnIcon sx={{ position: 'absolute', left: 14, color: '#1AC99F' }} />
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

const ProfessionalInfoStep = ({ formData, handleFormChange, errors }) => {
  const theme = useTheme();
  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 3, color: '#1AC99F', fontWeight: 600 }}>
        Professional Experience
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth error={!!errors.experience}>
            <InputLabel>Total Experience</InputLabel>
            <Select
              value={formData.experience}
              onChange={(e) => handleFormChange('experience', e.target.value)}
              label="Total Experience"
              sx={commonInputStyles(theme)}
            >
              <MenuItem value="0-1 years">0-1 years</MenuItem>
              <MenuItem value="1-3 years">1-3 years</MenuItem>
              <MenuItem value="3-5 years">3-5 years</MenuItem>
              <MenuItem value="5-8 years">5-8 years</MenuItem>
              <MenuItem value="8+ years">8+ years</MenuItem>
            </Select>
            {errors.experience && <Typography variant="caption" color="error">{errors.experience}</Typography>}
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Notice Period</InputLabel>
            <Select
              value={formData.noticePeriod}
              onChange={(e) => handleFormChange('noticePeriod', e.target.value)}
              label="Notice Period"
              sx={commonInputStyles(theme)}
            >
              <MenuItem value="Immediate">Immediate</MenuItem>
              <MenuItem value="15 days">15 days</MenuItem>
              <MenuItem value="1 month">1 month</MenuItem>
              <MenuItem value="2 months">2 months</MenuItem>
              <MenuItem value="3 months">3 months</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Current/Desired Position"
            value={formData.position}
            onChange={(e) => handleFormChange('position', e.target.value)}
            sx={iconInputStyles(theme)}
            error={!!errors.position}
            helperText={errors.position}
            InputProps={{
              startAdornment: <WorkIcon sx={{ position: 'absolute', left: 14, color: '#1AC99F' }} />
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Expected Salary (Optional)"
            value={formData.expectedSalary}
            onChange={(e) => handleFormChange('expectedSalary', e.target.value)}
            sx={commonInputStyles(theme)}
            placeholder="e.g., 5-8 LPA"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Skills (comma separated)"
            value={formData.skills}
            onChange={(e) => handleFormChange('skills', e.target.value)}
            sx={commonInputStyles(theme)}
            placeholder="React, Node.js, Python..."
          />
        </Grid>
      </Grid>
    </Box>
  );
};

const EducationStep = ({ formData, handleFormChange, errors }) => {
  const theme = useTheme();
  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 3, color: '#1AC99F', fontWeight: 600 }}>
        Education & Additional Information
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Highest Degree"
            value={formData.degree}
            onChange={(e) => handleFormChange('degree', e.target.value)}
            sx={commonInputStyles(theme)}
            error={!!errors.degree}
            helperText={errors.degree}
            placeholder="e.g., B.Tech, MBA, M.Sc"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Field of Study"
            value={formData.field}
            onChange={(e) => handleFormChange('field', e.target.value)}
            sx={commonInputStyles(theme)}
            error={!!errors.field}
            helperText={errors.field}
            placeholder="e.g., Computer Science, Business"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Institution"
            value={formData.institution}
            onChange={(e) => handleFormChange('institution', e.target.value)}
            sx={commonInputStyles(theme)}
            error={!!errors.institution}
            helperText={errors.institution}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Graduation Year"
            type="number"
            value={formData.year}
            onChange={(e) => handleFormChange('year', e.target.value)}
            sx={commonInputStyles(theme)}
            error={!!errors.year}
            helperText={errors.year}
            InputProps={{
              inputProps: { min: 1950, max: 2030 }
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Why do you want to join Greon Xpert?"
            multiline
            rows={4}
            value={formData.motivation}
            onChange={(e) => handleFormChange('motivation', e.target.value)}
            sx={commonInputStyles(theme)}
            placeholder="Tell us about your interest in environmental technology and sustainability..."
          />
        </Grid>
      </Grid>
    </Box>
  );
};

const DocumentsStep = ({ formData, handleFormChange, handleFileUpload, errors }) => {
  const theme = useTheme();
  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 3, color: '#1AC99F', fontWeight: 600 }}>
        Documents & Consent
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ 
            p: 3, 
            border: '2px dashed #1AC99F', 
            borderRadius: 2,
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: '#f0fdf4',
              borderColor: '#0E9A78'
            }
          }}>
            <input
              accept=".pdf"
              style={{ display: 'none' }}
              id="resume-upload"
              type="file"
              onChange={handleFileUpload}
            />
            <label htmlFor="resume-upload">
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                {formData.resume ? <AttachFileIcon sx={{ color: '#1AC99F', mr: 1 }} /> : <CloudUploadIcon sx={{ color: '#1AC99F', fontSize: 40 }} />}
              </Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                {formData.resume ? formData.resume.name : 'Upload Your Resume'}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                PDF only, Max 5MB
              </Typography>
              <Button
                variant="outlined"
                component="span"
                sx={{ textTransform: 'none', borderRadius: 2 }}
              >
                {formData.resume ? 'Change Resume' : 'Browse Files'}
              </Button>
            </label>
            {errors.resume && <Typography variant="caption" color="error" sx={{ display: 'block', mt: 1 }}>{errors.resume}</Typography>}
          </Paper>
        </Grid>
        
        <Grid item xs={12}>
          <Box sx={{ 
            p: 2, 
            bgcolor: '#f8f9fa', 
            borderRadius: 2,
            border: '1px solid #e9ecef'
          }}>
            <Typography variant="body2" sx={{ mb: 2, fontWeight: 600 }}>
              Data Processing Consent
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
              By submitting this application, you consent to Greon Xpert processing your personal data 
              for recruitment purposes in accordance with applicable data protection laws. Your data will 
              be stored securely and used only for recruitment-related activities.
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

const SuccessStep = ({ onClose, applicationId }) => (
  <Box sx={{ textAlign: 'center', py: 4 }}>
    <Avatar sx={{ bgcolor: '#4CAF50', width: 80, height: 80, mx: 'auto', mb: 3 }}>
      <CheckCircleIcon sx={{ fontSize: 40 }} />
    </Avatar>
    <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: '#4CAF50' }}>
      Application Submitted Successfully!
    </Typography>
    <Typography sx={{ mb: 3, color: 'text.secondary' }}>
      Thank you for your interest in joining Greon Xpert. We have received your application 
      and will review it carefully. If your profile matches our requirements, we'll contact you soon.
    </Typography>
    {applicationId && (
      <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
        Application ID: <strong>{applicationId}</strong>
      </Typography>
    )}
    <Button 
      variant="contained" 
      onClick={onClose}
      sx={{ 
        bgcolor: '#1AC99F', 
        '&:hover': { bgcolor: '#0E9A78' },
        borderRadius: 2,
        px: 4
      }}
    >
      Close
    </Button>
  </Box>
);

// Main Application Form Component
const ApplicationForm = ({ open, onClose, selectedJob, onSuccess, onError }) => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applicationId, setApplicationId] = useState('');
  
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '', currentLocation: '',
    experience: '', position: '', noticePeriod: '', expectedSalary: '', skills: '',
    degree: '', field: '', institution: '', year: '', motivation: '', resume: null,
    consentToDataProcessing: true
  });
  const [errors, setErrors] = useState({});

  const steps = ['Basic Details', 'Professional Info', 'Education', 'Documents', 'Submitted'];

  // Reset form when dialog is closed
  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setActiveStep(0);
      setFormData({
        firstName: '', lastName: '', email: '', phone: '', currentLocation: '',
        experience: '', position: '', noticePeriod: '', expectedSalary: '', skills: '',
        degree: '', field: '', institution: '', year: '', motivation: '', resume: null,
        consentToDataProcessing: true
      });
      setErrors({});
      setApplicationId('');
    }, 300);
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const newErrors = { ...errors };

    if (!file) return;

    if (file.type !== 'application/pdf') {
      newErrors.resume = 'Please upload a PDF file only.';
    } else if (file.size > 5 * 1024 * 1024) {
      newErrors.resume = 'File size cannot exceed 5MB.';
    } else {
      setFormData(prev => ({ ...prev, resume: file }));
      delete newErrors.resume;
    }

    setErrors(newErrors);
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 0) {
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required.';
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required.';
      if (!formData.email) {
        newErrors.email = 'Email is required.';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email is invalid.';
      }
      if (!formData.phone) newErrors.phone = 'Phone number is required.';
    }

    if (step === 1) {
      if (!formData.experience) newErrors.experience = 'Experience is required.';
      if (!formData.position.trim()) newErrors.position = 'Position is required.';
    }

    if (step === 2) {
      if (!formData.degree.trim()) newErrors.degree = 'Degree is required.';
      if (!formData.field.trim()) newErrors.field = 'Field of study is required.';
      if (!formData.institution.trim()) newErrors.institution = 'Institution is required.';
      if (!formData.year) {
        newErrors.year = 'Graduation year is required.';
      } else if (formData.year < 1950 || formData.year > 2030) {
        newErrors.year = 'Please enter a valid graduation year.';
      }
    }

    if (step === 3) {
      if (!formData.resume) newErrors.resume = 'Please upload your resume.';
    }

    return newErrors;
  };

  const handleNext = () => {
    const newErrors = validateStep(activeStep);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (activeStep < steps.length - 2) {
      setActiveStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    const newErrors = validateStep(activeStep);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (!selectedJob) {
      onError && onError('No job selected for application');
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare form data for submission
      const submitData = new FormData();
      
      // Basic information
      submitData.append('firstName', formData.firstName);
      submitData.append('lastName', formData.lastName);
      submitData.append('email', formData.email);
      submitData.append('phone', formData.phone);
      submitData.append('experience', formData.experience);
      submitData.append('position', formData.position);
      submitData.append('noticePeriod', formData.noticePeriod);
      submitData.append('consentToDataProcessing', formData.consentToDataProcessing);
      
      // Optional fields
      if (formData.currentLocation) submitData.append('location.current', formData.currentLocation);
      if (formData.expectedSalary) submitData.append('expectedSalary', formData.expectedSalary);
      if (formData.motivation) submitData.append('motivation', formData.motivation);
      
      // Skills array
      if (formData.skills) {
        const skillsArray = formData.skills.split(',').map(skill => skill.trim()).filter(Boolean);
        submitData.append('skills', JSON.stringify(skillsArray));
      }
      
      // Education information
      const education = {
        degree: formData.degree,
        field: formData.field,
        institution: formData.institution,
        year: parseInt(formData.year)
      };
      submitData.append('education.degree', education.degree);
      submitData.append('education.field', education.field);
      submitData.append('education.institution', education.institution);
      submitData.append('education.year', education.year);
      
      // Resume file
      if (formData.resume) {
        submitData.append('resume', formData.resume);
      }

      // Submit to backend
      const response = await axios.post(
        `${API_URL}/${selectedJob._id}/apply`,
        submitData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data?.success) {
        setApplicationId(response.data.data?.applicationId || '');
        setActiveStep(prev => prev + 1);
        onSuccess && onSuccess('Application submitted successfully! We will contact you soon.');
      } else {
        throw new Error(response.data?.message || 'Application submission failed');
      }
    } catch (error) {
      console.error('Application submission error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to submit application. Please try again.';
      onError && onError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{ sx: { borderRadius: 3, minHeight: '70vh' } }}
    >
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#1AC99F' }}>
            Job Application
          </Typography>
          <IconButton onClick={handleClose} sx={{ color: '#666' }}>
            <CloseIcon />
          </IconButton>
        </Box>

        {selectedJob && (
          <Box sx={{ mb: 3, p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1AC99F' }}>
              {selectedJob.jobRole}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Position: {selectedJob.jobRole} • Experience: {selectedJob.experienceRequired} • Location: {selectedJob.location}
            </Typography>
          </Box>
        )}

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <DialogContent sx={{ px: 0 }}>
          {activeStep === 0 && <BasicDetailsStep formData={formData} handleFormChange={handleFormChange} errors={errors} />}
          {activeStep === 1 && <ProfessionalInfoStep formData={formData} handleFormChange={handleFormChange} errors={errors} />}
          {activeStep === 2 && <EducationStep formData={formData} handleFormChange={handleFormChange} errors={errors} />}
          {activeStep === 3 && <DocumentsStep formData={formData} handleFormChange={handleFormChange} handleFileUpload={handleFileUpload} errors={errors} />}
          {activeStep === 4 && <SuccessStep onClose={handleClose} applicationId={applicationId} />}
        </DialogContent>

        {activeStep < steps.length - 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button
              onClick={handleBack}
              disabled={activeStep === 0}
              sx={{ textTransform: 'none' }}
            >
              Back
            </Button>
            
            {activeStep === steps.length - 2 ? (
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={isSubmitting}
                startIcon={isSubmitting ? <CircularProgress size={16} /> : <SendIcon />}
                sx={{ 
                  textTransform: 'none', 
                  borderRadius: 2, 
                  px: 4, 
                  py: 1.2, 
                  fontSize: '1rem', 
                  fontWeight: 600,
                  bgcolor: '#1AC99F',
                  '&:hover': { bgcolor: '#0E9A78' }
                }}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                sx={{ 
                  textTransform: 'none',
                  bgcolor: '#1AC99F',
                  '&:hover': { bgcolor: '#0E9A78' }
                }}
              >
                Next
              </Button>
            )}
          </Box>
        )}
      </Box>
    </Dialog>
  );
};

export default ApplicationForm;
