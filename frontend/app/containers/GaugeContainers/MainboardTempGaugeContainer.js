
import React from 'react';
import { compose } from 'redux'
import { connect } from 'react-redux'
import PropTypes from "prop-types";

import CircularGauge from 'components/CircularGauge';

function MainboardTempGaugeContainer(props) {
  return (
    <CircularGauge label="Mainboard" type="temperature" value={props.mainboardTemperature} min={15} max={40} unit="°C" decimals={1}/>
  );
}

function mapStateToProps(state) {
  return {
    mainboardTemperature: state.monitor.mainboardTemperature,
  }
}

const withConnect = connect(
  mapStateToProps
);

export default compose(withConnect)(MainboardTempGaugeContainer);
