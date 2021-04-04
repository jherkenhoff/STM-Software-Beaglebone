
import React from 'react';
import PropTypes from "prop-types";
import styled from 'styled-components';

import Chart from "react-apexcharts";


function TipPlot(props) {

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
    },
    title: {
      text: 'Average High & Low Temperature',
      align: 'left',
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

  const tipCurrentSeries = [
    {
      name: "Tip Current",
      data: props.tipCurrentLog.map( ({time, current}) => [time, current] )
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
};

export default TipPlot;
