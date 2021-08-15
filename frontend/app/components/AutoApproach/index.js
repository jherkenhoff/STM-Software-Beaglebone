import React from "react";
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Form, Button, Icon, Label } from 'semantic-ui-react'
import ValueInput from 'components/ValueInput'

function AutoApproach(props) {

  return (
    <Form>
      <Form.Group>
        <Form.Field>
          <label>Enable</label>
          <Button toggle active={props.enable} onClick={(e) => props.onEnableChange(!props.enable)}>Off</Button >
        </Form.Field>
        <Form.Field>
          <label>PID Steps</label>
          <Label>
            Iterations
            <Label.Detail>{props.iteration}</Label.Detail>
          </Label>
        </Form.Field>
      </Form.Group>

      <Form.Field inline>
        <label>Stepper increment</label>
        <ValueInput onChange={(v) => props.onStepperIncChange(v/1e9)} value={props.stepperInc*1e9} unit="nm" precision={1}/>
      </Form.Field>

      <Form.Field inline>
        <label>Z Increment</label>
        <ValueInput onChange={(v) => props.onZIncChange(v/1e3)} value={props.zInc*1e3} unit="mV" precision={1}/>
      </Form.Field>

      <Form.Field inline>
        <label>Z High</label>
        <ValueInput onChange={(v) => props.onZHighChange(v)} value={props.zHigh} unit="V" precision={1}/>
      </Form.Field>

      <Form.Field inline>
        <label>Z Low</label>
        <ValueInput onChange={(v) => props.onZLowChange(v)} value={props.zLow} unit="V" precision={1}/>
      </Form.Field>

      <Form.Field inline>
        <label>Z Goal</label>
        <ValueInput onChange={(v) => props.onZGoalChange(v)} value={props.zGoal} unit="V" precision={1}/>
      </Form.Field>

      <Form.Field inline>
        <label>Tunneling Current Goal</label>
        <ValueInput onChange={(v) => props.onCurrentGoalChange(v/1e9)} value={props.currentGoal*1e9} unit="nA" precision={1}/>
      </Form.Field>
    </Form>
  );
}

AutoApproach.propTypes = {
  enable: PropTypes.bool,
  stepperInc: PropTypes.number,
  zInc: PropTypes.number,
  zLow: PropTypes.number,
  zHigh: PropTypes.number,
  zGoal: PropTypes.number,
  currentGoal: PropTypes.number,
  iteration: PropTypes.number,

  onEnableChange: PropTypes.func,
  onStepperIncChange: PropTypes.func,
  onZIncChange: PropTypes.func,
  onZLowChange: PropTypes.func,
  onZHighChange: PropTypes.func,
  onZGoalChange: PropTypes.func,
  onCurrentGoalChange: PropTypes.func
};

export default AutoApproach;
