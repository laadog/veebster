import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Box, Button, Container, Link, TextField, Typography } from '@mui/material';
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
      password: Yup
        .string()
        .max(255)
        .required(
          'Password is required')
        .min(6, "Password must be at least 6 characters."),
    }),
    onSubmit: () => {
      if(window.location.search.substring(1)){
        console.debug(window.location.search.substring(1))

      }
      fetch("https://veebster.tk/api/user/newpass", {
        method: 'POST',
        mode: 'cors',
        credentials: "include",
        body: JSON.stringify({password: formik.values.password, code: window.location.search.slice(1,-1)}),
        headers: {
          'Content-Type': 'application/json'
        }}).then(res => res.json()).then((data)=>{
          if(!data.ok){
            sessionStorage.setItem("notification", data.err)
            return window.location.reload(false)
          }
          else{
            sessionStorage.setItem("notification", "If recovery was successful, you can log in.")
            return router.push("/login")
          }
        })
    }
  });

  return (
    <>
      <Head>
        <title>Change password | Veebster Analyzer</title>
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
              error={Boolean(formik.touched.password && formik.errors.password)}
              fullWidth
              helperText={formik.touched.password && formik.errors.password}
              label="Password"
              margin="normal"
              name="password"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="password"
              value={formik.values.password}
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
