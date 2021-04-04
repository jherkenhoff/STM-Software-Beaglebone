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

import Sidepanel from 'containers/Sidepanel';
import StatusPanel from 'containers/StatusPanel';
import ScanWindow from 'components/ScanWindow';
import PlotWindow from 'components/PlotWindow';
import DashboardCard from 'components/DashboardCard';
import LogContainer from 'containers/LogContainer';
import EnvironmentPlotContainer from 'containers/EnvironmentPlotContainer';
import TipPlotContainer from 'containers/TipPlotContainer';
import styled from 'styled-components';

import { Grid, Divider, Icon, Header, Segment } from 'semantic-ui-react'

const ResizeableGridLayout = WidthProvider(GridLayout);

function Dashboard(props) {
  const layout = [
    {i: 'env-plot', x: 0, y: 0, w: 9, h: 2, minW: 6, minH: 2},
    {i: 'tip-plot', x: 0, y: 0, w: 9, h: 2, minW: 6, minH: 2},
    {i: 'log', x: 9, y: 0, w: 3, h: 2, minW: 2}
  ];

  return (
    <ResizeableGridLayout layout={layout} cols={12} rowHeight={100} draggableHandle=".drag-handle">
      <div key="env-plot">
        <EnvironmentPlotContainer />
      </div>
      <div key="log">
        <LogContainer />
      </div>
      <div key="tip-plot">
        <TipPlotContainer />
      </div>
    </ResizeableGridLayout>
  );
}

function mapStateToProps(state) {
  return {
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
