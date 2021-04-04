
import React from 'react';
import PropTypes from "prop-types";
import styled from 'styled-components';

import Chart from "react-apexcharts";

function EnvironmentPlot(props) {

  const options = {
    chart: {
      id: "basic-bar",
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
    legend: {
      position: "top",
      horizontalAlign: 'right',
      floating: true
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
    yaxis: {
      tickAmount: 3,
      decimalsInFloat: 3,
      title: {
        text: "Tip Current / nA"
      },
    },
    annotations: {
      yaxis: [
        {
          y: -3.108,
          borderColor: '#00E396',
          label: {
            text: 'PID Setpoint',
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

  const tempSeries= [
    {
      name: "Mainboard Temp.",
      data: props.temperatureLog.map( ({time, mainboard, supply}) => [time, mainboard] )
    },
    {
      name: "Supply Temp.",
      data: props.temperatureLog.map( ({time, mainboard, supply}) => [time, supply] )
    }
  ]

  return (
    <Chart
      options={options}
      series={tempSeries}
      type="line"
      width="100%"
      height="150px"
    />
  );
}

EnvironmentPlot.propTypes = {
  temperatureLog: PropTypes.array,
};

export default EnvironmentPlot;
