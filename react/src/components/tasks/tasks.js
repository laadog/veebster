import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { alpha } from '@mui/material/styles';
import { Box, Container, Typography } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { visuallyHidden } from '@mui/utils';
import { useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useState } from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch'

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



const TasksTable = () => {

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

    const handleChange = (event) => {
      console.log("event")
      setNewTask({
        ...newTask,
        [event.target.name]: event.target.value
      });
    };
    
  return (
    <>
    <Dialog
        open={open}
        onClose={()=>handleDialogChoice(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Are you sure?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Deleted tasks can not be restored.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>handleDialogChoice(false)}>Disagree</Button>
          <Button onClick={()=>handleDialogChoice(true)} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={CreateOpen} onClose={()=>handleCreateClose()}>
        <DialogTitle>New Task</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Hitter can be optained from Sessions tab.
          </DialogContentText>
          <TextField
            onChange={handleChange}
            autoFocus
            margin="dense"
            id="hitter"
            label="Hitter"
            type="number"
            name="hitter"
            value={newTask.hitter}
            fullWidth
            variant="standard"
          />
          <TextField
            sx={{paddingBottom:"10px"}}
            autoFocus
            onChange={handleChange}
            margin="dense"
            id="ip"
            name='ip'
            label="IP Address"
            type="text"
            value={newTask.ip}
            fullWidth
            variant="standard"
          />
          
          <FormControlLabel control={<Switch checked={(newTask.once)}  onChange={(event)=>{
            setNewTask({
              ...newTask,
              once: !newTask.once
            });

          }


          } name="once" />} label="Run once" />
          <TextField
            onChange={handleChange}
            value={newTask.task}
            name="task"
            autoFocus
            margin="dense"
            id="task"
            label="Task"
            multiline
            fullWidth
            variant="standard"
            rows={3}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleCreateClose()}>Cancel</Button>
          <Button onClick={() => handleCreateClose(true)}>Create</Button>
        </DialogActions>
      </Dialog>



    <Container maxWidth="lg"> 
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar newTaskEvent={()=>setCreateOpen(true)} deleteEvent={handleDeleteClick} numSelected={selected.length} />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={data.length}
            />
            <TableBody>
              {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                 rows.slice().sort(getComparator(order, orderBy)) */}
              {
              
              
              data.slice().sort(getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((data, index) => {
                  const isItemSelected = isSelected(data.id);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, data.id)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={data.id}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{
                            'aria-labelledby': labelId,
                          }}
                        />
                      </TableCell>
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                      >
                        {data.ip || "All"}
                      </TableCell>
                      <TableCell align="right">{data.hitter || "All"}</TableCell>
                      <TableCell align="right">{data.once && "True" || "False"}</TableCell>
                      <TableCell align="right">{data.uses}</TableCell>
                      <TableCell align="right">{data.task}</TableCell>
                    </TableRow>
                  );
                })
                
                
                
                }
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 33 * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
    </Container>


    </>
    
  );

}

export default TasksTable;