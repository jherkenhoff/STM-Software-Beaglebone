
import React from 'react';
import PropTypes from "prop-types";
import styled from 'styled-components';

import Chart from "react-apexcharts";


const Wrapper = styled.div`
  height: 100%;
  overflow: hidden;
`;

function CircularGauge(props) {


  const baseOptions = {
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
            formatter: (val) => ( (val/100 * (props.max-props.min)+props.min).toFixed(props.decimals) + (props.unit || "") )
          }
        }
      }
    },
    stroke: {
      lineCap: 'round'
    },
    responsive: [
      {
        breakpoint: 300,
        options: {
          plotOptions: {
            radialBar: {
              startAngle: -90,
              endAngle: 90,
            }
          }
        }
      }
    ],
    labels: [props.label],
  }

  const type = props.type || "default"

  let options = {...baseOptions}

  if (type == "default") {
    options = {
      ...baseOptions,
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
      }
    }
  } else if (type == "temperature") {
    options = {
      ...baseOptions,
      colors: ['#AEE5A1'],
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'dark',
          type: 'horizontal',
          shadeIntensity: 0.5,
          gradientToColors: ['#EEE5A1'],
          inverseColors: false,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 100]
        }
      },
    }
  }

  return (
    <Wrapper>
      <Chart
        className="drag-handle"
        options={options}
        series={[(props.value-props.min)/(props.max-props.min) * 100]}
        type="radialBar"
        width="100%"
        height="200px"
      />
    </Wrapper>
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
