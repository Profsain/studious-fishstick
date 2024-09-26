import React, { useState, useEffect, useContext } from 'react';
import {
  Box, Typography, TextField, Button, Grid, Paper, CircularProgress, 
  Alert, AlertTitle, FormControlLabel, Checkbox,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { tokens } from '../../theme';
import AuthContext from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from 'dayjs';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const EditEvent = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;
  const { token } = useContext(AuthContext);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [formData, setFormData] = useState({
    eventName: '',
    eventDescription: '',
    eventImage: '',
    eventDate: dayjs(),
    eventTime: '',
    eventLocation: '',
    eventUserRules: '',
    eventCost: 0,
    isEventCostSplitted: false, 
    eventCategory: '',
    eventHashtag: '',
    isPopular: false,
    isUpcoming: true, 
    isOpen: true,
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${apiUrl}/event/${eventId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setFormData(data); 
      } catch (error) {
        console.error('Error fetching event:', error);
        setError('An error occurred while fetching the event details.');
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchEvent();
    }
  }, [eventId, token, apiUrl]);

  const handleCancel = () => {
    navigate('/events'); // Adjust the route as necessary
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'isEventCostSplitted' || name === 'isPopular' || name === 'isUpcoming' || name === 'isOpen') {
      setFormData((prev) => ({ ...prev, [name]: e.target.checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null); 

    try {
      const response = await fetch(`${apiUrl}/events/${eventId}`, { 
        method: 'PUT', 
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json(); 
        setError(errorData.message || 'An error occurred. Please try again.');
        throw new Error('An error occurred while updating the event.');
      }

      Swal.fire({
        title: 'Success!',
        text: `${formData.eventName} has been updated successfully!`,
        icon: 'success',
        confirmButtonColor: colors.greenAccent[600], 
      }).then(() => {
        navigate('/events');
      });
    } catch (error) {
      console.error('Error updating event:', error);
      Swal.fire({
        title: 'Error!',
        text: 'An error occurred. Please try again.',
        icon: 'error',
        confirmButtonColor: colors.greenAccent[600], 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box m="20px">
      <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
        <Typography variant="h2" fontWeight="600" color={colors.greenAccent[500]}>
          Edit Event
        </Typography>
        <Button
          variant="outlined"
          onClick={handleCancel} 
          sx={{
            mb: 2,
            color: colors.grey[100],
            borderColor: colors.grey[400],
            '&:hover': {
              borderColor: colors.grey[500],
            },
          }}
        >
          Cancel
        </Button>
      </Grid>

      <Typography variant="body1" color={colors.grey[100]}>
        Edit the event details below.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          <AlertTitle>Error</AlertTitle>
          {error}
        </Alert>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper elevation={3} sx={{ padding: 3, marginTop: 2 }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              {/* Event Name */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Event Name"
                  name="eventName"
                  value={formData.eventName}
                  onChange={handleChange}
                  required
                  InputLabelProps={{ style: { color: '#fff' } }}
                  sx={{
                    input: { color: '#fff' },
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: '#ffb554' },
                      '&:hover fieldset': { borderColor: '#ffb554' },
                      '&.Mui-focused fieldset': { borderColor: '#ffb554' }
                    }
                  }}
                />
              </Grid>

              {/* Event Description */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Event Description"
                  name="eventDescription"
                  value={formData.eventDescription}
                  onChange={handleChange}
                  required
                  multiline
                  rows={4} 
                  InputLabelProps={{ style: { color: '#fff' } }}
                  sx={{
                    input: { color: '#fff' },
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: '#ffb554' },
                      '&:hover fieldset': { borderColor: '#ffb554' },
                      '&.Mui-focused fieldset': { borderColor: '#ffb554' }
                    }
                  }}
                />
              </Grid>

              {/* Event Image URL */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Event Banner URL"
                  name="eventImage"
                  value={formData.eventImage}
                  onChange={handleChange}
                  required
                  InputLabelProps={{ style: { color: '#fff' } }}
                  sx={{
                    input: { color: '#fff' },
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: '#ffb554' },
                      '&:hover fieldset': { borderColor: '#ffb554' },
                      '&.Mui-focused fieldset': { borderColor: '#ffb554' }
                    }
                  }}
                />
              </Grid>

              {/* Event Date Picker */}
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker 
                    label="Event Date"
                    value={formData.eventDate} 
                    onChange={(newDate) => setFormData({ ...formData, eventDate: newDate })}
                    renderInput={(params) => (
                      <TextField 
                        {...params} 
                        fullWidth 
                        required
                        InputLabelProps={{ style: { color: '#fff' } }} 
                        sx={{
                          input: { color: '#fff' },
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': { borderColor: '#ffb554' },
                            '&:hover fieldset': { borderColor: '#ffb554' },
                            '&.Mui-focused fieldset': { borderColor: '#ffb554' }
                          }
                        }}
                      />
                    )}
                  />
                </LocalizationProvider>
              </Grid>

               {/* Event Time - Now a TimePicker */}
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <TimePicker 
                    label="Event Time"
                    value={formData.eventTime ? dayjs(formData.eventTime) : null}
                    onChange={(newTime) => setFormData({ ...formData, eventTime: newTime })}
                    renderInput={(params) => (
                      <TextField 
                        {...params} 
                        fullWidth 
                        required
                        InputLabelProps={{ style: { color: '#fff' } }} 
                        sx={{
                          input: { color: '#fff' },
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': { borderColor: '#ffb554' },
                            '&:hover fieldset': { borderColor: '#ffb554' },
                            '&.Mui-focused fieldset': { borderColor: '#ffb554' }
                          }
                        }}
                      />
                    )}
                  />
                </LocalizationProvider>
              </Grid>

              {/* Event Cost */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Event Cost"
                  name="eventCost"
                  type="number"
                  value={formData.eventCost}
                  onChange={handleChange}
                  InputLabelProps={{ style: { color: '#fff' } }}
                  sx={{
                    input: { color: '#fff' },
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: '#ffb554' },
                      '&:hover fieldset': { borderColor: '#ffb554' },
                      '&.Mui-focused fieldset': { borderColor: '#ffb554' }
                    }
                  }}
                />
              </Grid>

              {/* Event Category */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Event Category"
                  name="eventCategory"
                  value={formData.eventCategory}
                  onChange={handleChange}
                  required
                  InputLabelProps={{ style: { color: '#fff' } }}
                  sx={{
                    input: { color: '#fff' },
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: '#ffb554' },
                      '&:hover fieldset': { borderColor: '#ffb554' },
                      '&.Mui-focused fieldset': { borderColor: '#ffb554' }
                    }
                  }}
                />
              </Grid>

              {/* Event Hashtag */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Event Hashtag"
                  name="eventHashtag"
                  value={formData.eventHashtag}
                  onChange={handleChange}
                  InputLabelProps={{ style: { color: '#fff' } }}
                  sx={{
                    input: { color: '#fff' },
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: '#ffb554' },
                      '&:hover fieldset': { borderColor: '#ffb554' },
                      '&.Mui-focused fieldset': { borderColor: '#ffb554' }
                    }
                  }}
                />
              </Grid>

              {/* Event User Rules */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Event User Rules"
                  name="eventUserRules"
                  value={formData.eventUserRules}
                  onChange={handleChange}
                  InputLabelProps={{ style: { color: '#fff' } }}
                  sx={{
                    input: { color: '#fff' },
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: '#ffb554' },
                      '&:hover fieldset': { borderColor: '#ffb554' },
                      '&.Mui-focused fieldset': { borderColor: '#ffb554' }
                    }
                  }}
                />
              </Grid>

              {/* Checkboxes */}
              <Grid item xs={12} sm={4}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.isEventCostSplitted}
                      onChange={handleChange}
                      name="isEventCostSplitted"
                    />
                  }
                  label="Is Event Cost Splitted?"
                  sx={{
                    "& .MuiFormControlLabel-label": {
                      color: colors.grey[100],
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.isPopular}
                      onChange={handleChange}
                      name="isPopular"
                    />
                  }
                  label="Is Popular?"
                  sx={{
                    "& .MuiFormControlLabel-label": {
                      color: colors.grey[100],
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.isUpcoming}
                      onChange={handleChange}
                      name="isUpcoming"
                    />
                  }
                  label="Is Upcoming?"
                  sx={{
                    "& .MuiFormControlLabel-label": {
                      color: colors.grey[100],
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.isOpen}
                      onChange={handleChange}
                      name="isOpen"
                    />
                  }
                  label="Is Open?"
                  sx={{
                    "& .MuiFormControlLabel-label": {
                      color: colors.grey[100],
                    },
                  }}
                />
              </Grid>

              {/* Submit Button (Centered) */}
              <Grid container justifyContent="center" alignItems="center">
                <Grid item md={4}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{
                      backgroundColor: colors.greenAccent[600],
                      color: "white",
                      fontSize: "16px",
                      fontWeight: "bold",
                      padding: "12px",
                      textTransform: "none",
                      "&:hover": {
                        backgroundColor: colors.greenAccent[700],
                        transform: "scale(1.02)",
                        transition: "transform 0.2s ease-in-out",
                      },
                      mt: 2,
                    }}
                  >
                    {loading ? (
                      <CircularProgress color="inherit" size={24} />
                    ) : (
                      "Create Event"
                    )}
                  </motion.button>
                </Grid>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </motion.div>
    </Box>
  );
};

export default EditEvent;