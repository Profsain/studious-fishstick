import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  CircularProgress,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../theme"; // Adjust this import as necessary
import AuthContext from "../../context/AuthContext";

const EditAdmin = ({ adminData, handleCancel }) => {
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
    nextOfKin: {
      fullName: "",
      phoneNumber: "",
      email: "",
      address: "",
    },
    role: "",
    staffId: "",
  });
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Pre-fill the form with the existing admin data
    if (adminData) {
      // set the form fields with the existing admin data
      setFormData({
        firstName: adminData.firstName,
        lastName: adminData.lastName,
        emailAddress: adminData.emailAddress,
        password: null,
        phoneNumber: adminData.phoneNumber,
        userName: adminData.userName,
        address: adminData.address,
        city: adminData.city,
        country: adminData.country,
        nextOfKin: {
          fullName: adminData.nextOfKin.fullName,
          phoneNumber: adminData.nextOfKin.phoneNumber,
          email: adminData.nextOfKin.email,
          address: adminData.nextOfKin.address,
        },
        role: adminData.role,
        staffId: adminData.staffId,
      });
    }
  }, [adminData]);

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

  const handleSubmit = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    // Implement API call to update admin information
    try {
      const newAdminData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        emailAddress: formData.emailAddress,
        password: formData.password,
        phoneNumber: formData.phoneNumber,
        userName: formData.userName,
        address: formData.address,
        city: formData.city,
        country: formData.country,
        nextOfKin: {
          fullName: formData.nextOfKin.fullName,
          phoneNumber: formData.nextOfKin.phoneNumber,
          email: formData.nextOfKin.email,
          address: formData.nextOfKin.address,
        },
        role: formData.role,
        staffId: formData.staffId,
      };
      const response = await fetch(
        `${apiUrl}/admin/admin-update/${adminData._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newAdminData),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to update admin data.");
      }
      setSuccessMsg(
        "Admin data updated successfully. Click cancel to return to the admin list."
      );
      setError(null);
      // clear form data after successful update
      // set success message to null after 5 seconds
      setTimeout(() => {
        setSuccessMsg(null);
        // handle cancel
        handleCancel();
      }, 5000);
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box m="20px">
      <Typography variant="h4" fontWeight="600" color={colors.grey[100]}>
        Edit Admin
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

      {successMsg && (
        <Typography variant="body1" color="success">
          {successMsg}
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
                label="Enter new password or leave it empty"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
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
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                variant="outlined"
                label="Role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                variant="outlined"
                label="Staff ID"
                name="staffId"
                value={formData.staffId}
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
                {isLoading ? (
                  <CircularProgress color="inherit" size={24} />
                ) : (
                  "Update Admin"
                )}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default EditAdmin;
