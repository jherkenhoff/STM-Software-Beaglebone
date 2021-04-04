/*
 * Dashboard
 *
 * This is the first thing users see of our App, at the '/' route
 *
 */

import React from 'react';
import { compose } from 'redux'
import { connect } from 'react-redux'

import GridLayout, { WidthProvider } from 'react-grid-layout';

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
import styled from 'styled-components';

import { Grid, Divider, Icon, Header, Segment } from 'semantic-ui-react'

const ResizeableGridLayout = WidthProvider(GridLayout);

function Dashboard(props) {
  const layout = [
    {i: 'env-plot', x: 0, y: 0, w: 9, h: 2, minW: 6, minH: 2},
    {i: 'tip-plot', x: 0, y: 0, w: 9, h: 2, minW: 6, minH: 2},
    {i: 'log', x: 9, y: 0, w: 3, h: 2, minW: 2},
    {i: 'pid-settings', x: 9, y: 2, w: 3, h: 2},
    {i: 'data-view', x: 9, y: 4, w: 3, h: 2},
    {i: 'manual-position', x: 0, y: 4, w: 2, h: 2},
    {i: 'tunneling-gauge', x: 2, y: 4, w: 1, h: 1, isResizable: false},
    {i: 'z-gauge', x: 3, y: 4, w: 1, h: 1, isResizable: false},
    {i: 'coarse-approach', x: 4, y: 4, w: 2, h: 2, minW: 2},
  ];

  return (
    <ResizeableGridLayout layout={layout} cols={12} rowHeight={110} draggableHandle=".drag-handle">
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
      <div key="data-view">
        <DataViewContainer />
      </div>
      <div key="manual-position">
        <ManualPositionContainer />
      </div>
      <div key="tunneling-gauge">
        <CircularGauge label="Tip Current" value={props.tipCurrent*1e9} min={-3} max={-4} unit=" nA" decimals={3}/>
      </div>
      <div key="z-gauge">
        <CircularGauge label="Z Pos." value={props.z} min={-100} max={100} unit="" decimals={0}/>
      </div>
      <div key="coarse-approach">
        <CoarseApproachContainer />
      </div>
    </ResizeableGridLayout>
  );
}

function mapStateToProps(state) {
  return {
    tipCurrent: state.tipMonitor.current,
    z: state.tipMonitor.z
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
