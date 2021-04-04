
import React from 'react';
import { compose } from 'redux'
import { connect } from 'react-redux'
import PropTypes from "prop-types";

import DashboardCard from 'components/DashboardCard';
import DataView from 'components/DataView';

function DataViewContainer(props) {
  return (
    <DashboardCard title="Data View">
      <DataView />
    </DashboardCard>
  );
}

function mapStateToProps(state) {
  return {
  }
}

const withConnect = connect(
  mapStateToProps
);

export default compose(withConnect)(DataViewContainer);
