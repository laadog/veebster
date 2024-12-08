import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    IconButton,
    Typography,
  } from '@mui/material';
  import CloseIcon from '@mui/icons-material/Close';
  import create from 'zustand'; 



  const ConfirmDialog = (message, onSubmit) => {

    const useConfirmDialogStore = create((set) => ({
      message,
      onSubmit,
      close: () => set({ onSubmit: undefined }),
    }));


    return (
      <Dialog open={Boolean(onSubmit)} onClose={close} maxWidth="sm" fullWidth> 
      <DialogTitle>Confirm the action</DialogTitle>
      <Box position="absolute" top={0} right={0}>
        <IconButton onClick={close}>
          <CloseIcon />
        </IconButton>
      </Box>
      <DialogContent>
        <Typography>{message}</Typography>
      </DialogContent>
      <DialogActions>
        <Button color="primary" variant="contained" onClick={close}>
          Cancel
        </Button>
        <Button
          color="secondary"
          variant="contained"
          onClick={() => {
            if (onSubmit) {
              onSubmit();
            }
            close();
          }}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
    );
  };
  
  export default ConfirmDialog;