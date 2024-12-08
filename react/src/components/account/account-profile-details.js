import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField
} from '@mui/material';



export const AccountProfileDetails = (props) => {
  const [values, setValues] = useState({});

  useEffect(()=>{
    setValues(
      {
        firstName: props.user.firstName,
        lastName: props.user.lastName,
        email: props.user.email
      }
    )
  },[props.user])



  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };

  const update = () =>{

    fetch("https://veebster.tk/api/user/changename", {
      method: 'POST',
      mode: 'cors',
      credentials: "include",
      body: JSON.stringify(values),
      headers: {
        'Content-Type': 'application/json'
      }}).then(res => res.json()).then((data)=>{
        if(data.ok){
          sessionStorage.setItem("notification", "Successfully change name!")
          window.location.reload(true)
        }
        else{
          sessionStorage.setItem("notification", data.err)
          window.location.reload(true)
        }
      })
  }

  return (
    <form
      autoComplete="off"
      noValidate
      {...props}
    >
      <Card>
        <CardHeader
          subheader="The information can be edited"
          title="Profile"
        />
        <Divider />
        <CardContent>
          <Grid
            container
            spacing={3}
          >
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                helperText="Please specify the first name"
                label="First name"
                name="firstName"
                onChange={handleChange}
                required
                value={values.firstName + ""}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="Last name"
                name="lastName"
                onChange={handleChange}
                required
                value={values.lastName + ""}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={12}
              xs={12}
            >
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                onChange={handleChange}
                disabled
                value={values.email + ""}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >

            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >

            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            p: 2
          }}
        >
          <Button onClick={update}
            color="primary"
            variant="contained"
          >
            Save details
          </Button>
        </Box>
      </Card>
    </form>
  );
};
