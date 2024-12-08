import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import Collapse from '@mui/material/Collapse';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TablePagination from '@mui/material/TablePagination';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { DashboardLayout } from '../components/dashboard-layout';
import { Box, Container, Typography } from '@mui/material';
import Head from 'next/dist/shared/lib/head';
import { useState } from 'react';
import { useEffect } from 'react';
const queryString = require('query-string');

var pageId;

function createData(pseodonym, ip, hits, country,	city,	lastHit,	device,	id) {
  return {
    pseodonym,
    ip,
    hits,
    country,
    city,
    lastHit,
    device,
    id,
    history: [
      {
        date: '2020-01-05',
        customerId: '11091700',
        amount: 3,
      },
      {
        date: '2020-01-02',
        customerId: 'Anonymous',
        amount: 1,
      },
    ],
  };
}

function createIpData(ip, hits, last) {
  return {
    ip,
    hits,
    last,
  };
}

function Row(props) {
  const { row } = props;
  const [open, setOpen] = useState(false);
  const [history, setHistory] = useState([])

function handleClick(){
  fetch(`https://veebster.tk/api/stat/${pageId}/u/${props.row.id}/hits`, {credentials: "include"}).then(res => res.json()).then((dataf)=>{

    setHistory(dataf)

    })
  setOpen(!open)
}

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={handleClick}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.pseodonym}
        </TableCell>
        <TableCell align="right">{row.ip}</TableCell>
        <TableCell align="right">{row.hits}</TableCell>
        <TableCell align="right">{row.country}</TableCell>
        <TableCell align="right">{row.city}</TableCell>
        <TableCell align="right">{row.lastHit}</TableCell>
        <TableCell align="right">{row.device}</TableCell>
        <TableCell align="right">{row.id}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                History
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Time</TableCell>
                    <TableCell>path</TableCell>
                    <TableCell align="right">IP</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {history.map((entry) => (
                    <TableRow key={entry.time}>
                      <TableCell component="th" scope="row">
                        {entry.time}
                      </TableCell>
                      <TableCell>{entry.path}</TableCell>
                      <TableCell align="right">{entry.ip}</TableCell>

                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

function IpRow(props) {
  const { row } = props;
  const [open, setOpen] = useState(false);
  const [history, setHistory] = useState([])

function handleClick(){
  fetch(`https://veebster.tk/api/stat/${pageId}/i/${props.row.ip}/hits`, {credentials: "include"}).then(res => res.json()).then((dataf)=>{

    setHistory(dataf)

    })
  setOpen(!open)
}

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={handleClick}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.ip}
        </TableCell>
        <TableCell align="right">{row.hits}</TableCell>
        <TableCell align="right">{row.last}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                History
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Time</TableCell>
                    <TableCell>path</TableCell>
                    <TableCell align="right">Hitter</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {history.map((entry) => (
                    <TableRow key={entry.time}>
                      <TableCell component="th" scope="row">
                        {entry.time}
                      </TableCell>
                      <TableCell>{entry.path}</TableCell>
                      <TableCell align="right">{entry.hitter}</TableCell>

                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}









const sessions = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [IpPage, setIpPage] = useState(0);
  const [IprowsPerPage, setIpRowsPerPage] = useState(10);
  const[data, setData] = useState({})


  function getData(){
    pageId = queryString.parse(window.location.search).page
    fetch(`https://veebster.tk/api/stat/${pageId}/users`, {credentials: "include"}).then(res => res.json()).then((dataf)=>{

    setData(previousState =>{
      return{
      ...previousState, 
      sessions: dataf.length && dataf
      }
    })

    })

    fetch(`https://veebster.tk/api/stat/${pageId}/ips`, {credentials: "include"}).then(res => res.json()).then((dataf)=>{

      setData(previousState =>{
        return{
        ...previousState, 
        ips: dataf.length && dataf
        }
      })
  
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleChangeIpPage = (event, newPage) => {
    setIpPage(newPage);
  };

  const handleChangeIpRowsPerPage = (event) => {
    setIpRowsPerPage(+event.target.value);
    setIpPage(0);
  };
  return (
    <>
    <Head>
      <title>Sessions | Veebster Analyzer</title>
    </Head>  
      <Box component="main" sx={{flexGrow: 1, py: 4}}>
        <Container maxWidth="lg"> 
        <Typography sx={{ mb: 3 }} variant="h4">
          Sessions
        </Typography>
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Pseodonym</TableCell>
              <TableCell align="right">IP</TableCell>
              <TableCell align="right">Hits</TableCell>
              <TableCell align="right">Country</TableCell>
              <TableCell align="right">City</TableCell>
              <TableCell align="right">Last hit</TableCell>
              <TableCell align="right">Device</TableCell>
              <TableCell align="right">Id</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>

{(function(render, i){
  if(data.sessions){

    for(var i = page*rowsPerPage;i< (data.sessions.length > page*rowsPerPage+rowsPerPage && page*rowsPerPage+rowsPerPage || data.sessions.length) ;i++){
      render.push(<Row key={data.sessions[i].pseudonym} row={createData(data.sessions[i].pseudonym, data.sessions[i].ip,data.sessions[i].hits,data.sessions[i].country,data.sessions[i].city,data.sessions[i].last,data.sessions[i].device,data.sessions[i].id)} />)
    }
  }
  return render;
})([],0)}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={data.sessions && data.sessions.length || 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />


      </Container>



      <Container maxWidth="lg"> 
        <Typography sx={{ mb: 3 }} variant="h4">
          IP addresses
        </Typography>
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>IP</TableCell>
              <TableCell align="right">Hits</TableCell>
              <TableCell align="right">Last</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>

{(function(render, i){
  if(data.ips){

    for(var i = page*rowsPerPage;i< (data.ips.length > page*rowsPerPage+rowsPerPage && page*rowsPerPage+rowsPerPage || data.ips.length) ;i++){
      render.push(<IpRow key={data.ips[i].ip} row={createIpData(data.ips[i].ip,data.ips[i].hits,data.ips[i].last)} />)
    }
  }
  return render;
})([],0)}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={data.ips && data.ips.length || 0}
        rowsPerPage={IprowsPerPage}
        page={IpPage}
        onPageChange={handleChangeIpPage}
        onRowsPerPageChange={handleChangeIpRowsPerPage}
      />


      </Container>


    </Box>
    </>
  );
}

sessions.getLayout = (page) =>(
  <DashboardLayout>
  {page}
</DashboardLayout>
)

export default sessions