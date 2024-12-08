import Head from 'next/head';
import { Box, Container, Grid } from '@mui/material';
import { NumberCard } from '../components/dashboard/numbercard';
import { LatestUsers } from '../components/dashboard/LatestUsers';
import { TopPaths } from '../components/dashboard/topPaths';
import { Sales as Line } from '../components/dashboard/line';
import { PieChart } from '../components/dashboard/piechart';
import { DashboardLayout } from '../components/dashboard-layout';
import Notification from 'src/components/notification';
import { useEffect, useState } from 'react';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import LinkIcon from '@mui/icons-material/Link';
import BoltIcon from '@mui/icons-material/Bolt';
const queryString = require('query-string');

const Dashboard = () => {
  
  const[data, setData] = useState({})

  function getData(){
    const pageId = queryString.parse(window.location.search).page
    var dt = new Date()
    fetch(`https://veebster.tk/api/stat/${pageId}/user?precision=minute&year=${dt.getFullYear()}&month=${dt.getMonth()+1}&day=${dt.getDate()}&hour=${dt.getHours()+3}&minute=${dt.getMinutes()-1}`, {credentials: "include"}).then(res => res.json()).then((dataf)=>{

    setData(previousState =>{
      return{
      ...previousState, 
      sessions: dataf.hits.length && dataf.hits[0].USERS 
      }
    })
    })

    fetch(`https://veebster.tk/api/stat/${pageId}/ip?precision=minute&year=${dt.getFullYear()}&month=${dt.getMonth()+1}&day=${dt.getDate()}&hour=${dt.getHours()+3}&minute=${dt.getMinutes()-1}`, {credentials: "include"}).then(res => res.json()).then((dataf)=>{
        setData(previousState =>{
          return{
          ...previousState, 
          ips: dataf.hits.length && dataf.hits[0].ips 
          }
        })

    })

    fetch(`https://veebster.tk/api/stat/${pageId}/paths`, {credentials: "include"}).then(res => res.json()).then((dataf)=>{
        setData(previousState =>{
          return{
          ...previousState, 
          
          paths: dataf[0].paths
          }
      })  
    })
    
    fetch(`https://veebster.tk/api/stat/${pageId}/hit?precision=day&year=${dt.getFullYear()}&month=${dt.getMonth()+1}&day=${dt.getDate()}`, {credentials: "include"}).then(res => res.json()).then((dataf)=>{
        setData(previousState =>{
          return{
          ...previousState, 
          
          hitsToday: dataf.hits.length && dataf.hits[0].HITS
          }
      })  
    })

    fetch(`https://veebster.tk/api/stat/${pageId}/device`, {credentials: "include"}).then(res => res.json()).then((dataf)=>{

      setData(previousState =>{
        return{
          ...previousState, 
          deviceData: dataf.length && {data: [dataf[0].hits || 0, dataf[1] && dataf[1].hits || 0], labels:[dataf[0].device || "", dataf[1] && dataf[1].device || ""]}
        }
      })  
    })

    fetch(`https://veebster.tk/api/stat/${pageId}/users`, {credentials: "include"}).then(res => res.json()).then((dataf)=>{

      setData(previousState =>{
        return{
          ...previousState, 
          users: dataf.slice(0, 10)
        }
      }) 
    })

    fetch(`https://veebster.tk/api/stat/${pageId}/path`, {credentials: "include"}).then(res => res.json()).then((dataf)=>{

      setData(previousState =>{
        return{
          ...previousState, 
          topPaths: dataf.slice(0, 10)
        }
      }) 
      console.log(data.topPaths)
    })



  }
  useEffect(()=>{
    if(queryString.parse(window.location.search).page){
      getData()

    }

    // setInterval(()=>{
    //   getData()
    // }, 5000)
  }, [])

  return(

  <>
    <Notification/>
    <Head>
      <title>
        Dashboard | Veebster Analyzer
      </title>
    </Head>
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8
      }}
    >
      <Container maxWidth={false}>
        <Grid
          container
          spacing={3}
        >
          <Grid
            item
            lg={3}
            sm={6}
            xl={3}
            xs={12}
          >
            <NumberCard title={"ONLINE SESSIONS"} number={data.sessions} showicon={true} text={"Count of sessions may not equal count of users."} />
          </Grid>
          <Grid
            item
            xl={3}
            lg={3}
            sm={6}
            xs={12}
          >
            <NumberCard title={"ONLINE IPS"} icon={<PhoneIphoneIcon/>} showicon={true} number={data.ips} text={"Count of ips may not equal count of users."} />
          </Grid>
          <Grid
            item
            xl={3}
            lg={3}
            sm={6}
            xs={12}
          >
            <NumberCard title={"UNIQUE PATHS"} icon={<LinkIcon/>} showicon={true} number={data.paths} text={"Rapid increase of paths may indicate an attack."} />
          </Grid>
          <Grid
            item
            xl={3}
            lg={3}
            sm={6}
            xs={12}
          >
            <NumberCard title={"TODAYS HITS"} icon={<BoltIcon/>}  number={data.hitsToday}  />
          </Grid>
          <Grid
            item
            lg={8}
            md={12}
            xl={9}
            xs={12}
          >
            <Line />
          </Grid>
          <Grid
            item
            lg={4}
            md={6}
            xl={3}
            xs={12}
          >
            <PieChart title={"Traffic by device"} labels={data.deviceData && data.deviceData.labels} data={data.deviceData && data.deviceData.data || [1,1]} sx={{ height: '100%' }} />
          </Grid>
          <Grid
            item
            lg={4}
            md={6}
            xl={3}
            xs={12}
          >
            <TopPaths data={data.topPaths || []} sx={{ height: '100%' }} />
          </Grid>
          <Grid
            item
            lg={8}
            md={12}
            xl={9}
            xs={12}
          >
            <LatestUsers data={data.users || []} />
          </Grid>
        </Grid>
      </Container>
    </Box>
  </>
)};

Dashboard.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Dashboard;
