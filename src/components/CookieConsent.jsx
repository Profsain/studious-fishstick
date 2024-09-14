import React, { useState, useEffect } from 'react';
import { Box, Typography, Checkbox, FormControlLabel, Button, Modal, Fade, Backdrop, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const CookieConsent = () => {
  const [consent, setConsent] = useState({
    necessary: true,
    analytics: false,
    advertising: false,
    functional: false,
  });
  const [open, setOpen] = useState(true);

  // Handle checkbox changes
  const handleConsentChange = (event) => {
    setConsent({
      ...consent,
      [event.target.name]: event.target.checked,
    });
  };

  // Handle form submission
  const handleSubmit = () => {
    // Store consent preferences and close modal
    setOpen(false);
  };

  // Handle closing the modal without saving
  const handleClose = () => {
    setOpen(false);
  };

  // Check for existing consent on component mount
  useEffect(() => {
    // Load consent from cookies or local storage
  }, []);

  return (
    <Modal
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-description"
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <Box
          sx={{
            backgroundColor: 'background.paper',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
            outline: 'none',
            position: 'absolute',
            bottom: '20px',
            right: '20px',
            width: '350px', // Adjust width as needed
          }}
        >
          {/* Close Button */}
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{ position: 'absolute', top: 8, right: 8 }}
          >
            <CloseIcon />
          </IconButton>

          {/* Cookie Consent Content */}
          <Typography variant="h6" id="cookie-consent-title" sx={{ mb: 2 }}>Cookie Consent</Typography>
          <Typography variant="body2" id="cookie-consent-description" sx={{ mb: 3, textAlign: 'center' }}>
            Welcome to Splinx Planet Admin Dashboard. We use cookies to personalize your experience, monitor performance, and enhance security. Please select which cookies you'd like to allow. This helps us ensure your dashboard operates smoothly and meets your preferences.
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', mb: 3 }}>
            <FormControlLabel
              control={<Checkbox checked={consent.analytics} onChange={handleConsentChange} name="analytics" />}
              label="Analytics Cookies"
              sx={{ marginBottom: '10px' }}
            />
            <FormControlLabel
              control={<Checkbox checked={consent.advertising} onChange={handleConsentChange} name="advertising" />}
              label="Advertising Cookies"
              sx={{ marginBottom: '10px' }}
            />
            <FormControlLabel
              control={<Checkbox checked={consent.functional} onChange={handleConsentChange} name="functional" />}
              label="Functional Cookies"
            />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            {/* Close button next to Save Preferences */}
            <Button variant="outlined" onClick={handleClose}>Close</Button>
            <Button variant="contained" onClick={handleSubmit}>Save Preferences</Button>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default CookieConsent;
