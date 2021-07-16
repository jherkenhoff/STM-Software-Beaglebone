
import React from 'react';
import { compose } from 'redux'
import { connect } from 'react-redux'
import PropTypes from "prop-types";

import Topbar from 'components/Topbar';

function TopbarContainer(props) {
  return (
    <Topbar
      connected={props.connected}
    />
  );
}

function mapStateToProps(state) {

  return {
    connected: state.monitor.connection
  }
}

const withConnect = connect(
  mapStateToProps
);

export default compose(withConnect)(TopbarContainer);
