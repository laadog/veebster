import React, { useEffect } from 'react'

import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Notification = () => {
    const [open, setOpen] = React.useState(true);
    const handleClick = () => {
      setOpen(true);
    };
  
    const[notif, setNotif] = React.useState("")

    useEffect(()=>{
      setNotif(sessionStorage.getItem("notification"))
      sessionStorage.removeItem("notification")
    }, [])

    const handleClose = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
  
      setOpen(false);
    };


if(notif){
  return (
        <Snackbar anchorOrigin={{vertical:"top", horizontal:"center"}} open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="info" sx={{ width: '100%' }}>
        { notif }
        </Alert>
      </Snackbar>
  )
}
return(
  <>
  </>
)
}

export default Notification