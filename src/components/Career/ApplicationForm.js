// src/components/Career/ApplicationForm.js - Backend Integration

import React, { useMemo, useState } from 'react';
import {
  Dialog, DialogContent, TextField, Button, Grid, Typography, Box,
  IconButton, FormControl, InputLabel, Select, MenuItem,
  Avatar, Step, Stepper, StepLabel, CircularProgress, Stack, Divider,
  RadioGroup, Radio, FormControlLabel, FormGroup, Checkbox, OutlinedInput,
  Chip, Alert
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import axios from 'axios';
import { API_BASE } from '../../utils/api';

// API Configuration
const API_URL = `${API_BASE}/api/careers`;

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

// Groups a job's custom questions by their section, in first-seen order
const groupQuestionsBySection = (questions) => {
  const map = new Map();
  (questions || []).forEach(q => {
    const section = q.section || 'General';
    if (!map.has(section)) map.set(section, []);
    map.get(section).push(q);
  });
  return Array.from(map.entries()).map(([section, sectionQuestions]) => ({ section, questions: sectionQuestions }));
};

// Splits a free-text full name into first/last, falling back sensibly for single-word names
const splitFullName = (fullName) => {
  const trimmed = (fullName || '').trim();
  if (!trimmed) return { firstName: '', lastName: '' };
  const parts = trimmed.split(/\s+/);
  return {
    firstName: parts[0],
    lastName: parts.length > 1 ? parts.slice(1).join(' ') : parts[0]
  };
};

// The backend requires firstName/lastName/email/phone/resumeUrl on every application.
// Rather than asking for them again when the admin already drafted equivalent custom
// questions (e.g. "Full name", "Email", "Link to your CV"), find the best-matching
// question for each and reuse its answer — so applicants aren't asked twice.
const buildContactQuestionMap = (questions) => {
  const map = {};
  (questions || []).forEach(q => {
    const text = q.questionText.toLowerCase();
    if (!map.resumeUrl && q.questionType === 'link' && /(cv|resume)/.test(text)) {
      map.resumeUrl = q._id;
    } else if (!map.email && /email/.test(text)) {
      map.email = q._id;
    } else if (!map.phone && /(phone|whatsapp|mobile)/.test(text)) {
      map.phone = q._id;
    } else if (!map.fullName && /\bname\b/.test(text) && !/(college|university|institution|company)/.test(text)) {
      map.fullName = q._id;
    }
  });
  return map;
};

// Renders a single custom question using the answer type it was drafted with
const QuestionField = ({ q, answers, handleAnswerChange, errors, theme }) => {
  const errorKey = `q_${q._id}`;

  if (q.questionType === 'text' || q.questionType === 'link') {
    return (
      <TextField
        fullWidth label={q.questionText} required={q.required}
        placeholder={q.questionType === 'link' ? 'https://...' : undefined}
        value={answers[q._id] || ''}
        onChange={(e) => handleAnswerChange(q._id, e.target.value)}
        sx={commonInputStyles(theme)}
        error={!!errors[errorKey]} helperText={errors[errorKey]}
      />
    );
  }

  if (q.questionType === 'textarea') {
    return (
      <TextField
        fullWidth multiline rows={4} label={q.questionText} required={q.required}
        value={answers[q._id] || ''}
        onChange={(e) => handleAnswerChange(q._id, e.target.value)}
        sx={commonInputStyles(theme)}
        error={!!errors[errorKey]} helperText={errors[errorKey]}
      />
    );
  }

  if (q.questionType === 'number') {
    return (
      <TextField
        fullWidth type="number" label={q.questionText} required={q.required}
        value={answers[q._id] ?? ''}
        onChange={(e) => handleAnswerChange(q._id, e.target.value)}
        sx={commonInputStyles(theme)}
        error={!!errors[errorKey]} helperText={errors[errorKey]}
      />
    );
  }

  if (q.questionType === 'yesno') {
    return (
      <Box>
        <Typography variant="body2" sx={{ mb: 0.5 }}>{q.questionText}{q.required && ' *'}</Typography>
        <RadioGroup
          row
          value={answers[q._id] === undefined ? '' : String(answers[q._id])}
          onChange={(e) => handleAnswerChange(q._id, e.target.value === 'true')}
        >
          <FormControlLabel value="true" control={<Radio />} label="Yes" />
          <FormControlLabel value="false" control={<Radio />} label="No" />
        </RadioGroup>
        {errors[errorKey] && <Typography variant="caption" color="error">{errors[errorKey]}</Typography>}
      </Box>
    );
  }

  if (q.questionType === 'radio') {
    return (
      <Box>
        <Typography variant="body2" sx={{ mb: 0.5 }}>{q.questionText}{q.required && ' *'}</Typography>
        <RadioGroup value={answers[q._id] ?? ''} onChange={(e) => handleAnswerChange(q._id, e.target.value)}>
          {(q.options || []).map((opt, oi) => (
            <FormControlLabel key={oi} value={opt} control={<Radio />} label={opt} />
          ))}
        </RadioGroup>
        {errors[errorKey] && <Typography variant="caption" color="error">{errors[errorKey]}</Typography>}
      </Box>
    );
  }

  if (q.questionType === 'checkbox') {
    const selected = Array.isArray(answers[q._id]) ? answers[q._id] : [];
    return (
      <Box>
        <Typography variant="body2" sx={{ mb: 0.5 }}>{q.questionText}{q.required && ' *'}</Typography>
        <FormGroup>
          {(q.options || []).map((opt, oi) => (
            <FormControlLabel
              key={oi}
              control={
                <Checkbox
                  checked={selected.includes(opt)}
                  onChange={(e) => {
                    const next = e.target.checked ? [...selected, opt] : selected.filter(s => s !== opt);
                    handleAnswerChange(q._id, next);
                  }}
                />
              }
              label={opt}
            />
          ))}
        </FormGroup>
        {errors[errorKey] && <Typography variant="caption" color="error">{errors[errorKey]}</Typography>}
      </Box>
    );
  }

  if (q.questionType === 'dropdown') {
    return (
      <FormControl fullWidth required={q.required} error={!!errors[errorKey]}>
        <InputLabel>{q.questionText}</InputLabel>
        <Select value={answers[q._id] ?? ''} label={q.questionText} onChange={(e) => handleAnswerChange(q._id, e.target.value)}>
          {(q.options || []).map((opt, oi) => <MenuItem key={oi} value={opt}>{opt}</MenuItem>)}
        </Select>
        {errors[errorKey] && <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>{errors[errorKey]}</Typography>}
      </FormControl>
    );
  }

  if (q.questionType === 'multiselect') {
    const selected = Array.isArray(answers[q._id]) ? answers[q._id] : [];
    return (
      <FormControl fullWidth required={q.required} error={!!errors[errorKey]}>
        <InputLabel>{q.questionText}</InputLabel>
        <Select
          multiple
          value={selected}
          onChange={(e) => {
            const { value } = e.target;
            handleAnswerChange(q._id, typeof value === 'string' ? value.split(',') : value);
          }}
          input={<OutlinedInput label={q.questionText} />}
          renderValue={(sel) => (
            <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
              {sel.map((val) => <Chip key={val} label={val} size="small" />)}
            </Stack>
          )}
        >
          {(q.options || []).map((opt, oi) => (
            <MenuItem key={oi} value={opt}>
              <Checkbox checked={selected.includes(opt)} />
              {opt}
            </MenuItem>
          ))}
        </Select>
        {errors[errorKey] && <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>{errors[errorKey]}</Typography>}
      </FormControl>
    );
  }

  return null;
};

// One step per drafted question section
const SectionStep = ({ section, questions, answers, handleAnswerChange, errors }) => {
  const theme = useTheme();
  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 3, color: '#1AC99F', fontWeight: 600 }}>
        {section}
      </Typography>
      <Stack spacing={3}>
        {questions.map((q) => (
          <QuestionField key={q._id} q={q} answers={answers} handleAnswerChange={handleAnswerChange} errors={errors} theme={theme} />
        ))}
      </Stack>
    </Box>
  );
};

// Fallback step shown only for whichever backend-required contact fields (name/email/
// phone/resume link) could NOT be matched to one of the admin's drafted questions
const ContactFallbackStep = ({ missingFields, contactOverrides, handleContactOverride, errors }) => {
  const theme = useTheme();
  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 1, color: '#1AC99F', fontWeight: 600 }}>
        A Few More Details
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        We need these to process your application.
      </Typography>
      <Grid container spacing={3}>
        {missingFields.includes('firstName') && (
          <>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth label="First Name" required
                value={contactOverrides.firstName}
                onChange={(e) => handleContactOverride('firstName', e.target.value)}
                sx={commonInputStyles(theme)}
                error={!!errors.firstName} helperText={errors.firstName}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth label="Last Name" required
                value={contactOverrides.lastName}
                onChange={(e) => handleContactOverride('lastName', e.target.value)}
                sx={commonInputStyles(theme)}
                error={!!errors.lastName} helperText={errors.lastName}
              />
            </Grid>
          </>
        )}
        {missingFields.includes('email') && (
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth label="Email Address" type="email" required
              value={contactOverrides.email}
              onChange={(e) => handleContactOverride('email', e.target.value)}
              sx={commonInputStyles(theme)}
              error={!!errors.email} helperText={errors.email}
            />
          </Grid>
        )}
        {missingFields.includes('phone') && (
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth label="Phone Number" required
              placeholder="+91XXXXXXXXXX"
              value={contactOverrides.phone}
              onChange={(e) => handleContactOverride('phone', e.target.value)}
              sx={commonInputStyles(theme)}
              error={!!errors.phone} helperText={errors.phone}
            />
          </Grid>
        )}
        {missingFields.includes('resumeUrl') && (
          <Grid item xs={12}>
            <TextField
              fullWidth label="Resume / CV Link" required
              placeholder="https://drive.google.com/..."
              value={contactOverrides.resumeUrl}
              onChange={(e) => handleContactOverride('resumeUrl', e.target.value)}
              sx={commonInputStyles(theme)}
              error={!!errors.resumeUrl}
              helperText={errors.resumeUrl || 'Upload to Google Drive/Dropbox, set sharing to "Anyone with the link", and paste it here.'}
            />
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

const ReviewStep = ({ contact, consent, setConsent, errors }) => (
  <Box>
    <Typography variant="h6" sx={{ mb: 3, color: '#1AC99F', fontWeight: 600 }}>
      Review & Consent
    </Typography>
    <Grid container spacing={2} sx={{ mb: 3 }}>
      <Grid item xs={12} sm={6}>
        <Typography variant="caption" color="text.secondary">Name</Typography>
        <Typography variant="body1">{contact.firstName} {contact.lastName}</Typography>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Typography variant="caption" color="text.secondary">Email</Typography>
        <Typography variant="body1">{contact.email}</Typography>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Typography variant="caption" color="text.secondary">Phone</Typography>
        <Typography variant="body1">{contact.phone}</Typography>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Typography variant="caption" color="text.secondary">Resume / CV</Typography>
        <Typography variant="body1" sx={{ wordBreak: 'break-all' }}>{contact.resumeUrl}</Typography>
      </Grid>
    </Grid>
    <Divider sx={{ mb: 3 }} />
    <Box sx={{ p: 2, bgcolor: '#f8f9fa', borderRadius: 2, border: '1px solid #e9ecef' }}>
      <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
        Data Processing Consent
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6, mb: 1.5 }}>
        By submitting this application, you consent to Greon Xpert processing your personal data
        for recruitment purposes in accordance with applicable data protection laws. Your data will
        be stored securely and used only for recruitment-related activities.
      </Typography>
      <FormControlLabel
        control={<Checkbox checked={consent} onChange={(e) => setConsent(e.target.checked)} />}
        label="I consent to Greon Xpert processing my personal data for recruitment purposes. *"
      />
      {errors.consentToDataProcessing && (
        <Typography variant="caption" color="error" display="block">{errors.consentToDataProcessing}</Typography>
      )}
    </Box>
  </Box>
);

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
      sx={{ bgcolor: '#1AC99F', '&:hover': { bgcolor: '#0E9A78' }, borderRadius: 2, px: 4 }}
    >
      Close
    </Button>
  </Box>
);

const emptyContactOverrides = { firstName: '', lastName: '', email: '', phone: '', resumeUrl: '' };

// Main Application Form Component
const ApplicationForm = ({ open, onClose, selectedJob, onSuccess, onError }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applicationId, setApplicationId] = useState('');

  const [answers, setAnswers] = useState({});
  const [contactOverrides, setContactOverrides] = useState(emptyContactOverrides);
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState({});

  const sections = useMemo(() => groupQuestionsBySection(selectedJob?.customQuestions), [selectedJob]);
  const questionMap = useMemo(() => buildContactQuestionMap(selectedJob?.customQuestions), [selectedJob]);

  const missingContactFields = useMemo(() => {
    const missing = [];
    if (!questionMap.fullName) missing.push('firstName');
    if (!questionMap.email) missing.push('email');
    if (!questionMap.phone) missing.push('phone');
    if (!questionMap.resumeUrl) missing.push('resumeUrl');
    return missing;
  }, [questionMap]);

  const stepDefs = useMemo(() => {
    const steps = sections.map(s => ({ key: `section::${s.section}`, label: s.section, questions: s.questions }));
    if (missingContactFields.length > 0) {
      steps.push({ key: 'contact', label: 'Contact Details' });
    }
    steps.push({ key: 'review', label: 'Review & Consent' });
    steps.push({ key: 'submitted', label: 'Submitted' });
    return steps;
  }, [sections, missingContactFields]);

  // Resolves the final contact value for a field, preferring a matched custom question's
  // answer and falling back to whatever was typed in the fallback Contact Details step
  const getContact = () => {
    const name = questionMap.fullName ? splitFullName(answers[questionMap.fullName]) : null;
    return {
      firstName: name ? name.firstName : contactOverrides.firstName,
      lastName: name ? name.lastName : contactOverrides.lastName,
      email: questionMap.email ? (answers[questionMap.email] || '') : contactOverrides.email,
      phone: questionMap.phone ? (answers[questionMap.phone] || '') : contactOverrides.phone,
      resumeUrl: questionMap.resumeUrl ? (answers[questionMap.resumeUrl] || '') : contactOverrides.resumeUrl
    };
  };

  const resetForm = () => {
    setActiveStep(0);
    setAnswers({});
    setContactOverrides(emptyContactOverrides);
    setConsent(false);
    setErrors({});
    setApplicationId('');
  };

  const handleClose = () => {
    onClose();
    setTimeout(resetForm, 300);
  };

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
    const errorKey = `q_${questionId}`;
    if (errors[errorKey]) setErrors(prev => ({ ...prev, [errorKey]: null }));
  };

  const handleContactOverride = (field, value) => {
    setContactOverrides(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step.key.startsWith('section::')) {
      step.questions.forEach(q => {
        if (!q.required) return;
        const val = answers[q._id];
        const isEmpty = val === undefined || val === null || val === '' || (Array.isArray(val) && val.length === 0);
        if (isEmpty) newErrors[`q_${q._id}`] = 'This question is required.';
      });
    }

    if (step.key === 'contact') {
      if (missingContactFields.includes('firstName')) {
        if (!contactOverrides.firstName.trim()) newErrors.firstName = 'First name is required.';
        if (!contactOverrides.lastName.trim()) newErrors.lastName = 'Last name is required.';
      }
      if (missingContactFields.includes('email')) {
        if (!/\S+@\S+\.\S+/.test(contactOverrides.email)) newErrors.email = 'Enter a valid email address.';
      }
      if (missingContactFields.includes('phone')) {
        if (!/^[+]?[0-9]{10,15}$/.test(contactOverrides.phone)) newErrors.phone = 'Enter a valid phone number.';
      }
      if (missingContactFields.includes('resumeUrl')) {
        if (!/^https?:\/\/.+/.test(contactOverrides.resumeUrl.trim())) newErrors.resumeUrl = 'Provide a valid resume/CV link.';
      }
    }

    if (step.key === 'review') {
      const contact = getContact();
      if (!contact.firstName.trim() || !contact.lastName.trim()) newErrors.name = 'Name is missing.';
      if (!/\S+@\S+\.\S+/.test(contact.email)) newErrors.email = 'A valid email is missing.';
      if (!/^[+]?[0-9]{10,15}$/.test(contact.phone)) newErrors.phone = 'A valid phone number is missing.';
      if (!/^https?:\/\/.+/.test(contact.resumeUrl.trim())) newErrors.resumeUrl = 'A resume/CV link is missing.';
      if (!consent) newErrors.consentToDataProcessing = 'You must consent to data processing to apply.';
    }

    return newErrors;
  };

  const handleNext = () => {
    const newErrors = validateStep(stepDefs[activeStep]);
    if (Object.keys(newErrors).length > 0) {
      setErrors(prev => ({ ...prev, ...newErrors }));
      return;
    }
    if (activeStep < stepDefs.length - 2) setActiveStep(prev => prev + 1);
  };

  const handleBack = () => {
    if (activeStep > 0) setActiveStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    const newErrors = validateStep(stepDefs[activeStep]);
    if (Object.keys(newErrors).length > 0) {
      setErrors(prev => ({ ...prev, ...newErrors }));
      return;
    }

    if (!selectedJob) {
      onError && onError('No job selected for application');
      return;
    }

    setIsSubmitting(true);

    try {
      const contact = getContact();
      const payload = {
        firstName: contact.firstName,
        lastName: contact.lastName,
        email: contact.email,
        phone: contact.phone,
        resumeUrl: contact.resumeUrl,
        consentToDataProcessing: true,
        answers: (selectedJob.customQuestions || []).map(q => ({
          questionId: q._id,
          answer: answers[q._id]
        }))
      };

      const response = await axios.post(`${API_URL}/${selectedJob._id}/apply`, payload);

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

  const currentStep = stepDefs[activeStep];
  const currentKey = currentStep?.key;

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
              {[
                selectedJob.experienceRequired && `Experience: ${selectedJob.experienceRequired}`,
                selectedJob.location && `Location: ${selectedJob.location}`
              ].filter(Boolean).join(' • ')}
            </Typography>
          </Box>
        )}

        {!selectedJob && (
          <Alert severity="warning" sx={{ mb: 3, borderRadius: 2 }}>
            No job selected. Please close this and pick a role to apply for.
          </Alert>
        )}

        <Stepper activeStep={activeStep} sx={{ mb: 4, flexWrap: 'wrap', rowGap: 2 }}>
          {stepDefs.map((step) => (
            <Step key={step.key}>
              <StepLabel>{step.label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <DialogContent sx={{ px: 0 }}>
          {currentKey?.startsWith('section::') && (
            <SectionStep
              section={currentStep.label}
              questions={currentStep.questions}
              answers={answers}
              handleAnswerChange={handleAnswerChange}
              errors={errors}
            />
          )}
          {currentKey === 'contact' && (
            <ContactFallbackStep
              missingFields={missingContactFields}
              contactOverrides={contactOverrides}
              handleContactOverride={handleContactOverride}
              errors={errors}
            />
          )}
          {currentKey === 'review' && (
            <ReviewStep contact={getContact()} consent={consent} setConsent={setConsent} errors={errors} />
          )}
          {currentKey === 'submitted' && (
            <SuccessStep onClose={handleClose} applicationId={applicationId} />
          )}
        </DialogContent>

        {currentKey !== 'submitted' && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button onClick={handleBack} disabled={activeStep === 0} sx={{ textTransform: 'none' }}>
              Back
            </Button>

            {activeStep === stepDefs.length - 2 ? (
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={isSubmitting || !selectedJob}
                startIcon={isSubmitting ? <CircularProgress size={16} /> : <SendIcon />}
                sx={{
                  textTransform: 'none', borderRadius: 2, px: 4, py: 1.2, fontSize: '1rem', fontWeight: 600,
                  bgcolor: '#1AC99F', '&:hover': { bgcolor: '#0E9A78' }
                }}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                sx={{ textTransform: 'none', bgcolor: '#1AC99F', '&:hover': { bgcolor: '#0E9A78' } }}
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
