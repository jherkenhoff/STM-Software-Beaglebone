/**
 *
 * PidForm
 *
 */

import React from "react";
// import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Form, Icon, Label, Input } from 'semantic-ui-react'

function PidForm() {
  return (
    <Form>
      <Form.Field>
        <label>Setpoint</label>
        <input type='number'/>
      </Form.Field>

      <Form.Field>
        <label>Coefficients</label>
        <Input labelPosition='left'>
          <Label>P</Label>
          <input type="number" />
        </Input>
      </Form.Field>

      <Form.Field>
        <Input labelPosition='left'>
          <Label>I</Label>
          <input type="number" />
        </Input>
      </Form.Field>

      <Form.Field>
        <Input labelPosition='left'>
          <Label>D</Label>
          <input type="number" />
        </Input>
      </Form.Field>
    </Form>
  );
}

PidForm.propTypes = {};

export default PidForm;
