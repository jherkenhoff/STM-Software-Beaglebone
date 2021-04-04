
import React from 'react';
import PropTypes from "prop-types";
import styled from 'styled-components';

import Chart from "react-apexcharts";


function TipPlot(props) {

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
    xaxis: {
      type: "datetime",
      labels: {
        format: 'HH:mm:ss',
      }
    },
    yaxis: [{
      tickAmount: 3,
      decimalsInFloat: 3,
      title: {
        text: "Tip Current / nA"
      },
    }, {
      opposite: true,
      tickAmount: 3,
      decimalsInFloat: 3,
      title: {
        text: "Z Coordinate"
      },
    }],
    annotations: {
      yaxis: [
        {
          y: props.pidSetpoint*1e9,
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

  const tipCurrentSeries = [
    {
      name: "Tip Current",
      data: props.log.map( ({time, current, x, y, z}) => [time/1e6, current*1e9] )
    }, {
      name: "Z Coordinate",
      data: props.log.map( ({time, current, x, y, z}) => [time/1e6, z] )
    }
  ]

  return (
    <Chart
      options={options}
      series={tipCurrentSeries}
      type="line"
      width="100%"
      height="200px"
    />
  );
}

TipPlot.propTypes = {
  tipCurrentLog: PropTypes.array,
  pidSetpoint: PropTypes.number
};

export default TipPlot;
