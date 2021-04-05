
import React from 'react';
import PropTypes from "prop-types";
import styled from 'styled-components';

import Chart from "react-apexcharts";


function CircularGauge(props) {


  const options = {
    chart: {
      type: 'radialBar',
      offsetY: -22,
      animations: {
        enabled: false,
        dynamicAnimation: {
            enabled: false,
            speed: 0
        }
      }
    },
    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle: 135,
        dataLabels: {
          value: {
            offsetY: 0,
            formatter: (val) => ( (val/100 * (props.max-props.min)+props.min).toFixed(props.decimals) + props.unit )
          }
        }
      }
    },
    fill: {
      type: 'gradient',
        gradient: {
          shade: 'dark',
          type: 'horizontal',
          shadeIntensity: 0.5,
          gradientToColors: ['#ABE5A1'],
          inverseColors: true,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 100]
        }
    },
    stroke: {
      dashArray: 4
    },
    labels: [props.label],
  }

  return (
    <Chart
      className="drag-handle"
      options={options}
      series={[(props.value-props.min)/(props.max-props.min) * 100]}
      type="radialBar"
      width="100%"
      height="200px"
    />
  );
}

CircularGauge.propTypes = {
  label: PropTypes.string,
  value: PropTypes.number,
  max: PropTypes.number,
  min: PropTypes.number,
  unit: PropTypes.string,
  decimals: PropTypes.number,
};

export default CircularGauge;
