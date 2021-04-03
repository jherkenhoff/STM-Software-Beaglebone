/**
 *
 * PidForm
 *
 */

import React from "react";
// import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Form, Icon, Label, Input } from 'semantic-ui-react'

const SliderWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
`

function ScanWindow() {
  return (
    <div>
      <Form>
        <Form.Field inline>
          <label>PID Setpoint</label>
          <input placeholder='First Name' />
        </Form.Field>
          <Input label='P' placeholder='mysite.com' />
          <Form.Input fluid label='P' />
          <input />
      </Form>
    </div>
  );
}

ScanWindow.propTypes = {};

export default ScanWindow;
