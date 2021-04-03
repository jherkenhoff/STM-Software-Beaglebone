/*
 * Dashboard
 *
 * This is the first thing users see of our App, at the '/' route
 *
 */

import React from 'react';

import Sidepanel from 'containers/Sidepanel';
import StatusPanel from 'containers/StatusPanel';
import ScanWindow from 'components/ScanWindow';
import PlotWindow from 'components/PlotWindow';
import LivePlotContainer from 'components/LivePlotContainer';
import LivePlot from 'components/LivePlot';
import styled from 'styled-components';

import { Grid, Divider, Icon, Header } from 'semantic-ui-react'

const DashboardWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  margin: 50px;
`

const DataWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`

export default function Dashboard() {
  return (
    <DashboardWrapper>
      <StatusPanel />
      <DataWrapper>
        <LivePlot />
      </DataWrapper>
      <Sidepanel />
    </DashboardWrapper>
  );
}
