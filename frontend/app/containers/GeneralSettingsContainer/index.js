
import React from 'react';
import { compose } from 'redux'
import { connect } from 'react-redux'
import PropTypes from "prop-types";

import GeneralSettings from 'components/GeneralSettings';

import { setEnvMonitorInterval, setEnvMonitorMemory, setTipMonitorInterval, setTipMonitorMemory } from "actions";

function GeneralSettingsContainer(props) {
  return (
    <GeneralSettings
      envMonitorInterval={props.envMonitorInterval}
      envMonitorMemory={props.envMonitorMemory}
      tipMonitorInterval={props.tipMonitorInterval}
      tipMonitorMemory={props.tipMonitorMemory}
      onEnvMonitorIntervalChanged={props.setEnvMonitorInterval}
      onEnvMonitorMemoryChanged={props.setEnvMonitorMemory}
      onTipMonitorIntervalChanged={props.setTipMonitorInterval}
      onTipMonitorMemoryChanged={props.setTipMonitorMemory}
    />
  );
}

function mapStateToProps(state) {
  return {
    envMonitorInterval: state.monitor.envMonitorInterval,
    envMonitorMemory: state.monitor.envMonitorMemory,
    tipMonitorInterval: state.tipMonitor.interval,
    tipMonitorMemory: state.tipMonitor.memory,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    setEnvMonitorInterval: (interval) => dispatch(setEnvMonitorInterval(interval)),
    setEnvMonitorMemory: (memory) => dispatch(setEnvMonitorMemory(memory)),
    setTipMonitorInterval: (interval) => dispatch(setTipMonitorInterval(interval)),
    setTipMonitorMemory: (memory) => dispatch(setTipMonitorMemory(memory))
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

export default compose(withConnect)(GeneralSettingsContainer);
