
import React from 'react';
import { compose } from 'redux'
import { connect } from 'react-redux'
import PropTypes from "prop-types";

import { moveStepper } from "actions";

import DashboardCard from 'components/DashboardCard';
import CoarseApproach from 'components/CoarseApproach';

function CoarseApproachContainer(props) {
  return (
    <DashboardCard title="Coarse Approach">
      <CoarseApproach moveStepper={props.moveStepper}/>
    </DashboardCard>
  );
}

function mapStateToProps(state) {
  return {
    logs: state.monitor.logMessages,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    moveStepper: (steps) => dispatch(moveStepper(steps)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

export default compose(withConnect)(CoarseApproachContainer);
