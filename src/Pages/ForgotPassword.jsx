import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Fade,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EmailIcon from '@mui/icons-material/Email';
import loginimg from '../Assets/loginimg.png'; // Adjust if needed

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
      {/* Left Image */}
      <Box
        sx={{
          width: { xs: '100%', md: '50%' },
          height: { xs: '40vh', md: '100vh' },
          backgroundImage: `url(${loginimg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />

      {/* Right Form */}
      <Grid
        container
        sx={{
          width: { xs: '100%', md: '50%' },
          backgroundColor: '#000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
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
                  backgroundColor: '#000',
                  borderRadius: 3,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Button
                    onClick={() => navigate('/login')}
                    sx={{
                      color: '#ff0000',
                      minWidth: 'auto',
                      p: 1,
                      mr: 2,
                    }}
                  >
                    <ArrowBackIcon />
                  </Button>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 'bold',
                      color: 'white',
                      fontFamily: 'monospace',
                    }}
                  >
                    Forgot Password
                  </Typography>
                </Box>

                {!isSubmitted ? (
                  <>
                    <Typography
                      variant="body2"
                      sx={{ color: 'rgba(255,255,255,0.7)', mb: 4 }}
                    >
                      Enter your email address and we'll send you a link to reset your password.
                    </Typography>

                    <form onSubmit={handleSubmit}>
                      <Box sx={{ mb: 3 }}>
                        <Typography
                          variant="body2"
                          sx={{ color: 'white', mb: 1, fontWeight: 'bold' }}
                        >
                          Email Address
                        </Typography>
                        <TextField
                          fullWidth
                          type="email"
                          placeholder="Enter your email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              backgroundColor: 'rgba(255,255,255,0.1)',
                              '& fieldset': {
                                borderColor: 'rgba(255,255,255,0.3)',
                              },
                              '&:hover fieldset': {
                                borderColor: 'rgba(255,0,0,0.5)',
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: '#ff0000',
                              },
                            },
                            '& .MuiInputBase-input': {
                              color: 'white',
                            },
                            '& .MuiInputBase-input::placeholder': {
                              color: 'rgba(255,255,255,0.5)',
                            },
                          }}
                        />
                      </Box>

                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{
                          backgroundColor: '#ff0000',
                          color: 'white',
                          fontWeight: 'bold',
                          py: 1.5,
                          mb: 3,
                          fontSize: '16px',
                          '&:hover': {
                            backgroundColor: '#cc0000',
                          },
                        }}
                      >
                        Send Reset Link
                      </Button>
                    </form>
                  </>
                ) : (
                  <Box sx={{ textAlign: 'center' }}>
                    <EmailIcon
                      sx={{
                        fontSize: 60,
                        color: '#ff0000',
                        mb: 2,
                      }}
                    />
                    <Typography
                      variant="h6"
                      sx={{ color: 'white', mb: 2, fontWeight: 'bold' }}
                    >
                      Check Your Email
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: 'rgba(255,255,255,0.7)', mb: 4 }}
                    >
                      We've sent a password reset link to {email}
                    </Typography>
                    <Button
                      onClick={() => setIsSubmitted(false)}
                      sx={{
                        color: '#ff0000',
                        textTransform: 'none',
                        mb: 2,
                      }}
                    >
                      Didn't receive the email? Try again
                    </Button>
                  </Box>
                )}

                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    Remember your password?{' '}
                    <Link
                      to="/login"
                      style={{
                        color: '#ff0000',
                        textDecoration: 'none',
                      }}
                    >
                      Sign in
                    </Link>
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

export default ForgotPassword;
