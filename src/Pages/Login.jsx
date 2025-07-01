import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Paper,
  Grid,
  CircularProgress,
  Fade,
  Alert,
} from "@mui/material";
import axios from "axios";
import loginimg from "../Assets/loginimg.png"; // Ensure path is correct

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  const handleInputChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await axios.post(
        "http://localhost:3002/api/contact/login",
        {
          email: formData.email,
          password: formData.password,
        }
      );

      if (response.status === 200) {
        setTimeout(() => {
          setLoading(false);
          onLogin({ email: formData.email });
          navigate("/dashboard");
        }, 1000);
      }
    } catch (error) {
      console.error("Login error:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      setTimeout(() => {
        setLoading(false);
        setErrorMessage(error.response?.data?.message || "Failed to log in. Please try again.");
      }, 1000);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: { xs: "column", md: "row" } }}>
      {/* Left Image Section */}
      <Box
        sx={{
          width: { xs: "100%", md: "50%" },
          height: { xs: "40vh", md: "100vh" },
          backgroundImage: `url(${loginimg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Right Form Section */}
      <Grid
        container
        sx={{
          width: { xs: "100%", md: "50%" },
          backgroundColor: "#000",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: { xs: 6, md: 0 },
        }}
      >
        <Fade in={animate} timeout={800}>
          <Grid item xs={11} sm={10} md={8}>
            <Container maxWidth="sm">
              <Paper
                elevation={24}
                sx={{
                  p: 4,
                  backgroundColor: "#000",
                  borderRadius: 3,
                }}
              >
                <Box sx={{ textAlign: "center", mb: 4 }}>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: "bold",
                      color: "white",
                      mb: 1,
                      fontFamily: "monospace",
                    }}
                  >
                    Welcome to Ten Sports Race
                  </Typography>
                  <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.7)" }}>
                    Sign in to access Admin Panel
                  </Typography>
                </Box>

                <form onSubmit={handleSubmit}>
                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="body2"
                      sx={{ color: "white", mb: 1, fontWeight: "bold" }}
                    >
                      Email
                    </Typography>
                    <TextField
                      fullWidth
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      sx={textFieldStyles}
                    />
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="body2"
                      sx={{ color: "white", mb: 1, fontWeight: "bold" }}
                    >
                      Password
                    </Typography>
                    <TextField
                      fullWidth
                      name="password"
                      type="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      sx={textFieldStyles}
                    />
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 3,
                    }}
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="rememberMe"
                          checked={formData.rememberMe}
                          onChange={handleInputChange}
                          sx={{
                            color: "rgba(255,255,255,0.7)",
                            "&.Mui-checked": {
                              color: "#ff0000",
                            },
                          }}
                        />
                      }
                      label={
                        <Typography
                          variant="body2"
                          sx={{ color: "rgba(255,255,255,0.7)" }}
                        >
                          Remember me
                        </Typography>
                      }
                    />
                    <Link
                      to="/forgot-password"
                      style={{
                        color: "#ff0000",
                        textDecoration: "none",
                        fontSize: "14px",
                      }}
                    >
                      Forgot password?
                    </Link>
                  </Box>

                  {errorMessage && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                      {errorMessage}
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={loading}
                    sx={{
                      backgroundColor: "#ff0000",
                      color: "white",
                      fontWeight: "bold",
                      py: 1.5,
                      mb: 3,
                      fontSize: "16px",
                      "&:hover": {
                        backgroundColor: "#cc0000",
                      },
                    }}
                  >
                    {loading ? (
                      <>
                        <CircularProgress size={20} sx={{ color: "white", mr: 1 }} />
                        Signing in...
                      </>
                    ) : (
                      "Sign in"
                    )}
                  </Button>

                  <Box sx={{ textAlign: "center" }}>
                    <Link
                      to="/create-account"
                      style={{
                        color: "#ff0000",
                        textDecoration: "none",
                        fontSize: "14px",
                      }}
                    >
                      Create an account
                    </Link>
                  </Box>
                </form>

                <Box sx={{ textAlign: "center", mt: 4 }}>
                  <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.5)" }}>
                    © 2025 Ten Sports Race. All rights reserved.
                  </Typography>
                </Box>
              </Paper>
            </Container>
          </Grid>
        </Fade>
      </Grid>
    </Box>
  );
};

const textFieldStyles = {
  "& .MuiOutlinedInput-root": {
    backgroundColor: "rgba(255,255,255,0.1)",
    "& fieldset": {
      borderColor: "rgba(255,255,255,0.3)",
    },
    "&:hover fieldset": {
      borderColor: "rgba(255,0,0,0.5)",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#ff0000",
    },
  },
  "& .MuiInputBase-input": {
    color: "white",
  },
  "& .MuiInputBase-input::placeholder": {
    color: "rgba(255,255,255,0.5)",
  },
};

export default Login;