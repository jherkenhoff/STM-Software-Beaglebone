
import React from 'react';
import { compose } from 'redux'
import { connect } from 'react-redux'
import PropTypes from "prop-types";

import GeneralSettings from 'components/GeneralSettings';

import { setMonitorInterval, setMonitorMemory } from "actions";

function GeneralSettingsContainer(props) {
  return (
    <GeneralSettings
      monitorInterval={props.monitorInterval}
      monitorMemory={props.monitorMemory}
      onMonitorIntervalChanged={props.setMonitorInterval}
      onMonitorMemoryChanged={props.setMonitorMemory}
    />
  );
}

function mapStateToProps(state) {
  return {
    monitorMemory: state.monitor.monitorMemory,
    monitorInterval: state.monitor.monitorInterval
  }
}

function mapDispatchToProps(dispatch) {
  return {
    setMonitorInterval: (interval) => dispatch(setMonitorInterval(interval)),
    setMonitorMemory: (memory) => dispatch(setMonitorMemory(memory))
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

export default compose(withConnect)(GeneralSettingsContainer);
