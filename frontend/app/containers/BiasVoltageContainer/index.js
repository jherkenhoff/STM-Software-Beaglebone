
import React from 'react';
import { compose } from 'redux'
import { connect } from 'react-redux'
import PropTypes from "prop-types";

import DashboardCard from 'components/DashboardCard';
import BiasVoltage from 'components/BiasVoltage';
import { setBiasVoltage } from "actions";

function BiasVoltageContainer(props) {
  return (
    <DashboardCard title="Bias Voltage">
      <BiasVoltage
        onChange={props.setBiasVoltage}
        voltage={props.voltage}
      />
    </DashboardCard>
  );
}

function mapStateToProps(state) {
  return {
    voltage: state.bias.voltage,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    setBiasVoltage: (voltage) => dispatch(setBiasVoltage(voltage)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

export default compose(withConnect)(BiasVoltageContainer);
