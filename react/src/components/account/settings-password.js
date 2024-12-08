import { useState } from 'react';
import { Box, Button, Card, CardContent, CardHeader, Divider, TextField } from '@mui/material';

export const SettingsPassword = (props) => {
  const [values, setValues] = useState({
    currentPassword: '',
    password: '',
    confirm: ''
  });

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };

  const updatePassword = () => {
    if(values.currentPassword.length > 5 && values.confirm.length > 5 && values.password.length > 5){
      fetch("https://veebster.tk/api/user/changepass", {
        method: 'POST',
        mode: 'cors',
        credentials: "include",
        body: JSON.stringify({
          newpass : values.password,
          password: values.currentPassword
        }),
        headers: {
          'Content-Type': 'application/json'
        }}).then(res => res.json()).then((data)=>{
          if(data.ok){
            sessionStorage.setItem("notification", "Successfully changed password, you can log in with new one!")
            window.location.href = "/login"
          }
          else{
            sessionStorage.setItem("notification", data.err)
            window.location.reload(true)
          }
        })
    }
    else{

    }
  }

  return (
    <form {...props}>
      <Card>
        <CardHeader
          subheader="Update password"
          title="Password"
        />
        <Divider />
        <CardContent>
        <TextField
            fullWidth
            required
            label="Current password"
            margin="normal"
            name="currentPassword"
            onChange={handleChange}
            type="password"
            value={values.currentPassword + ""}
            variant="outlined"
          />
          <TextField
            required
            fullWidth
            label="Password"
            margin="normal"
            name="password"
            onChange={handleChange}
            type="password"
            value={values.password}
            variant="outlined"
          />
          <TextField
            required
            fullWidth
            label="Confirm password"
            margin="normal"
            name="confirm"
            onChange={handleChange}
            type="password"
            value={values.confirm}
            variant="outlined"
          />
        </CardContent>
        <Divider />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            p: 2
          }}
        >
          <Button onClick={updatePassword}
            color="primary"
            variant="contained"
          >
            Update password
          </Button>
        </Box>
      </Card>
    </form>
  );
};
