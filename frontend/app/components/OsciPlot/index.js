
import React from 'react';
import PropTypes from "prop-types";
import styled from 'styled-components';

import Chart from "react-apexcharts";

function OsciPlot(props) {

  const average = arr => arr.reduce((acc,v) => acc + v) / arr.length;

  let adcAvg, zAvg;
  if (props.scanPoints.length > 0) {
    adcAvg = average(props.scanPoints.map( ({x, y, adc, z}, i) => adc*1e9 ))
    zAvg = average(props.scanPoints.map( ({x, y, adc, z}, i) => z ))
  } else {
    adcAvg = 0
    zAvg = 0
  }

  console.log(adcAvg);

  const series = [
    {
      name: "Tip Current",
      data: props.scanPoints.map( ({x, y, adc, z}, i) => [i, adc*1e9-adcAvg] )
    }, {
      name: "Z Coordinate",
      data: props.scanPoints.map( ({x, y, adc, z}, i) => [i, z-zAvg] )
    }
  ]

  const options = {
    chart: {
      animations: {
        enabled: false
      },
      toolbar: {
        show: false
      },
      zoom: {
        enabled: false
      },
    },
    stroke: {
      width: 2
    },
    yaxis: [{
      tickAmount: 3,
      decimalsInFloat: 3,
      title: {
        text: "Tip Current / nA - " + adcAvg.toFixed(2)
      },
    }, {
      opposite: true,
      tickAmount: 3,
      decimalsInFloat: 3,
      title: {
        text: "Z Coordinate - " + zAvg.toFixed(2)
      },
    }],
    annotations: {
      yaxis: [
        {
          y: props.pidSetpoint*1e9 - adcAvg,
          borderColor: '#00E396',
          label: {
            text: 'PID Setpoint',
            textAnchor: "start",
            position: "left",
            borderColor: '#00E396',
            style: {
              color: '#fff',
              background: '#00E396'
            },
          }
        }
      ]
    }
  }

  return (
    <Chart
      options={options}
      series={series}
      type="line"
      width="100%"
      height="400px"
    />
  );
}

OsciPlot.propTypes = {
  scanPoints: PropTypes.array
};

export default OsciPlot;
