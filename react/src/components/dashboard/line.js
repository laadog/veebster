import { Line } from 'react-chartjs-2';
import { Box, Button, Card, CardContent, CardHeader, Divider } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useState } from 'react';
import { useEffect } from 'react';
import ButtonGroup from '@mui/material/ButtonGroup';
const queryString = require('query-string');


const getDatesBetweenDates = (startDate, endDate) => {
  let dates = []
  const theDate = new Date(startDate)
  while (theDate < endDate) {
    dates = [...dates, new Date(theDate)]
    theDate.setDate(theDate.getDate() + 1)
  }
  return dates
}


export const Sales = (props) => {
  var dt = new Date()
  const [lineData, setLineData] = useState({data:[], labels:[]})

  
  
  function getData(mode="week"){
    const pageId = queryString.parse(window.location.search).page
    var values = [];
    var labels = []
    
    if(mode == "year"){ // year
      fetch(`https://veebster.tk/api/stat/${pageId}/hit?precision=day&year=${dt.getFullYear()}`, {credentials: "include"}).then(res => res.json()).then((dataf)=>{
        let start = new Date()

        start.setMonth(0)
        start.setDate(0)
        let end = new Date()
        var labelsArr = getDatesBetweenDates(start, end)
        for(var i = 0;i<labelsArr.length;i++){
          labels.push(labelsArr[i].getFullYear()  +"-" + ('0' + (labelsArr[i].getMonth()+1)).slice(-2) + "-" + ('0' + (labelsArr[i].getDate()+1)).slice(-2))
          values[i] = 0
          
          for(var j = 0;j<dataf.hits.length;j++){
            if(labels[i] == dataf.hits[j].DATE){
              values[i] = dataf.hits[j].HITS
            }
          }
        }
        setLineData({labels, values})

        
      })
    }
    else if(mode == "month"){ // month
      fetch(`https://veebster.tk/api/stat/${pageId}/hit?precision=day&year=${dt.getFullYear()}`, {credentials: "include"}).then(res => res.json()).then((dataf)=>{
        let start = new Date()
        start.setMonth(start.getMonth()-1)
        let end = new Date()
        var labelsArr = getDatesBetweenDates(start, end)
        for(var i = 0;i<labelsArr.length;i++){
          labels.push(labelsArr[i].getFullYear()  +"-" + ('0' + (labelsArr[i].getMonth()+1)).slice(-2) + "-" + ('0' + (labelsArr[i].getDate()+1)).slice(-2))
          values[i] = 0
          
          for(var j = 0;j<dataf.hits.length;j++){
            if(labels[i] == dataf.hits[j].DATE){
              values[i] = dataf.hits[j].HITS
            }
          }
        }
        setLineData({labels, values})

        
      })
    }    
    else if(mode == "week"){ // week
      fetch(`https://veebster.tk/api/stat/${pageId}/hit?precision=day&year=${dt.getFullYear()}`, {credentials: "include"}).then(res => res.json()).then((dataf)=>{
        if(dataf.hits){
        let start = new Date()
        start.setDate(start.getDate()-7)
        let end = new Date()
        var labelsArr = getDatesBetweenDates(start, end)
        for(var i = 0;i<labelsArr.length;i++){
          labels.push(labelsArr[i].getFullYear()  +"-" + ('0' + (labelsArr[i].getMonth()+1)).slice(-2) + "-" + ('0' + (labelsArr[i].getDate()+1)).slice(-2))
          values[i] = 0
          
          for(var j = 0;j<dataf.hits.length;j++){
            if(labels[i] == dataf.hits[j].DATE){
              values[i] = dataf.hits[j].HITS
            }
          }
        }
        setLineData({labels, values})
        }


        
      })
    }
    else if(mode == "day"){ // week
      fetch(`https://veebster.tk/api/stat/${pageId}/hit?precision=hour&year=${dt.getFullYear()}&month=${dt.getMonth()+1}`, {credentials: "include"}).then(res => res.json()).then((dataf)=>{
        const start = new Date()
        start.setDate(start.getDate()-1)
        start.setHours(start.getHours()+4)
        var labelsArr = []
        for(var i = 0;i<24;i++){
          labelsArr = [...labelsArr, new Date(start)]
          start.setHours(start.getHours()+1)
          console.log(start.getHours())
        }
        
        for(var i = 0;i<labelsArr.length;i++){
          labels.push(labelsArr[i].getFullYear()  +"-" + ('0' + (labelsArr[i].getMonth()+1)).slice(-2) + "-" + ('0' + (labelsArr[i].getDate())).slice(-2) + "-" + labelsArr[i].getHours())
          console.log(labels[i])
          values[i] = 0
          
          for(var j = 0;j<dataf.hits.length;j++){
            if(labels[i] == dataf.hits[j].DATE){
              values[i] = dataf.hits[j].HITS
            }
          }
          labels[i] = labelsArr[i].getHours() + ":00"
        }
        setLineData({labels, values})

        
      })
    }


  }
  useEffect(()=>{
    getData()
    // setInterval(()=>{
    //   getData()
    // }, 5000)
  }, [])

  
  














  const[duration, setDuration] = useState("week")

  const durationSelect = (e) => {
    e.length && setDuration(e)
    getData(e)

  };
  var ChartData = {
    datasets: [
      {

      data: lineData.values,
      label: 'Hits ',
      borderColor: '#e53935',
      tension: 0.2
      },
      // {
      //   data: [11, 20, 12, 29, 30, 25, 13],
      //   label: 'Last ' + duration,
      //   borderColor: '#fb8c00',
      //   tension: 0.1
      // }
    ],
    labels: lineData.labels
  };


  const options = {

    maintainAspectRatio: false,
    responsive: true,
    animation:true,
    tooltips: {
      borderWidth: 1,
      enabled: true,
      intersect: false,
      mode: 'index',
    }
  };

  return (
      
    <>
    <div style={{width:"20px"}}>

    </div>
    <Card {...props}>
      <CardHeader
        action={(
          
<>
      <ButtonGroup size="small" aria-label="small button group">
        <Button onClick={() => durationSelect("day")} variant={duration == "day" && "contained" || "outlined"}>Day</Button>
        <Button onClick={() => durationSelect("week")} variant={duration == "week" && "contained" || "outlined"}>Week</Button>
        <Button onClick={() => durationSelect("month")} variant={duration == "month" && "contained" || "outlined"}>Month</Button>
        <Button onClick={() => durationSelect("year")} variant={duration == "year" && "contained" || "outlined"}>Year</Button>
      </ButtonGroup>
</>
          
        )}
        title="Hits activity"
      />

      <Divider />
      <CardContent>
        <Box
          sx={{
            height: 400,
            position: 'relative'
          }}
        >
          <Line
            data={ChartData}
            options={options}
          />
        </Box>
      </CardContent>
      <Divider />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-start',
          p: 2
        }}
      >
      </Box>
    </Card>
    </>
  );
};
