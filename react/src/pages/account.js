import Head from 'next/head';
import { Box, Container, Grid, Typography } from '@mui/material';
import { AccountProfile } from '../components/account/account-profile';
import { AccountProfileDetails } from '../components/account/account-profile-details';
import { DashboardLayout } from '../components/dashboard-layout';
import { SettingsPassword } from '../components/account/settings-password';
import { useState } from 'react';
import { useEffect } from 'react';

const Account = () => {
  const[info, setInfo] = useState([])
  useEffect(() => {
    fetch('https://veebster.tk/api/user/session', {
      credentials: "include",
    }).then(res => res.json()).then((data)=>{
      if(data.uid){
        setInfo(data)
      }
      else{

      }
    })
  }, []);
  
  
  return(
  <>
    <Head>
      <title>
        Account | Veebster Analyzer
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
          Account
        </Typography>
        <Grid
          container
          spacing={3}
        >
          <Grid
            item
            lg={8}
            md={6}
            xs={12}
          >
            <AccountProfile user={{name:info.firstName +" "+ info.lastName, email: info.email}} />
          </Grid>
          <Grid
            item
            lg={8}
            md={6}
            xs={12}
          >
            <AccountProfileDetails user={{firstName:info.firstName, lastName:info.lastName, email: info.email}} />
          </Grid>
          <Grid
            item
            lg={8}
            md={6}
            xs={12}
          >
            <SettingsPassword />
          </Grid>
        </Grid>
      </Container>
    </Box>
  </>
)};

Account.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Account;
