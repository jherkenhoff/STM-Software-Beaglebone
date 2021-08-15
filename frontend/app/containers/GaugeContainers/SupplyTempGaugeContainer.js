
import React from 'react';
import { compose } from 'redux'
import { connect } from 'react-redux'
import PropTypes from "prop-types";

import CircularGauge from 'components/CircularGauge';

function SupplyTempGaugeContainer(props) {
  return (
    <CircularGauge label="Supply" type="temperature" value={props.supplyTemperature} min={15} max={40} unit="°C" decimals={1}/>
  );
}

function mapStateToProps(state) {
  return {
    supplyTemperature: state.monitor.supplyTemperature
  }
}

const withConnect = connect(
  mapStateToProps
);

export default compose(withConnect)(SupplyTempGaugeContainer);
