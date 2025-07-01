import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Checkbox,
  FormControlLabel,
  Fade,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import loginimg from "../Assets/loginimg.png"; // Use your image path

const CreateAccount = () => {
  const navigate = useNavigate();
  const [animate, setAnimate] = useState(false);
  const [accountCreated, setAccountCreated] = useState(false);

  useEffect(() => setAnimate(true), []);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });

  const handleInputChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    if (!formData.agreeToTerms) {
      alert("Please agree to terms and conditions");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3002/api/contact/createaccount",
        {
          FirstName: formData.firstName,
          LastName: formData.lastName,
          Email: formData.email,
          Password: formData.password,
          ConfirmPassword: formData.confirmPassword,
        }
      );

      if (response.status === 200 || response.status === 201) {
        setAccountCreated(true); // Show animation
        setTimeout(() => {
          navigate("/login");
        }, 1500); // Delay redirect
      }
    } catch (error) {
      console.error(error);
      alert("Failed to create account. Please try again.");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
      }}
    >
      {/* Left Image */}
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

      {/* Right Form */}
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
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <Button
                    onClick={() => navigate("/login")}
                    sx={{ color: "#ff0000", minWidth: "auto", p: 1, mr: 2 }}
                  >
                    <ArrowBackIcon />
                  </Button>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: "bold",
                      color: "white",
                      fontFamily: "monospace",
                    }}
                  >
                    Create Account
                  </Typography>
                </Box>

                <Typography
                  variant="body2"
                  sx={{ color: "rgba(255,255,255,0.7)", mb: 4 }}
                >
                  Join the Ten Sports Race community
                </Typography>

                <form onSubmit={handleSubmit}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography
                        variant="body2"
                        sx={{ color: "white", mb: 1, fontWeight: "bold" }}
                      >
                        First Name
                      </Typography>
                      <TextField
                        fullWidth
                        name="firstName"
                        placeholder="Enter first name"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        sx={textFieldStyles}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography
                        variant="body2"
                        sx={{ color: "white", mb: 1, fontWeight: "bold" }}
                      >
                        Last Name
                      </Typography>
                      <TextField
                        fullWidth
                        name="lastName"
                        placeholder="Enter last name"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        sx={textFieldStyles}
                      />
                    </Grid>
                  </Grid>

                  <Box sx={{ mt: 3 }}>
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

                  <Box sx={{ mt: 3 }}>
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

                  <Box sx={{ mt: 3 }}>
                    <Typography
                      variant="body2"
                      sx={{ color: "white", mb: 1, fontWeight: "bold" }}
                    >
                      Confirm Password
                    </Typography>
                    <TextField
                      fullWidth
                      name="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                      sx={textFieldStyles}
                    />
                  </Box>

                  <Box sx={{ mt: 3, mb: 3 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="agreeToTerms"
                          checked={formData.agreeToTerms}
                          onChange={handleInputChange}
                          sx={{
                            color: "rgba(255,255,255,0.7)",
                            "&.Mui-checked": { color: "#ff0000" },
                          }}
                        />
                      }
                      label={
                        <Typography
                          variant="body2"
                          sx={{ color: "rgba(255,255,255,0.7)" }}
                        >
                          I agree to the Terms and Conditions
                        </Typography>
                      }
                    />
                  </Box>

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
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
                    disabled={accountCreated}
                  >
                    Create Account
                  </Button>

                  {/* Success Animation */}
                  <Fade in={accountCreated} timeout={500}>
                    <Box sx={{ textAlign: "center", mb: 2 }}>
                      <CheckCircleOutlineIcon
                        sx={{ fontSize: 40, color: "#00e676" }}
                      />
                      <Typography
                        sx={{ color: "#00e676", fontWeight: "bold", mt: 1 }}
                      >
                        Account Created Successfully!
                      </Typography>
                    </Box>
                  </Fade>

                  <Box sx={{ textAlign: "center" }}>
                    <Typography
                      variant="body2"
                      sx={{ color: "rgba(255,255,255,0.7)" }}
                    >
                      Already have an account?{" "}
                      <Link
                        to="/login"
                        style={{ color: "#ff0000", textDecoration: "none" }}
                      >
                        Sign in
                      </Link>
                    </Typography>
                  </Box>
                </form>
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

export default CreateAccount;
