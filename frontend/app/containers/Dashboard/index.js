/*
 * Dashboard
 *
 * This is the first thing users see of our App, at the '/' route
 *
 */

import React from 'react';
import { compose } from 'redux'
import { connect } from 'react-redux'

import GridLayout, { Responsive as ResponsiveGridLayout, WidthProvider } from 'react-grid-layout';

import ScanWindow from 'components/ScanWindow';
import CircularGauge from 'components/CircularGauge';
import PlotWindow from 'components/PlotWindow';
import DashboardCard from 'components/DashboardCard';
import LogContainer from 'containers/LogContainer';
import EnvironmentPlotContainer from 'containers/EnvironmentPlotContainer';
import TipPlotContainer from 'containers/TipPlotContainer';
import PidSettingsContainer from 'containers/PidSettingsContainer';
import DataViewContainer from 'containers/DataViewContainer';
import ManualPositionContainer from 'containers/ManualPositionContainer';
import CoarseApproachContainer from 'containers/CoarseApproachContainer';
import BiasVoltageContainer from 'containers/BiasVoltageContainer';
import styled from 'styled-components';

import { Grid, Divider, Icon, Header, Segment } from 'semantic-ui-react'

const ResizeableGridLayout = WidthProvider(ResponsiveGridLayout);

function Dashboard(props) {
  const layouts = {
    lg: [
      {i: "tip-plot", x: 0, y:0, w: 7, h:3},
      {i: "log", x: 7, y:0, w: 3, h:3},
      {i: "env-plot", x: 0, y:2, w: 3, h:3},
      {i: "current-gauge", x: 3, y:2, w: 1, h: 1, isResizable: false},
      {i: "z-gauge", x: 4, y:2, w: 1, h: 1, isResizable: false},
      {i: "mainboard-temperature-gauge", x: 3, y: 3, w: 1, h: 1, isResizable: false},
      {i: "supply-temperature-gauge", x: 4, y: 3, w: 1, h: 1, isResizable: false},
      {i: "coarse-approach", x: 5, y:2, w: 2, h:2},
      {i: "pid-settings", x: 7, y:2, w: 3, h:2},
      {i: "manual-position", x: 3, y:4, w: 2, h:2, minW:2, minH:2},
      {i: "bias-voltage", x: 5, y:4, w: 2, h:1, minW: 2, maxH: 1},
    ],
    md: [
      {i: "tip-plot", x: 0, y:0, w: 7, h:3},
      {i: "log", x: 7, y:0, w: 3, h:3},
      {i: "env-plot", x: 0, y:2, w: 3, h:3},
      {i: "current-gauge", x: 3, y:2, w: 1, h: 1, isResizable: false},
      {i: "z-gauge", x: 4, y:2, w: 1, h: 1, isResizable: false},
      {i: "mainboard-temperature-gauge", x: 3, y: 3, w: 1, h: 1, isResizable: false},
      {i: "supply-temperature-gauge", x: 4, y: 3, w: 1, h: 1, isResizable: false},
      {i: "coarse-approach", x: 5, y:2, w: 2, h:2},
      {i: "pid-settings", x: 7, y:2, w: 3, h:2},
      {i: "manual-position", x: 3, y:4, w: 3, h: 2, minW:3, minH:2},
      {i: "bias-voltage", x: 5, y:4, w: 2, h:1, minW: 2, maxH: 1},
    ]
  };

  return (
    <ResizeableGridLayout
      layouts={layouts}
      rowHeight={110}
      draggableHandle=".drag-handle"
      breakpoints={{lg: 1400, md: 996, sm: 768, xs: 480, xxs: 0}}
      cols={{lg: 12, md: 10, sm: 6, xs: 4, xxs: 2}}
      onLayoutChange={(layout, layouts) => console.log({layout, layouts})}
    >
      <div key="env-plot">
        <EnvironmentPlotContainer />
      </div>
      <div key="log">
        <LogContainer />
      </div>
      <div key="tip-plot">
        <TipPlotContainer />
      </div>
      <div key="pid-settings">
        <PidSettingsContainer />
      </div>
      <div key="manual-position">
        <ManualPositionContainer />
      </div>
      <div key="current-gauge">
        <CircularGauge label="Tip Current" value={props.tipCurrent*1e9} min={-3.1} max={-3.0} unit=" nA" decimals={3}/>
      </div>
      <div key="z-gauge">
        <CircularGauge label="Z Pos." value={props.z} min={-100} max={100} decimals={0}/>
      </div>
      <div key="coarse-approach">
        <CoarseApproachContainer />
      </div>
      <div key="mainboard-temperature-gauge">
        <CircularGauge label="Mainboard" type="temperature" value={props.mainboardTemperature} min={15} max={40} unit="°C" decimals={1}/>
      </div>
      <div key="supply-temperature-gauge">
        <CircularGauge label="Supply" type="temperature" value={props.supplyTemperature} min={15} max={40} unit="°C" decimals={1}/>
      </div>
      <div key="bias-voltage">
        <BiasVoltageContainer />
      </div>
    </ResizeableGridLayout>
  );
}

function mapStateToProps(state) {
  return {
    tipCurrent: state.tipMonitor.current,
    z: state.tipMonitor.z,
    mainboardTemperature: state.monitor.mainboardTemperature,
    supplyTemperature: state.monitor.supplyTemperature
  }
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

export default compose(withConnect)(Dashboard);
