
import React from 'react';
import { compose } from 'redux'
import { connect } from 'react-redux'
import PropTypes from "prop-types";

import Topbar from 'components/Topbar';

function TopbarContainer(props) {
  return (
    <Topbar tunneling={props.tunneling} pid={props.pid} scan={props.scan} tipCurrent={props.tipCurrent}/>
  );
}

function mapStateToProps(state) {
  return {
    tunneling: true,
    pid: state.pid.enabled,
    scan: false,
    tipCurrent: state.pid.tipCurrent
  }
}

const withConnect = connect(
  mapStateToProps
);

export default compose(withConnect)(TopbarContainer);
