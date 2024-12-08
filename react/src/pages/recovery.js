import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Box, Button, Container, Grid, Link, TextField, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useEffect } from 'react';
import Notification from 'src/components/notification';
const Login = () => {
  const router = useRouter();

  useEffect(()=>{  fetch('https://veebster.tk/api/user/session', {
    credentials: "include",
  }).then(res => res.json()).then((data)=>{
    if(data.uid){
      sessionStorage.setItem("session", JSON.stringify(data))
      sessionStorage.setItem("notification", "You are already logged in!")
      router.push("/news")
    }
  })}, [])

  



  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: Yup.object({
      email: Yup
        .string()
        .email(
          'Must be a valid email')
        .max(255)
        .required(
          'Email is required'),
    }),
    onSubmit: () => {
      fetch("https://veebster.tk/api/user/getrecovery", {
        method: 'POST',
        mode: 'cors',
        credentials: "include",
        body: JSON.stringify(formik.values),
        headers: {
          'Content-Type': 'application/json'
        }}).then(res => res.json()).then((data)=>{
          if(!data.ok){
            sessionStorage.setItem("notification", data.err)
            return window.location.reload(false)
          }
          else{
            return router.push("/login")
          }
        })
    }
  });

  return (
    <>
      <Head>
        <title>Recovery | Veebster Analyzer</title>
      </Head>
      <Notification/>
      <Box
        component="main"
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexGrow: 1,
          minHeight: '100%'
        }}
      >
        <Container maxWidth="sm">
          <NextLink
            href="/"
            passHref
          >
            <Button
              component="a"
              startIcon={<ArrowBackIcon fontSize="small" />}
            >
              Home
            </Button>
          </NextLink>
          <form id="former" onSubmit={formik.handleSubmit}>
            <Box sx={{ my: 3 }}>
              <Typography
                color="textPrimary"
                variant="h4"
              >
                Password recovery
              </Typography>
              <Typography
                color="textSecondary"
                gutterBottom
                variant="body2"
              >
                Sign in with email and password
              </Typography>
            </Box>


            <TextField
              error={Boolean(formik.touched.email && formik.errors.email)}
              fullWidth
              helperText={formik.touched.email && formik.errors.email}
              label="Email Address"
              margin="normal"
              name="email"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="email"
              value={formik.values.email}
              variant="outlined"
            />
            <Box sx={{ py: 2 }}>
              <Button
                color="primary"
                disabled={formik.isSubmitting}
                fullWidth
                size="large"
                type="submit"
                variant="contained"
              >
                Recover
              </Button>
            </Box>
            <Typography
              color="textSecondary"
              variant="body2"
            >
              Login if you remember your password.
              {' '}
              <NextLink
                href="/login"
              >
                <Link
                  to="/login"
                  variant="subtitle2"
                  underline="hover"
                  sx={{
                    cursor: 'pointer'
                  }}
                >
                  Log in
                </Link>
              </NextLink>
            </Typography>
          </form>
        </Container>
      </Box>
    </>
  );
};

export default Login;
