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

const mockUsers = [
  { username: "admin", password: "password" },
  // Add more mock users if needed
];

const Login = () => {
  const { setUser } = useContext(AuthContext);
  const theme = useTheme();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    // Simulate delay
    setTimeout(() => {
      const user = mockUsers.find((user) => user.username === username);

      if (user && user.password === password) {
        console.log("Login successful!");
        setUser(user);
        navigate("/dashboard");
      } else {
        setError("Invalid username or password.");
      }

      setIsLoading(false);
    }, 1000);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: theme.palette.primary.main,
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
          width: 400, // Increased width
        }}
      >
        <Avatar
          sx={{ m: 1, bgcolor: "secondary.main", width: 56, height: 56, margin: "0 auto" }}
        >
          <LockOutlinedIcon />
        </Avatar>
        <Typography variant="h4" fontWeight="bold" mb={4} color="primary">
          Splinx Planet Login
        </Typography>

        {error && (
          <Typography variant="body2" color="error" mb={2}>
            {error}
          </Typography>
        )}

        <TextField
          label="Username"
          variant="outlined"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          InputLabelProps={{ style: { color: "gray" } }}
          sx={{
            input: { color: "gray" },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "lightgray",
              },
              "&:hover fieldset": {
                borderColor: theme.palette.primary.main,
              },
              "&.Mui-focused fieldset": {
                borderColor: theme.palette.primary.main,
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
          InputLabelProps={{ style: { color: "gray" } }}
          sx={{
            input: { color: "gray" }, 
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "lightgray",
              },
              "&:hover fieldset": {
                borderColor: theme.palette.primary.main,
              },
              "&.Mui-focused fieldset": {
                borderColor: theme.palette.primary.main,
              },
            },
          }}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 3, py: 1.5, borderRadius: "8px" }}
          disabled={isLoading}
        >
          {isLoading ? <CircularProgress size={24} /> : "LOGIN"}
        </Button>
      </Box>
    </Box>
  );
};

export default Login;