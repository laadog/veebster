import React from 'react'
import {
    Avatar,
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Divider,
    Typography
  } from '@mui/material';
import image from '../../../public/static/images/auth.jpeg'

const news = (props) => {
  return (
    <Card>
      <Box
        sx={{
          maxHeight:"300px",
          display: 'flex',
        }}
      >
        
        <img style={{
          float:"left",
          maxWidth:"300px",
          display:"inline",
          marginRight: "20px",
        }} src={props.new.img ||  image} />
        <div style={{paddingTop:"5px"}}>
        <Typography display="inline" sx={{ mb: 3, mt:1}} variant="h6">
          {props.new.title} - {props.new.date} 
        </Typography>
        <br/>
        <Typography display="inline" variant="p">
        {props.new.content}
        </Typography>
        
        </div>
        
        
        </Box>


    </Card>
  )
}

export default news