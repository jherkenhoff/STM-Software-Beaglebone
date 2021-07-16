
import React from 'react';
import { compose } from 'redux'
import { connect } from 'react-redux'

import PropTypes from "prop-types";

import DashboardCard from 'components/DashboardCard';
import OciPlot from 'components/OsciPlot';

function OsciPlotContainer(props) {
  return (
    <DashboardCard title="Osci">
      <OciPlot scanPoints={props.scanPoints}/>
    </DashboardCard>
  );
}

function mapStateToProps(state) {
  return {
    scanPoints: state.scan.scanResult.points,
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

export default compose(withConnect)(OsciPlotContainer);
