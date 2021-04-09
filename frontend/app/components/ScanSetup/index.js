
import React, { useState } from 'react';
import PropTypes from "prop-types";
import styled from 'styled-components';
import { Input, Button, Table, Image, Form, Label, Icon } from 'semantic-ui-react'


function ScanSetup(props) {

  function handlePatternSelect(key) {
    setSelectedPattern(key)
    setCurrentParameters(Object.fromEntries(Object.entries(props.patternOptions[key].parameters).map(([k, param]) => [k, param.default])));
  }

  function handleUsePattern() {
    props.setScanPattern(props.scanPattern, props.patternParameters, props.position, props.size, props.rotation);
  }

  function handleScanEnable() {
    props.setScanEnable(props.scanPattern, props.patternParameters, props.position, props.size, props.rotation);
  }

  const dropdownOptions = Object.entries(props.patternOptions).map(([key, pattern]) => ({
    key: key, text: pattern.name, value: key
  }));

  return (
    <Form>
      <Form.Select
        options={dropdownOptions}
        placeholder="Select Pattern"
        fluid
        value={props.scanPattern}
        disabled={props.scanEnabled}
        onChange={(e, {value}) => props.setScanPattern(value)}/>

      {props.scanPattern != undefined &&
        Object.entries(props.patternOptions[props.scanPattern].parameters).map(([key, parameter]) => {
          if (parameter.type == "integer") {
            return (
              <Form.Input
                key={key}
                label={parameter.name}
                type="number"
                value={props.patternParameters[key]}
                step={1}
                min={parameter.min}
                max={parameter.max}
                disabled={props.scanEnabled}
                onChange={(e, {value}) => props.setPatternParameters({...props.patternParameters, [key]: parseInt(value)})}/>
            )
          }
        })

      }
      <Form.Group widths="equal">
        <Form.Field disabled={props.scanEnabled}>
          <label>Center X</label>
          <input type="number" value={props.position.x} onChange={(e) => props.setBoundingBoxPosition({...props.position, x: parseFloat(e.target.value)})}/>
        </Form.Field>
        <Form.Field disabled={props.scanEnabled}>
          <label>Center Y</label>
          <input type="number" value={props.position.y} onChange={(e) => props.setBoundingBoxPosition({...props.position, y: parseFloat(e.target.value)})}/>
        </Form.Field>
      </Form.Group>
      <Form.Group widths="equal">
        <Form.Field disabled={props.scanEnabled}>
          <label>Size X</label>
          <input type="number" value={props.size.x} onChange={(e) => props.setBoundingBoxSize({...props.size, x: parseFloat(e.target.value)})}/>
        </Form.Field>
        <Form.Field disabled={props.scanEnabled}>
          <label>Size Y</label>
          <input type="number" value={props.size.y} onChange={(e) => props.setBoundingBoxSize({...props.size, y: parseFloat(e.target.value)})}/>
        </Form.Field>
      </Form.Group>
      <Form.Field disabled={props.scanEnabled}>
        <label>Rotate</label>
        <input type="number" value={props.rotation} onChange={(e) => props.setBoundingBoxRotation(parseFloat(e.target.value))}/>
      </Form.Field>

      {props.isPatternUploaded?
        <Form.Button color={props.scanEnabled? "yellow":"olive"} disabled={props.scanPattern == undefined} onClick={() => props.setScanEnable(!props.scanEnabled)} fluid toggle icon>
          {props.scanEnabled? "Stop Scan":"Start Scan"}
        </Form.Button>:
        <Form.Button disabled={props.scanPattern == undefined} fluid onClick={() => props.uploadScanPattern(props.scanPattern, props.patternParameters, props.position, props.size, props.rotation)}>
          Upload Pattern
        </Form.Button>
      }
    </Form>
  );
}

ScanSetup.propTypes = {
  size: PropTypes.object,
  position: PropTypes.object,
  rotation: PropTypes.number,
  patternOptions: PropTypes.object,
  patternParameters: PropTypes.object,
  setScanPattern: PropTypes.func,
  setPatternParameters: PropTypes.func,
  setScanEnable: PropTypes.func,
  setBoundingBoxSize: PropTypes.func,
  setBoundingBoxPosition: PropTypes.func,
  setBoundingBoxRotation: PropTypes.func,
  scanPattern: PropTypes.string,
  uploadScanPattern: PropTypes.func,
  isPatternUploaded: PropTypes.bool,
  scanEnabled: PropTypes.bool,
};

export default ScanSetup;
