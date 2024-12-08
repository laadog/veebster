import React from 'react'
import { DashboardLayout } from '../components/dashboard-layout';
import Head from 'next/dist/shared/lib/head';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
  Container,
  Typography
} from '@mui/material';
import { useState } from 'react';


const newpage = () => {
  const [values, setValues] = useState({
    domain: '',
    plan: 'free'
  });


  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };



  const update = () =>{
    fetch("https://veebster.tk/api/page/new", {
      method: 'POST',
      mode: 'cors',
      credentials: "include",
      body: JSON.stringify(values),
      headers: {
        'Content-Type': 'application/json'
      }}).then(res => res.json()).then((data)=>{
        if(data.ok){
          sessionStorage.setItem("notification", "Successfully created new page!")
          window.location.href = "/dash"
        }
        else{
          sessionStorage.setItem("notification", data.err)
          window.location.reload(true)
        }
      })
  }

  return (
    <>
    <Head>
      <title>
        New page | Veebster Analyzer
      </title>
    </Head>
    <DashboardLayout>
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8
      }}
    >
      <Container maxWidth="lg">
      <Typography
          sx={{ mb: 3 }}
          variant="h4"
        >
          New page
        </Typography>
        <form
      autoComplete="off"
      noValidate
    >
      <Card>
        <CardHeader
          subheader="The information can be edited"
          title="Page creation form"
        />
        <Divider />
        <CardContent>
          <Grid
            container
            spacing={3}
          >
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                helperText="Example : veebster.tk"
                label="Domain name"
                name="domain"
                onChange={handleChange}
                required
                value={values.domain + ""}
                variant="outlined"
              />
            </Grid>


            <Grid
              item
              md={6}
              xs={12}
            >

            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >

            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            p: 2
          }}
        >
          <Button onClick={update}
            color="primary"
            variant="contained"
          >
            Create Page
          </Button>
        </Box>
      </Card>
    </form>
      </Container>

      </Box>
    </DashboardLayout>
    </>
  )
}

export default newpage