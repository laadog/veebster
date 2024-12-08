import React from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
  Annotation
} from "react-simple-maps";

const queryString = require('query-string');

const geoUrl =
  "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";

const MapChart = ({setMapToolTip, data}) => {
  



  return (
    <ComposableMap data-tip="">
      <ZoomableGroup zoom={1.3}>
      <Geographies geography={geoUrl}>
        {({ geographies }) =>
          geographies.map(geo => {
            
            let hits = 0;
            let color = ""
            for(var i = 0;i< data.country.length;i++){
              if(geo.properties.ISO_A2 == data.country[i].country){
                color = `#00${(data.country[i].hits*30).toString(16)}`
                hits = data.country[i].hits
              }
            }
            return(
            <Geography 
              key={geo.rsmKey}
              geography={geo}
              onMouseEnter={() => {
                const { NAME, POP_EST } = geo.properties;
                setMapToolTip(`${NAME} — ${hits}`);
              }}
              onMouseLeave={() => {
                setMapToolTip("");
              }}
              fill={color}
              onClick={() => {
                console.debug(geo.properties)
              }}
              stroke="#FFF"
            />
          )
          
          
          })
        }
      </Geographies>
        {data.city.map((city, i) => {
            if(city.city != ""){
              return (
                <>                
                  <Marker coordinates={[city.location[0], city.location[1]]}>
                    <circle r={city.hits} fill="#10b981" />
                  </Marker>
                  <Annotation
                    subject={[city.location[0], city.location[1]]}
                    dx={-30}
                    dy={30}
                    connectorProps={{
                    stroke: "#10b981",
                    strokeWidth: 1,

                  }}
                  >
                    <text y={2} x={-2} fontSize={10} textAnchor="end" alignmentBaseline="middle" fill="#10b981">
                    {city.city + " : " + city.hits}
                    </text>
                  </Annotation>
                </>
              )
            }
        })}

        

      </ZoomableGroup>
    </ComposableMap>
  );
};

export default MapChart;
