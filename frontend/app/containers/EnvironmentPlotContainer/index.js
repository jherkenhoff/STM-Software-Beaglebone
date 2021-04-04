
import React from 'react';
import { compose } from 'redux'
import { connect } from 'react-redux'

import PropTypes from "prop-types";
import { Label, Menu } from 'semantic-ui-react'

import DashboardCard from 'components/DashboardCard';
import EnvironmentPlot from 'components/EnvironmentPlot';

function EnvironmentPlotContainer(props) {
  return (
    <DashboardCard title="Environment Monitor">
      <EnvironmentPlot temperatureLog={props.temperatureLog} />
    </DashboardCard>
  );
}

function mapStateToProps(state) {
  return {
    temperatureLog: state.monitor.temperatureLog,
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

export default compose(withConnect)(EnvironmentPlotContainer);
