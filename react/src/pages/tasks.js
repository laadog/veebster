import * as React from 'react';
import { alpha } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { visuallyHidden } from '@mui/utils';
import { DashboardLayout } from '../components/dashboard-layout';
import Head from 'next/dist/shared/lib/head';
import { useEffect } from 'react';
import { useState } from 'react';
import TasksTable from 'src/components/tasks/tasks';
import IgnoreList from 'src/components/tasks/ignorelist';

const queryString = require('query-string');

var pageId;
function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}



function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

const headCells = [
  {
    id: 'ip',
    numeric: false,
    disablePadding: true,
    label: 'IP',
  },
  {
    id: 'hitter',
    numeric: true,
    disablePadding: false,
    label: 'Hitter',
  },
  {
    id: 'once',
    numeric: true,
    disablePadding: false,
    label: 'Once',
  },
  {
    id: 'uses',
    numeric: true,
    disablePadding: false,
    label: 'Uses',
  },
  {
    id: 'task',
    numeric: true,
    disablePadding: false,
    label: 'Task',
  },
];

function EnhancedTableHead(props) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
    props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all desserts',
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}



const EnhancedTableToolbar = (props) => {
  const { numSelected } = props;

  return (
    
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <>
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Tasks
        </Typography>
        </>
        
      )}
      

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton onClick={props.deleteEvent}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <>
          <Typography
          
          variant="h6"
          id="tableTitle"
          component="div"
        >
          New 
        </Typography>
          <IconButton onClick={props.newTaskEvent} color='success'>
            <AddIcon/>
          </IconButton>
          
          </>
        </Tooltip>
      )}
    </Toolbar>
  );
};



const tasks = () => {

  const [open, setOpen] = useState(false);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('calories');
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const[data, setData] = useState([{},{}])
  const[newTask, setNewTask] = useState({hitter:"", ip:"",once:false, task:""})
  
  const handleDeleteClick = () => {
    setOpen(true);
  };

  const handleDialogChoice = (choice) => {
    if(choice){
      selected.map(id =>{
        fetch(`https://veebster.tk/api/page/${pageId}/task/${id}`, {credentials: "include"})
      })
      return setTimeout(function(){window.location.reload(false)},2000)
    }
    else{
      setOpen(false)
    }
  }

  function getData(){
    pageId = queryString.parse(window.location.search).page
    fetch(`https://veebster.tk/api/page/${pageId}/tasks`, {credentials: "include"}).then(res => res.json()).then((dataf)=>{

    setData(dataf.tasks)

    })


  }

  useEffect(()=>{
    if(queryString.parse(window.location.search).page){
      getData()

    }
  }, [])

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = data.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };



  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };


  const isSelected = (name) => selected.indexOf(name) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

    const [CreateOpen, setCreateOpen] = useState(false);


    const handleCreateClose = (choice = false) => {
      if(choice){
        fetch(`https://veebster.tk/api/page/${pageId}/task`, {
          method: 'POST',
          mode: 'cors',
          credentials: "include",
          body: JSON.stringify(newTask),
          headers: {
            'Content-Type': 'application/json'
          }}).then(res => res.json()).then((res)=>{
            if(res.ok){
              sessionStorage.setItem("notification", "New task successfully added.")
              return window.location.reload(false)
            }
            sessionStorage.setItem("notification", res.err)
            return window.location.reload(false)
          })
      }
      setCreateOpen(false);
    };

    
  return (
    <>
    <Head>
      <title>Tasks | Veebster Analyzer</title>
    </Head>  

    <Box component="main" sx={{flexGrow: 1, py: 4}}>
    <TasksTable/>
    <IgnoreList/>


    </Box>
    </>
    
  );

}

tasks.getLayout = (page) =>(
  <DashboardLayout>
  {page}
</DashboardLayout>
)

export default tasks;