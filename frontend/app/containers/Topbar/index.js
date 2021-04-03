
import React from 'react';
import { compose } from 'redux'
import { connect } from 'react-redux'
import PropTypes from "prop-types";

import TopbarComponent from 'components/Topbar';

function Topbar(props) {
  return (
    <TopbarComponent tunneling={props.tunneling} pid={props.pid} scan={props.scan} tipCurrent={props.tipCurrent}/>
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

function mapDispatchToProps(dispatch) {
  return {
    dispatch
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

export default compose(withConnect)(Topbar);
