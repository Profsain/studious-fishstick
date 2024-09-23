import React, { useState } from 'react';
import Swal from 'sweetalert2';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Modal,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  IconButton,
  InputAdornment,
  Avatar, 
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { tokens } from '../../theme';
import '../../index.css';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const EditModal = ({ open, onClose, initialValues, onSubmit, title }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [formData, setFormData] = useState({
    ...initialValues,
    nextOfKin: initialValues?.nextOfKin || { // Always initialize nextOfKin 
      fullName: '',
      phoneNumber: '',
      email: '',
      address: '',
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); 

    // Basic Validation: Check for empty required fields (excluding password)
    for (const key in formData) {
      if (
        key !== 'password' && 
        key !== 'confirmPassword' && 
        key !== 'nextOfKin' && 
        formData[key] === ''
      ) {
        setError('Please fill in all required fields.');
        return;
      }

      if (key === 'nextOfKin' && Object.values(formData[key]).some(val => val === '')) {
        setError('Please fill in all required fields in Next of Kin.');
        return;
      }
    }

    // Validate password match only if passwords are provided
    if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
      setError("Passwords don't match!");
      return;
    }

    // Prepare data for submission
    const updatedData = { ...formData };

    // Remove password fields if they are empty 
    if (!updatedData.password) {
      delete updatedData.password;
      delete updatedData.confirmPassword;
    }

    // Only send fields that have changed
    for (const key in updatedData) {
      if (updatedData[key] === initialValues[key]) {
        delete updatedData[key];
      }
    }

    // Update role to Proper Case
    updatedData.role = updatedData.role
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    setLoading(true); 

    try {
      await onSubmit(updatedData);

      Swal.fire({
        title: `${formData.firstName} ${formData.lastName} updated successfully!`, 
        icon: 'success',
      }).then(() => {
        onClose(); 
      });
    } catch (error) {
      console.error('Error updating admin details:', error);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const steps = [
    {
      label: 'Basic Information',
    description: initialValues 
      ? `Update ${initialValues.firstName} ${initialValues.lastName}'s Information` 
      : "Update Team Member Information.",  
      content: (
        <Grid container spacing={2} style={{ marginTop: 5 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              variant="outlined"
              label="First Name"
              name="firstName"
              value={formData.firstName} 
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              variant="outlined"
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </Grid>

          {/* Password Fields (Not Required) */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              variant="outlined"
              label="Password (Optional)" 
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password || ''} 
              onChange={handleChange}
              sx={{ mt: 2 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              variant="outlined"
              label="Confirm Password (Optional)" 
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword || ''}
              onChange={handleChange}
              sx={{ mt: 2 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          {/* Role Dropdown */}
          <Grid item xs={12}>
            <FormControl fullWidth variant="outlined" required sx={{ mt: 2 }}>
              <InputLabel id="role-label" sx={{ color: colors.grey[100] }}>
                Role
              </InputLabel>
              <Select
                labelId="role-label"
                id="role"
                name="role"
                value={formData.role || ''} 
                onChange={handleChange}
                label="Role"
                sx={{
                  '.MuiOutlinedInput-notchedOutline': {
                    borderColor: colors.grey[400],
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: colors.grey[500],
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: colors.greenAccent[700],
                  },
                  '.MuiSvgIcon-root': {
                    color: colors.grey[400],
                  },
                }}
              >
                <MenuItem value="Admin">Admin</MenuItem>
                <MenuItem value="Super Admin">Super Admin</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          
        </Grid>
      ),
    },
    {
      label: 'Contact Information',
      description: 'Enter the admin user\'s contact details.',
      content: (
        <Grid container spacing={2}  style={{ marginTop: 5 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              variant="outlined"
              label="Phone Number"
              name="phoneNumber"
              value={formData.phoneNumber} 
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              variant="outlined"
              label="User Name"
              name="userName"
              value={formData.userName} 
              onChange={handleChange}
              required
              sx={{ mt: 2 }}
            />
            <TextField
              fullWidth
              variant="outlined"
              label="Address"
              name="address"
              value={formData.address} 
              onChange={handleChange}
              required
              sx={{ mt: 2 }}
            />
            <TextField
              fullWidth
              variant="outlined"
              label="City"
              name="city"
              value={formData.city} 
              onChange={handleChange}
              required
              sx={{ mt: 2 }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              variant="outlined"
              label="Email"
              name="emailAddress"
              value={formData.emailAddress}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              variant="outlined"
              label="Profile Image"
              name="profileImage"
              value={formData.profileImage}
              onChange={handleChange}
              required
              sx={{ mt: 2 }}
            />
            <TextField
              fullWidth
              variant="outlined"
              label="Country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
              sx={{ mt: 2 }}
            />
          </Grid>
        </Grid>
      ),
    },
    {
      label: 'Next of Kin',
      description: 'Provide emergency contact information.',
      content: (
        <Grid container spacing={2}  style={{ marginTop: 5 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              variant="outlined"
              label="Full Name"
              name="nextOfKin.fullName"
              value={formData.nextOfKin.fullName} 
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              variant="outlined"
              label="Email"
              name="nextOfKin.email"
              value={formData.nextOfKin.email}
              onChange={handleChange}
              required
              sx={{ mt: 2 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              variant="outlined"
              label="Phone Number"
              name="nextOfKin.phoneNumber"
              value={formData.nextOfKin.phoneNumber} 
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              variant="outlined"
              label="Address"
              name="nextOfKin.address"
              value={formData.nextOfKin.address} 
              onChange={handleChange}
              required
              sx={{ mt: 2 }}
            />
          </Grid>
        </Grid>
      ),
    },
  ];

  return (
    <Modal open={open} onClose={onClose}>
      <Box className="add-modal" bgcolor={colors.primary[400]}>
        <Grid container alignItems="center" mb={2}>
          {/* Avatar (Smaller) */}
          <Grid item xs={12} display="flex" alignItems="center" justifyContent="center">
            {initialValues && (
              <Avatar
                alt={`${initialValues?.firstName} ${initialValues?.lastName}`}
                src={initialValues.profileImage}
                sx={{ width: 50, height: 50 }}
              />
            )}
          </Grid>
          {/* Title with Admin Name */}
          <Grid item xs={12}> 
            <Typography variant="h4" fontWeight="bold" color={colors.grey[100]} align="center">
             {initialValues?.firstName} {initialValues?.lastName}
            </Typography>
          </Grid>
        </Grid>


        {error && (
          <Typography variant="body1" color="error" mb={2}>
            {error}
          </Typography>
        )}

        <Paper elevation={3} sx={{ padding: 3, marginTop: 2, bgcolor: colors.primary[400] }}>
          <form onSubmit={handleSubmit}>
            <Stepper activeStep={activeStep} orientation="vertical">
              {steps.map((step, index) => (
                <Step key={step.label}>
                  <StepLabel>{step.label}</StepLabel>
                  <StepContent>
                    <Typography>{step.description}</Typography>
                    {step.content}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                      {index > 0 && (
                        <Button onClick={handleBack} sx={{ mr: 2 }}>
                          Back
                        </Button>
                      )}
                      <Button
                        type={index === steps.length - 1 ? 'submit' : 'button'}
                        onClick={index === steps.length - 1 ? handleSubmit : handleNext}
                        disabled={loading}
                        variant="contained"
                        sx={{ backgroundColor: colors.greenAccent[600], color: 'white' }}
                      >
                        {index === steps.length - 1 ? 'Update' : 'Next'}
                      </Button>
                    </Box>
                  </StepContent>
                </Step>
              ))}
            </Stepper>
          </form>
        </Paper>

        
      </Box>
    </Modal>
  );
};

export default EditModal;