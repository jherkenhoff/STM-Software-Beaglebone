
import React from 'react';
import { compose } from 'redux'
import { connect } from 'react-redux'
import PropTypes from "prop-types";

import DashboardCard from 'components/DashboardCard';
import Logs from 'components/Logs';

function LogContainer(props) {
  return (
    <DashboardCard title="Logs">
      <Logs logs={props.logs} />
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

export default compose(withConnect)(LogContainer);
