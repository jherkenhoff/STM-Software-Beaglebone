
import React from 'react';
import { compose } from 'redux'
import { connect } from 'react-redux'

import PropTypes from "prop-types";

import DashboardCard from 'components/DashboardCard';
import TipPlot from 'components/TipPlot';

function TipPlotContainer(props) {
  return (
    <DashboardCard title="Tip Monitor">
      <TipPlot log={props.log} pidSetpoint={props.pidSetpoint}/>
    </DashboardCard>
  );
}

function mapStateToProps(state) {
  return {
    log: state.tipMonitor.log,
    pidSetpoint: state.pid.setpoint,
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

export default compose(withConnect)(TipPlotContainer);
