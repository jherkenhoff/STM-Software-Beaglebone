
import React from 'react';
import PropTypes from "prop-types";
import styled from 'styled-components';
import { Index, TimeSeries } from "pondjs";

import {
  Resizable,
  Charts,
  ChartContainer,
  ChartRow,
  YAxis,
  LineChart,
  AreaChart
} from "react-timeseries-charts";

const Wrapper = styled.div`
`;


//Index example
let index = new Index("1d-12345");
console.log(index.asTimerange().humanize());

//Timeseries example
const data = {
    "name": "traffic",
    "columns": ["time", "value", "status"],
    "points": [
        [1400425947000, 20, "ok"],
        [1400425948000, 22, "ok"],
        [1400425949000, 21, "fail"],
        [1400425950000, 21.5, "offline"],
    ]
};

const series = new TimeSeries(data);

function LivePlot(props) {
  return (
    <ChartContainer showGrid timeRange={series.timerange()} width={600}>
      <ChartRow height="60">
        <YAxis id="temp-axis" label="Temp. / °C" min={series.min()} max={series.max()} width="60" type="linear" format=",.2f"/>
        <Charts>
          <LineChart axis="temp-axis" series={series} column={["value"]}/>
        </Charts>
      </ChartRow>
      <ChartRow height="100">
        <YAxis id="adc-axis" label="Current" min={series.min()} max={series.max()} width="60" type="linear" format=",.2f"/>
        <Charts>
          <LineChart axis="adc-axis" series={series} column={["value"]}/>
          <LineChart axis="z-axis" series={series} column={["value"]}/>
        </Charts>
        <YAxis labelOffset={10} id="z-axis" label="Piezo-Z" min={series.min()} max={series.max()} width="60" type="linear" format=",.2f"/>
      </ChartRow>
    </ChartContainer>
  );
}

LivePlot.propTypes = {
};

export default LivePlot;
