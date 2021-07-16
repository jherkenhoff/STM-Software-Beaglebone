import React from "react";
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Form, Button, Icon, Label } from 'semantic-ui-react'
import ValueInput from 'components/ValueInput'

function PidSettings(props) {

  return (
    <Form>
      <Form.Group>
        <Form.Field>
          <label>Enable</label>
          <Button toggle active={props.enabled} onClick={(e) => props.onEnableToggle()}>Off</Button >
        </Form.Field>
        <Form.Field>
          <label>PID Steps</label>
          <input type='number'/>
        </Form.Field>
      </Form.Group>

      <Form.Field inline>
        <label>Setpoint</label>
        <ValueInput onChange={(v) => props.onSetpointChange(v/1e9)} value={props.setpoint*1e9} unit="nA" precision={1}/>
      </Form.Field>

      <Form.Field inline>
        <label>P (mV/nA)</label>
        <ValueInput onChange={(v) => props.onPChange(v/1e3*1e9)} value={props.P*1e3/1e9} precision={1}/>
      </Form.Field>


      <Form.Field inline>
        <label>I (mV/nA/ms)</label>
        <ValueInput onChange={(v) => props.onIChange(v/1e3*1e9*1e3)} value={props.I*1e3/1e9/1e3} precision={1}/>
      </Form.Field>
    </Form>
  );
}

PidSettings.propTypes = {
  onEnableToggle: PropTypes.func,
  enabled: PropTypes.bool,
  onPChange: PropTypes.func,
  onIChange: PropTypes.func,
  onDChange: PropTypes.func,
  P: PropTypes.number,
  I: PropTypes.number,
  D: PropTypes.number,
  onSetpointChange: PropTypes.func,
  setpoint: PropTypes.number,
};

export default PidSettings;
