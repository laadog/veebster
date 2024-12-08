import Head from 'next/head';
import { Box, Container, Typography} from '@mui/material';
import { DashboardLayout } from '../components/dashboard-layout';
import Map from 'src/components/geographics/map';
import ReactTooltip from "react-tooltip";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useState } from 'react';
import { useEffect } from 'react';

const queryString = require('query-string')


const Geographics = () => {
  const [mapTooltip, setMapToolTip] = useState("");
  const[data, setData] = useState({country: [], city: []})

  function getData(){
    const pageId = queryString.parse(window.location.search).page
    
    fetch(`https://veebster.tk/api/stat/${pageId}/country`, {credentials: "include"}).then(res => res.json()).then((dataf)=>{
      setData(previousState =>{
        return{
        ...previousState, 
        country: dataf
        }
      })

    })


    fetch(`https://veebster.tk/api/stat/${pageId}/city`, {credentials: "include"}).then(res => res.json()).then((dataf)=>{
      setData(previousState =>{
        return{
        ...previousState, 
        city: dataf
        }
      })

    })
  }

  useEffect(()=>{
    getData()
  }, [])
  
  return(
  <>
    <Head>
      <title>
        Geographics | Veebster Analyzer
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
        <Typography
        sx={{ mb: 3 }}
        variant="h4"
        >
        Map of hits
        </Typography>
        <div style={{color: "red", border:"2px solid #111827", borderRadius:"5px", overflow:"hidden"}}>
          <Map setMapToolTip={setMapToolTip} data={data}/>
          <ReactTooltip>{mapTooltip}</ReactTooltip>
        </div>

        <Typography
        sx={{ mb: 3, paddingTop:"20px" }}
        variant="h4"
        >
        Countries
        </Typography>
        <div>
        <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Country</TableCell>
            <TableCell>Hits</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.country.map((row) => (
            <TableRow
              key={row.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.country || "Unknown"}
              </TableCell>
              <TableCell>{row.hits}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>

        </div>

        <Typography
        sx={{ mb: 3, paddingTop:"20px" }}
        variant="h4"
        >
        Cities
        </Typography>
        <div>
        <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>City</TableCell>
            <TableCell>Country</TableCell>
            <TableCell>Hits</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.city.map((row) => (
            <TableRow
              key={row.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.city || "Unknown"}
              </TableCell>
              <TableCell>{row.country || "Unknown"}</TableCell>
              <TableCell>{row.hits}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>

        </div>
      </Container>
    </Box>
  </>
);


}

Geographics.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Geographics;
