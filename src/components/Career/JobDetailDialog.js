import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  IconButton,
  Button,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Grid,
  Paper
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import WorkIcon from '@mui/icons-material/Work';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ScheduleIcon from '@mui/icons-material/Schedule';
import StarIcon from '@mui/icons-material/Star';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SendIcon from '@mui/icons-material/Send';

const JobDetailDialog = ({ open, onClose, job, onApply }) => {
  const theme = useTheme();

  if (!job) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[50]} 100%)`,
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main}10, ${theme.palette.secondary.main}10)`,
          borderBottom: `1px solid ${theme.palette.primary.main}20`,
          position: 'relative',
          pb: 2
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <WorkIcon sx={{ color: theme.palette.primary.main, fontSize: 28 }} />
              <Typography variant="h5" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                {job.jobRole}
              </Typography>
            </Box>
            
            {/* Job Meta Info */}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationOnIcon sx={{ fontSize: 18, color: theme.palette.secondary.main }} />
                  <Typography variant="body2" color="text.secondary">
                    {job.location}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ScheduleIcon sx={{ fontSize: 18, color: theme.palette.secondary.main }} />
                  <Typography variant="body2" color="text.secondary">
                    {job.jobType}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <StarIcon sx={{ fontSize: 18, color: theme.palette.secondary.main }} />
                  <Typography variant="body2" color="text.secondary">
                    {job.experienceRequired} required
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AccessTimeIcon sx={{ fontSize: 18, color: theme.palette.secondary.main }} />
                  <Typography variant="body2" color="text.secondary">
                    Join in: {job.joiningTime}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
          
          <IconButton
            onClick={onClose}
            sx={{
              color: theme.palette.primary.main,
              '&:hover': { backgroundColor: `${theme.palette.primary.main}10` }
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ p: 4 }}>
          {/* Job Image */}
          <Paper
            sx={{
              mb: 4,
              borderRadius: 3,
              overflow: 'hidden',
              height: 200,
              backgroundImage: `url(${job.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: `linear-gradient(45deg, ${theme.palette.primary.main}20, ${theme.palette.secondary.main}10)`,
              }
            }}
          />

          {/* Job Description */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.primary.main, mb: 2 }}>
              Job Description
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
              {job.jobDescription}
            </Typography>
          </Box>

          {/* Responsibilities */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.primary.main, mb: 2 }}>
              Key Responsibilities
            </Typography>
            <List sx={{ py: 0 }}>
              {job.responsibilities.map((responsibility, index) => (
                <ListItem key={index} sx={{ py: 0.5, pl: 0 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <CheckCircleIcon sx={{ color: theme.palette.primary.main, fontSize: 20 }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary={responsibility}
                    sx={{
                      '& .MuiListItemText-primary': {
                        fontSize: '0.9rem',
                        color: 'text.secondary',
                        lineHeight: 1.6
                      }
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>

          {/* Skills & Requirements */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.primary.main, mb: 2 }}>
              Required Skills
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {job.skills.map((skill, index) => (
                <Chip
                  key={index}
                  label={skill}
                  sx={{
                    backgroundColor: `${theme.palette.primary.main}15`,
                    color: theme.palette.primary.main,
                    fontWeight: 500
                  }}
                />
              ))}
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 4, pt: 2, gap: 2 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            px: 4,
            py: 1
          }}
        >
          Close
        </Button>
        <Button
          onClick={() => onApply(job)}
          variant="contained"
          startIcon={<SendIcon />}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            px: 4,
            py: 1,
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            '&:hover': {
              background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.primary.main} 100%)`,
            }
          }}
        >
          Apply for this Position
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default JobDetailDialog;
