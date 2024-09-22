// src/components/Modals/AddModal.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Modal,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../theme"; // Adjust this import as necessary

const AddModal = ({ open, onClose, fields, onSubmit, title }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [formData, setFormData] = useState({});

  useEffect(() => {
    // Initialize formData based on the fields array 
    const initialFormData = fields.reduce((data, field) => {
      data[field.name] = field.initialValue || ''; // Use initialValue if provided, otherwise empty string
      if (field.nestedFields) {
        data[field.name] = field.nestedFields.reduce((nestedData, nestedField) => {
          nestedData[nestedField.name] = nestedField.initialValue || '';
          return nestedData;
        }, {});
      }
      return data;
    }, {});
    setFormData(initialFormData);
  }, [fields]); 

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) { 
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSubmit(formData); // Call the onSubmit prop with the form data
      setSuccess("Item created successfully. Click Cancel to close the form.");
      setTimeout(() => {
        setSuccess(null);
      }, 3000); 
    } catch (error) {
      console.error("Error creating item:", error);
      setError("An error occurred. Please try again."); 
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ ...modalStyle, bgcolor: colors.primary[400] }}>
        <Typography variant="h4" fontWeight="bold" mb={3} color={colors.grey[100]}>
          {title} 
        </Typography>
        <Button
          variant="outlined"
          onClick={onClose} 
          sx={{
            mb: 2,
            color: colors.grey[100],
            borderColor: colors.grey[400],
            "&:hover": {
              borderColor: colors.grey[500],
            },
          }}
        >
          Cancel
        </Button>
        <Typography variant="body1" mb={2} color={colors.grey[100]}>
          Fill in the form below to create a new item. 
        </Typography>
        {error && (
          <Typography variant="body1" color="error" mb={2}>
            {error}
          </Typography>
        )}
        {success && (
          <Typography variant="body1" color="success" mb={2}>
            {success}
          </Typography>
        )}

        <Paper elevation={3} sx={{ padding: 3, marginTop: 2, bgcolor: colors.primary[400] }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              {fields.map((field) => (
                <Grid item xs={12} sm={field.gridSize || 6} key={field.name}>
                  {field.type === 'select' ? (
                    <FormControl fullWidth variant="outlined" required={field.required}>
                      <InputLabel id={`${field.name}-label`} sx={{ color: colors.grey[100] }}>{field.label}</InputLabel>
                      <Select
                        labelId={`${field.name}-label`}
                        id={field.name}
                        name={field.name}
                        value={formData[field.name]} 
                        onChange={handleChange}
                        label={field.label}
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
                        {field.options.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl> 
                  ) : field.nestedFields ? (
                    <Box>
                      <Typography variant="h6" color={colors.grey[100]}>{field.label}</Typography> 
                      <Grid container spacing={2}>
                        {field.nestedFields.map((nestedField) => (
                          <Grid item xs={12} sm={nestedField.gridSize || 6} key={nestedField.name}>
                            <TextField
                              fullWidth
                              variant="outlined"
                              label={nestedField.label}
                              name={`${field.name}.${nestedField.name}`} 
                              value={formData[field.name][nestedField.name]}
                              onChange={handleChange}
                              required={nestedField.required} 
                            />
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  ) : ( 
                    <TextField
                      fullWidth
                      variant="outlined"
                      label={field.label}
                      name={field.name}
                      type={field.type || 'text'} 
                      value={formData[field.name]}
                      onChange={handleChange}
                      required={field.required}
                    />
                  )}
                </Grid>
              ))}
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    backgroundColor: colors.greenAccent[600],
                    color: 'white',
                    '&:hover': { backgroundColor: colors.greenAccent[700] },
                  }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Create'}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Box>
    </Modal>
  );
};

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 700, 
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

export default AddModal;