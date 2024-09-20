import { useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  Button,
  Grid,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  FormHelperText,
  Stepper,
  Step,
  StepLabel,
  StepContent,
} from '@mui/material';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useTheme } from '@mui/material/styles';
import { tokens } from '../theme';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

const EditModal = ({ open, onClose, initialValues, onSubmit, fields }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 700,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
  };

  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  // Create a Yup validation schema based on the provided fields
  const validationSchema = Yup.object().shape(
    fields.reduce((schema, field) => {
      let validator;
      if (field.nestedFields) {
        // Correctly create a nested object schema using Yup.object()
        validator = Yup.object().shape( 
          field.nestedFields.reduce((nestedSchema, nestedField) => {
            let nestedValidator = Yup.string(); 

            if (nestedField.required) {
              nestedValidator = nestedValidator.required(
                `${nestedField.label} is required`
              );
            }

            return {
              ...nestedSchema,
              [nestedField.name]: nestedValidator,
            };
          }, {})
        ); 
      } else if (field.type === 'email') {
        validator = Yup.string().email('Invalid email address');
      } else if (field.type === 'number') {
        validator = Yup.number().typeError('Must be a number'); 
      } else if (field.type === 'date') {
        validator = Yup.date().typeError('Invalid date'); 
      } else {
        // Default to Yup.string() for other fields
        validator = Yup.string();
      }

      if (field.required) {
        validator = validator.required(`${field.label} is required`);
      }

      return {
        ...schema,
        [field.name]: validator,
      };
    }, {})
  ); 

  const steps = [
    {
      label: 'Basic Information',
      description: 'Update the team member\'s core details.',
      fields: fields.filter((field) => !field.nestedFields), // Fields without nestedFields
    },
    {
      label: 'Next of Kin',
      description: 'Provide emergency contact information.',
      fields: fields.filter((field) => field.name === 'nextOfKin'), // Only the 'nextOfKin' field
    },
  ];

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h5" fontWeight="bold" mb={3}>
          Edit Details
        </Typography>

        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel>{step.label}</StepLabel>
              <StepContent>
                <Typography>{step.description}</Typography> {/* Step Description */}

                {/* Form within the Step */}
                <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={onSubmit}
                >
                  {({ isSubmitting, values, setFieldValue, touched, errors }) => (
                    <Form>
                      <Grid container spacing={2} sx={{ marginTop: 2 }}>
                        {step.fields.map((field) => {
                          if (field.nestedFields) {
                            // Render nested fields
                            return field.nestedFields.map((nestedField) => (
                              <Grid item xs={6} key={nestedField.name}>
                                <Field
                                  as={TextField}
                                  label={nestedField.label}
                                  name={`${field.name}.${nestedField.name}`}
                                  type={nestedField.type || 'text'}
                                  fullWidth
                                  error={
                                    touched[field.name]?.[
                                      nestedField.name
                                    ] &&
                                    !!errors[field.name]?.[
                                      nestedField.name
                                    ]
                                  }
                                  helperText={
                                    touched[field.name]?.[
                                      nestedField.name
                                    ] &&
                                    errors[field.name]?.[
                                      nestedField.name
                                    ]
                                  }
                                />
                                <ErrorMessage
                                  name={`${field.name}.${nestedField.name}`}
                                  component="div"
                                  className="error"
                                />{' '}
                                {/* Display Formik error message */}
                              </Grid>
                            ));
                          } else if (field.type === 'select') {
                            return (
                              <Grid item xs={6} key={field.name}>
                                <FormControl
                                  fullWidth
                                  error={
                                    touched[field.name] &&
                                    !!errors[field.name]
                                  }
                                >
                                  <InputLabel id={`${field.name}-label`}>
                                    {field.label}
                                  </InputLabel>
                                  <Field
                                    as={Select}
                                    labelId={`${field.name}-label`}
                                    id={field.name}
                                    name={field.name}
                                    value={values[field.name] || ''}
                                  >
                                    {field.options.map((option) => (
                                      <MenuItem
                                        key={option.value}
                                        value={option.value}
                                      >
                                        {option.label}
                                      </MenuItem>
                                    ))}
                                  </Field>
                                  <FormHelperText>
                                    {touched[field.name] &&
                                      errors[field.name]}
                                  </FormHelperText>
                                </FormControl>
                              </Grid>
                            );
                          } else if (field.type === 'date') {
                            return (
                              <Grid item xs={6} key={field.name}>
                                <LocalizationProvider
                                  dateAdapter={AdapterDayjs}
                                >
                                  <DatePicker
                                    label={field.label}
                                    value={dayjs(values[field.name])}
                                    onChange={(date) =>
                                      setFieldValue(
                                        field.name,
                                        date.format('YYYY-MM-DD')
                                      )
                                    }
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        fullWidth
                                      />
                                    )}
                                  />
                                </LocalizationProvider>
                              </Grid>
                            );
                          } else {
                            return (
                              <Grid item xs={6} key={field.name}>
                                <Field
                                  as={TextField}
                                  label={field.label}
                                  name={field.name}
                                  type={field.type || 'text'}
                                  fullWidth
                                  error={
                                    touched[field.name] &&
                                    !!errors[field.name]
                                  }
                                  helperText={
                                    touched[field.name] &&
                                    errors[field.name]
                                  }
                                />
                                <ErrorMessage
                                  name={field.name}
                                  component="div"
                                  className="error"
                                />{' '}
                                {/* Display Formik error message */}
                              </Grid>
                            );
                          }
                        })}
                      </Grid>

                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          marginTop: 3,
                        }}
                      >
                        <Button
                          disabled={activeStep === 0}
                          onClick={handleBack}
                          sx={{ mt: 1, mr: 1 }}
                        >
                          Back
                        </Button>

                        <Box> {/* Grouping the Cancel and Save buttons */}
                          <Button
                            type="button"
                            variant="outlined"
                            color="secondary"
                            backgroundColor="grey"
                            sx={{ marginRight: 2 }}
                            onClick={onClose}
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            disabled={isSubmitting}
                            variant="contained"
                            color="primary"
                            onClick={
                              activeStep === steps.length - 1
                                ? onSubmit
                                : handleNext
                            }
                            sx={{
                              backgroundColor:
                                colors.greenAccent[600],
                            }}
                          >
                            {activeStep === steps.length - 1
                              ? 'Save Changes'
                              : 'Next'}
                          </Button>
                        </Box>
                      </Box>
                    </Form>
                  )}
                </Formik>
              </StepContent>
            </Step>
          ))}
        </Stepper>
      </Box>
    </Modal>
  );
};

export default EditModal;