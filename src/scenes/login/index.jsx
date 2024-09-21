/* eslint-disable import/no-unresolved */
import React, { useState, useContext } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Avatar,
  IconButton,
  InputAdornment,
  Link,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import AuthContext from "../../context/AuthContext";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import loginAdmin from "../../api/adminApi";

const Login = () => {
  const { setUser, setToken } = useContext(AuthContext);
  const theme = useTheme();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const data = await loginAdmin(email, password);
      console.log('Login API response:', data); // Log the entire API response 

      if (data.success) {
        setToken(data.token);
        setUser(data.admin);
        navigate("/dashboard");
      } else {
        setError(data.message || "Invalid username or password.");
      }
    } catch (err) {
      console.error('Login API Error:', err); // Log the full error object 
      if (err.response) {
        console.log('Error Response Data:', err.response.data);
        console.log('Error Response Status:', err.response.status);
        console.log('Error Response Headers:', err.response.headers);
      } else if (err.request) {
        console.log('Error Request:', err.request);
      } else {
        console.log('Error Message:', err.message);
      }
      setError("An error occurred during login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        width: "100vw",
        backgroundColor: theme.palette.primary.main,
        position: "relative",
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: theme.spacing(4),
          borderRadius: "16px",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.25)",
          backgroundColor: "white",
          width: 500,
          maxWidth: "90%",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main", width: 56, height: 56 }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography variant="h2" fontWeight="bold" mb={4} color="#262a31">
          Splinx Planet Login
        </Typography>

        {error && (
          <Typography variant="body2" color="error" mb={2}>
            {error}
          </Typography>
        )}

        <TextField
          label="Email Address"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          InputLabelProps={{ style: { color: "#262a31" } }}
          sx={{
            input: {
              color: "#262a31",
              backgroundColor: email ? "transparent" : "inherit", // No background when filled
            },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#ffb554",
              },
              "&:hover fieldset": {
                borderColor: "#ffb554",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#ffb554",
              },
            },
          }}
        />

        <TextField
          label="Password"
          variant="outlined"
          type={showPassword ? "text" : "password"} // Toggle password visibility
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputLabelProps={{ style: { color: "#262a31" } }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={togglePasswordVisibility}
                  edge="end"
                  aria-label="toggle password visibility"
                  sx={{ color: "gray" }} // Set eye icon color to gray
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            input: {
              color: "gray",
              backgroundColor: password ? "transparent" : "inherit", // No background when filled
            },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#ffb554",
              },
              "&:hover fieldset": {
                borderColor: "#ffb554",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#ffb554",
              },
            },
          }}
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={isLoading}
          sx={{
            mt: 3,
            fontSize: 16,
            py: 1.5,
            borderRadius: "8px",
            backgroundColor: "#e6a34b", // Darker shade of #ffb554
            color: "white",
            "&:hover": {
              backgroundColor: "#ffb554",
            },
            "&:disabled": {
              backgroundColor: "#e6a34b",
              opacity: 0.7,
            },
          }}
        >
          {isLoading ? <CircularProgress size={24} /> : "LOGIN"}
        </Button>

        {/* Forgot Password Link */}
        <Box mt={2}>
          <Link href="/forgot-password" underline="hover" color="primary">
            Forgot password?
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
