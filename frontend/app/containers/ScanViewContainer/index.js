
import React from 'react';
import { compose } from 'redux'
import { connect } from 'react-redux'
import PropTypes from "prop-types";

import { setScanPattern } from "actions";

import DashboardCard from 'components/DashboardCard';
import ScanView from 'components/ScanView';

function ScanViewContainer(props) {
  return (
    <DashboardCard title="Scan View">
      <ScanView
        patternPoints={props.patternPoints}
        boundingBoxSize={props.boundingBoxSize}
        boundingBoxPosition={props.boundingBoxPosition}
        boundingBoxRotation={props.boundingBoxRotation}
        scanRange={props.scanRange}
        currentPosition={props.currentPosition}
      />
    </DashboardCard>
  );
}

function mapStateToProps(state) {
  return {
    patternPoints: state.scan.patternPoints,
    boundingBoxSize: state.scan.boundingBox.size,
    boundingBoxPosition: state.scan.boundingBox.position,
    boundingBoxRotation: state.scan.boundingBox.rotation,
    scanRange: state.scan.scanRange,
    currentPosition: {x: state.tipMonitor.x, y: state.tipMonitor.y}
  }
}

function mapDispatchToProps(dispatch) {
  return {
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

export default compose(withConnect)(ScanViewContainer);
