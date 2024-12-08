import React from 'react'
import Head from 'next/dist/shared/lib/head';
import { DashboardLayout } from '../components/dashboard-layout';
import { Box, Container, Grid, Typography } from '@mui/material';
import News from 'src/components/cards/news';
import Notification from 'src/components/notification';

const data = [
  {
              title:"UI changes",
              date: "02.01.2022",
              content: "Added better functionality"
  }
]

const news = () => {
  return (
    <>
    <Notification/>
    <Head>
      <title>News | Veebster Analyzer</title>
    </Head>  
      <Box component="main" sx={{flexGrow: 1, py: 4}}>
        <Container maxWidth="lg"> 
        <Typography sx={{ mb: 3 }} variant="h4">
          News
        </Typography>
        <Grid container spacing={3} >
          <Grid item lg={10} md={6} xs={12}>
            {data.map((shard)=>{
              return(
                <News key="{item}" new={shard}/>
              )
            })}
          </Grid>
        </Grid>
        </Container>

      </Box>
    </>
  )
}
news.getLayout = (page) =>(
  <DashboardLayout>
  {page}
</DashboardLayout>
)

export default news