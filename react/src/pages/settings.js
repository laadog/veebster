import Head from 'next/head';
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
import { DashboardLayout } from '../components/dashboard-layout';
import { useEffect, useState, useContext } from 'react';
const queryString = require('query-string');

const Settings = () => {
  const [page, setPage] = useState({})
  useEffect(()=> {
     let pages = JSON.parse(sessionStorage.getItem("pagesList"))
     setPage(pages.find(e => e.id == queryString.parse(window.location.search).page))
  }, [])
  
  console.log(page)
  const deletePage = () =>{
    if(confirm("This can't be taken back.")){
          fetch("https://veebster.tk/api/page/delete", {
      method: 'POST',
      mode: 'cors',
      credentials: "include",
      body: JSON.stringify({domain: page.domain}),
      headers: {
        'Content-Type': 'application/json'
      }}).then(res => res.json()).then((data)=>{
        if(data.ok){
          sessionStorage.setItem("notification", "Successfully deleted page!")
          window.location.href = "/news"
        }
        else{
          sessionStorage.setItem("notification", data.err)
          window.location.reload(true)
        }
      })
    }
  }

  return(
  <>
    <Head>
      <title>
        Settings | Veebster Analyzer
      </title>
    </Head>
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
          {page.domain} settings  
        </Typography>
        <Box sx={{ pt: 3 }}>
        <form
      autoComplete="off"
      noValidate
    >
      <Card>
        <CardHeader
          subheader="Deleting page is permanent, data can't be accessed afterwards."
        />
        <Divider />
        <CardContent>
          <Grid
            container
            spacing={3}
          >


            <Grid
              item
              md={12}
              xs={12}
            >
              <TextField
                fullWidth
                label="Tracking script"
                disabled
                value={"<script src=https://veebster.tk/api/hit/src/" + page.tag + ".js></script>"}
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
          <Button onClick={()=>{
            window.location.href = "/dash" + window.location.search
          }}
            color="primary"
            variant="contained"
          >
            Dashboard
          </Button>
          <Button 
          sx={{
            ml: 2
          }}
          onClick={deletePage}

            color="error"
            variant="contained"
          >
            Delete page
          </Button>
        </Box>
      </Card>
    </form>
        </Box>
      </Container>
    </Box>
  </>
)};

Settings.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Settings;
