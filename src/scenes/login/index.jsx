/* eslint-disable import/no-unresolved */
import React, { useState, useContext } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Avatar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import AuthContext from "../../context/AuthContext";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import loginAdmin from "../../api/adminApi";

const Login = () => {
  const { setUser } = useContext(AuthContext);
  const theme = useTheme();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const data = await loginAdmin(email, password);
      if (data.success) {
        console.log("Login successful!");
        setUser(data.admin);
        localStorage.setItem('token', data.token);
        navigate("/dashboard");
      } else {
        setError(data.message || "Invalid username or password.");
      }
    } catch (err) {
      setError("An error occurred during login. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        width: "100vw", // Ensure full width
        backgroundColor: theme.palette.primary.main,
        position: "relative", // Ensure positioning context
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
          maxWidth: "90%", // Ensure it doesn't overflow on smaller screens
        }}
      >
        <Avatar
          sx={{ m: 1, bgcolor: "secondary.main", width: 56, height: 56 }}
        >
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
            input: { color: "#262a31" },
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
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputLabelProps={{ style: { color: "#262a31" } }}
          sx={{
            input: { color: "gray" },
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
            backgroundColor: "#e6a34b",  // Darker shade of #ffb554
            color: "white",  // Ensuring text is visible on the background
            '&:hover': {
              backgroundColor: "#ffb554",  // Original color on hover
            },
            '&:disabled': {
              backgroundColor: "#e6a34b",  // Keeping the same color when disabled
              opacity: 0.7,  // Adding some opacity to indicate it's disabled
            }
          }}
        >
          {isLoading ? <CircularProgress size={24} /> : "LOGIN"}
        </Button>
      </Box>
    </Box>
  );
};

export default Login;