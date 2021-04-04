
import React from 'react';
import { compose } from 'redux'
import { connect } from 'react-redux'

import PropTypes from "prop-types";

import DashboardCard from 'components/DashboardCard';
import TipPlot from 'components/TipPlot';

function TipPlotContainer(props) {
  return (
    <DashboardCard title="Environment Monitor">
      <TipPlot tipCurrentLog={props.tipCurrentLog} />
    </DashboardCard>
  );
}

function mapStateToProps(state) {
  return {
    tipCurrentLog: state.pid.tipCurrentLog,
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
