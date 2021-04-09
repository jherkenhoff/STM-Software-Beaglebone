
import React from 'react';
import PropTypes from "prop-types";
import styled from 'styled-components';
import { Input, Header, Table, Image, Form, Label, Icon } from 'semantic-ui-react'


function ManualPosition(props) {

  return (
    <Form>
      <Form.Input fluid labelPosition="right" type="number" onChange={(e) => props.setX(parseFloat(e.target.value))} >
          <Label>X</Label>
          <input disabled={props.scanEnabled} type="number"/>
          <Label>
            <Icon name="caret right" />
            {(props.x).toFixed(2)}
          </Label>
      </Form.Input>
      <Form.Input fluid labelPosition="right" type="number" onChange={(e) => props.setY(parseFloat(e.target.value))} >
          <Label>Y</Label>
          <input disabled={props.scanEnabled} type="number"/>
          <Label>
            <Icon name="caret right" />
            {(props.y).toFixed(2)}
          </Label>
      </Form.Input>

      <Form.Input fluid labelPosition="right" type="number" onChange={(e) => props.setZ(parseFloat(e.target.value))} >
          <Label>Z</Label>
          <input disabled={props.pidEnabled} type="number"/>
          <Label>
            <Icon name="caret right" />
            {(props.z).toFixed(2)}
          </Label>
      </Form.Input>

    </Form>
  );
}

ManualPosition.propTypes = {
  setX: PropTypes.func,
  setY: PropTypes.func,
  setZ: PropTypes.func,
  x: PropTypes.number,
  y: PropTypes.number,
  z: PropTypes.number,
  pidEnabled: PropTypes.bool,
  scanEnabled: PropTypes.bool,
};

export default ManualPosition;
