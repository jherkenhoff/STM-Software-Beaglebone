
import React from 'react';
import { compose } from 'redux'
import { connect } from 'react-redux'
import PropTypes from "prop-types";

import DashboardCard from 'components/DashboardCard';
import CoarseApproach from 'components/CoarseApproach';

function CoarseApproachContainer(props) {
  return (
    <DashboardCard title="Coarse Approach">
      <CoarseApproach />
    </DashboardCard>
  );
}

function mapStateToProps(state) {
  return {
    logs: state.monitor.logMessages,
  }
}

const withConnect = connect(
  mapStateToProps
);

export default compose(withConnect)(CoarseApproachContainer);
