import React from "react";
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Form, Button } from 'semantic-ui-react'

function PidSettings(props) {

  return (
    <Form>
      <Form.Group>
        <Form.Field>
          <label>Enable</label>
          <Button toggle active={props.enabled} onClick={(e) => props.onEnableToggle()}>Off</Button >
        </Form.Field>
        <Form.Field>
          <label>Setpoint / nA</label>
          <input type='number' value={props.setpoint*1e9} onChange={(e) => props.onSetpointChange(parseFloat(e.target.value/1e9))}/>
        </Form.Field>
        <Form.Field>
          <label>Averages</label>
          <input type='number'/>
        </Form.Field>
      </Form.Group>

      <Form.Group widths='equal'>
        <Form.Field>
          <label>P</label>
          <input type="number" value={props.P} onChange={(e) => props.onPChange(parseFloat(e.target.value))} />
        </Form.Field>

        <Form.Field>
          <label>I</label>
          <input type="number" value={props.I} onChange={(e) => props.onIChange(parseFloat(e.target.value))} />
        </Form.Field>

        <Form.Field>
          <label>D</label>
          <input type="number" value={props.D} onChange={(e) => props.onDChange(parseFloat(e.target.value))} />
        </Form.Field>
      </Form.Group>
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
