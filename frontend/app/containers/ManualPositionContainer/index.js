
import React from 'react';
import { compose } from 'redux'
import { connect } from 'react-redux'
import PropTypes from "prop-types";

import DashboardCard from 'components/DashboardCard';
import ManualPosition from 'components/ManualPosition';
import { setX, setY, setZ } from "actions";

function ManualPositionContainer(props) {
  return (
    <DashboardCard title="Manual Positioning">
      <ManualPosition x={props.x} y={props.y} z={props.z} setX={props.setX} setY={props.setY} setZ={props.setZ} pidEnabled={props.pidEnabled} scanEnabled={props.scanEnabled}/>
    </DashboardCard>
  );
}

function mapStateToProps(state) {
  return {
    x: state.tipMonitor.x,
    y: state.tipMonitor.y,
    z: state.tipMonitor.z,
    pidEnabled: state.pid.enabled,
    scanEnabled: state.scan.enabled
  }
}

function mapDispatchToProps(dispatch) {
  return {
    setX: (val) => dispatch(setX(val)),
    setY: (val) => dispatch(setY(val)),
    setZ: (val) => dispatch(setZ(val)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

export default compose(withConnect)(ManualPositionContainer);
