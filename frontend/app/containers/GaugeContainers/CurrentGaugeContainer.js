
import React from 'react';
import { compose } from 'redux'
import { connect } from 'react-redux'
import PropTypes from "prop-types";

import CircularGauge from 'components/CircularGauge';

function CurrentGaugeContainer(props) {
  return (
    <CircularGauge label="Tip Current" value={props.tipCurrent*1e9} min={0} max={5} unit=" nA" decimals={3}/>
  );
}

function mapStateToProps(state) {
  return {
    tipCurrent: state.tipMonitor.current,
  }
}

const withConnect = connect(
  mapStateToProps
);

export default compose(withConnect)(CurrentGaugeContainer);
