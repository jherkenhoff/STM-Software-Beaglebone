
import React from 'react';
import { compose } from 'redux'
import { connect } from 'react-redux'
import PropTypes from "prop-types";

import CircularGauge from 'components/CircularGauge';

function ZGaugeContainer(props) {
  return (
    <CircularGauge label="Z Pos." value={props.z} min={-10} max={10} decimals={3}/>
  );
}

function mapStateToProps(state) {
  return {
    z: state.tipMonitor.z,
  }
}

const withConnect = connect(
  mapStateToProps
);

export default compose(withConnect)(ZGaugeContainer);
