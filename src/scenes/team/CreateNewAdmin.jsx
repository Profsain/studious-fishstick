import React, { useState, useContext } from "react";
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
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../theme"; // Adjust this import as necessary
import AuthContext from "../../context/AuthContext";

const CreateNewAdmin = ({ handleCancel }) => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const { token } = useContext(AuthContext);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    emailAddress: "",
    password: "",
    phoneNumber: "",
    userName: "",
    address: "",
    city: "",
    country: "",
    profileImage: "",
    nextOfKin: {
      fullName: "",
      phoneNumber: "",
      email: "",
      address: "",
    },
    role: "", // Role field for the selector
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("nextOfKin.")) {
      const kinField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        nextOfKin: { ...prev.nextOfKin, [kinField]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const clearForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      emailAddress: "",
      password: "",
      phoneNumber: "",
      userName: "",
      address: "",
      city: "",
      country: "",
      nextOfKin: {
        fullName: "",
        phoneNumber: "",
        email: "",
        address: "",
      },
      role: "",
    });
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    // Implement API call to create new admin
    try {
      const response = await fetch(`${apiUrl}/admin/admin-create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        setError("An Internet error occurred. Please try again.");
        throw new Error("An error occurred while creating the admin.");
      }

      // Clear the form fields
      clearForm();
      const data = await response.json();
      setSuccess("Admin created successfully. Click Cancel to close form.");
      // set the success message " " after 3 seconds
      setTimeout(() => {
        setSuccess("");
      }, 3000);

      setLoading(false);
    } catch (error) {
      console.error("Error creating new admin:", error);
      setError("An catch error occurred. Please try again.");
      setLoading(false);
      return;
    }
  };

  return (
    <Box m="20px">
      <Typography variant="h4" fontWeight="600" color={colors.grey[100]}>
        Create New Admin
      </Typography>
      <Button
        variant="outlined"
        onClick={handleCancel}
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
      <Typography variant="body1" color={colors.grey[100]}>
        Fill in the form below to create a new admin.
      </Typography>
      {error && (
        <Typography variant="body1" color="error">
          {error}
        </Typography>
      )}

      {success && (
        <Typography variant="body1" color="success">
          {success}
        </Typography>
      )}

      <Paper elevation={3} sx={{ padding: 3, marginTop: 2 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
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
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                variant="outlined"
                label="Email Address"
                name="emailAddress"
                value={formData.emailAddress}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                variant="outlined"
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </Grid>
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
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                variant="outlined"
                label="User Name"
                name="userName"
                value={formData.userName}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                variant="outlined"
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                variant="outlined"
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                variant="outlined"
                label="Country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined" required>
                <InputLabel>Role</InputLabel>
                <Select
                  label="Role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <MenuItem value="superadmin">Superadmin</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                variant="outlined"
                label="Profile Image Url"
                name="profileImage"
                value={formData.profileImage}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" color={colors.grey[100]}>
                Next of Kin
              </Typography>
            </Grid>
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
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                variant="outlined"
                label="Email"
                name="nextOfKin.email"
                value={formData.nextOfKin.email}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                variant="outlined"
                label="Address"
                name="nextOfKin.address"
                value={formData.nextOfKin.address}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  backgroundColor: colors.greenAccent[600],
                  color: "white",
                  "&:hover": {
                    backgroundColor: colors.greenAccent[700],
                  },
                }}
              >
                {loading ? <CircularProgress size={24} /> : "Create Admin"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default CreateNewAdmin;
