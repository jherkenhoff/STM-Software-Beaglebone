
import React from 'react';
import { compose } from 'redux'
import { connect } from 'react-redux'
import PropTypes from "prop-types";

import { setScanPattern, setScanBoundingBoxSize, setScanBoundingBoxPosition, setScanBoundingBoxRotation, setScanPatternParameters, uploadScanPattern, setScanEnabled } from "actions";

import DashboardCard from 'components/DashboardCard';
import ScanSetup from 'components/ScanSetup';

function ScanSetupContainer(props) {
  return (
    <DashboardCard title="Scan Setup">
      <ScanSetup
        patternOptions={props.patternOptions}
        size={props.size}
        position={props.position}
        rotation={props.rotation}
        setScanPattern={props.setScanPattern}
        setBoundingBoxSize={props.setScanBoundingBoxSize}
        setBoundingBoxPosition={props.setScanBoundingBoxPosition}
        setBoundingBoxRotation={props.setScanBoundingBoxRotation}
        scanPattern={props.scanPattern}
        setPatternParameters={props.setScanPatternParameters}
        patternParameters={props.patternParameters}
        uploadScanPattern={props.uploadScanPattern}
        isPatternUploaded={props.isPatternUploaded}
        scanEnabled={props.scanEnabled}
        setScanEnable={props.setScanEnable}
      />

    </DashboardCard>
  );
}

function mapStateToProps(state) {
  return {
    size: state.scan.boundingBox.size,
    position: state.scan.boundingBox.position,
    rotation: state.scan.boundingBox.rotation,
    patternOptions: state.scan.patternOptions,
    scanPattern: state.scan.selectedPattern,
    patternParameters: state.scan.selectedPatternParameters,
    isPatternUploaded: state.scan.isPatternUploaded,
    scanEnabled: state.scan.enabled,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    setScanPattern: (pattern) => dispatch(setScanPattern(pattern)),
    setScanBoundingBoxSize: (size) => dispatch(setScanBoundingBoxSize(size)),
    setScanBoundingBoxPosition: (position) => dispatch(setScanBoundingBoxPosition(position)),
    setScanBoundingBoxRotation: (rotation) => dispatch(setScanBoundingBoxRotation(rotation)),
    setScanPatternParameters: (parameters) => dispatch(setScanPatternParameters(parameters)),
    uploadScanPattern: (key, parameters, position, size, rotation) => dispatch(uploadScanPattern(key, parameters, position, size, rotation)),
    setScanEnable: (enabled) => dispatch(setScanEnabled(enabled))
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

export default compose(withConnect)(ScanSetupContainer);
