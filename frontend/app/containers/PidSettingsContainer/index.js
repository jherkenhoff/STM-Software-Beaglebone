
import React from 'react';
import { compose } from 'redux'
import { connect } from 'react-redux'
import PropTypes from "prop-types";

import DashboardCard from 'components/DashboardCard';
import PidSettings from 'components/PidSettings';
import { togglePidEnable, setPidP, setPidI, setPidD, setPidSetpoint } from "actions";

function PidSettingsContainer(props) {
  return (
    <DashboardCard title="PID Settings">
      <PidSettings
        onEnableToggle={props.onEnableToggle}
        enabled={props.enabled}
        onPChange={props.setPidP}
        onIChange={props.setPidI}
        onDChange={props.setPidD}
        P={props.P}
        I={props.I}
        D={props.D}
        onSetpointChange={props.setSetpoint}
        setpoint={props.setpoint}
      />
    </DashboardCard>
  );
}

function mapStateToProps(state) {
  return {
    enabled: state.pid.enabled,
    P: state.pid.P,
    I: state.pid.I,
    D: state.pid.D,
    setpoint: state.pid.setpoint,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    onEnableToggle: () => dispatch(togglePidEnable()),
    setPidP: (val) => dispatch(setPidP(val)),
    setPidI: (val) => dispatch(setPidI(val)),
    setPidD: (val) => dispatch(setPidD(val)),
    setSetpoint: (val) => dispatch(setPidSetpoint(val)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

export default compose(withConnect)(PidSettingsContainer);
