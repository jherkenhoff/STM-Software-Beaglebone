
import React from 'react';
import PropTypes from "prop-types";
import styled from 'styled-components';

import Chart from "react-apexcharts";


function LivePlot(props) {
  const tipCurrentOptions = {
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

  const tempOptions = {
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
    <div>
      <Chart
          options={tempOptions}
          series={tempSeries}
          type="line"
          width="100%"
          height="150px"
        />
    <Chart
        options={tipCurrentOptions}
        series={tipCurrentSeries}
        type="line"
        width="100%"
        height="200px"
      />
      </div>
    // <Resizable>
    //   <ChartContainer timeRange={tipCurrentSeries.timerange()} >
    //     <ChartRow height="100">
    //       <YAxis id="temp-axis" label="Temp. / °C" min={temperatureSeries.min()} max={temperatureSeries.max()} width="60" type="linear" format=",.2f"/>
    //       <Charts>
    //         <LineChart axis="temp-axis" series={temperatureSeries} columns={["value"]} interpolation="curveBasis"/>
    //       </Charts>
    //     </ChartRow>
    //     <ChartRow height="100">
    //       <YAxis id="adc-axis" label="Current / nA" min={tipCurrentSeries.min()} max={tipCurrentSeries.max()} width="60" type="linear" format=",.2f"/>
    //       <Charts>
    //         <LineChart axis="adc-axis" series={tipCurrentSeries} columns={["value"]}/>
    //       </Charts>
    //       <YAxis labelOffset={10} id="z-axis" label="Piezo-Z" min={0} max={1} width="60" type="linear" format=",.2f"/>
    //     </ChartRow>
    //   </ChartContainer>
    // </Resizable>
  );
}

LivePlot.propTypes = {
  tipCurrentLog: PropTypes.array,
  temperatureLog: PropTypes.array,
};

export default LivePlot;
