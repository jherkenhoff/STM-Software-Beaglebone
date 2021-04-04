
import React from 'react';
import PropTypes from "prop-types";
import styled from 'styled-components';
import { List, Transition, Header, Table, Image, Form } from 'semantic-ui-react'


function ManualPosition(props) {

  return (
    <Form>
      <Form.Group widths='equal'>
        <Form.Field>
          <label>X</label>
          <input type="number" value={props.x} onChange={(e) => props.setX(parseFloat(e.target.value))} />
        </Form.Field>

        <Form.Field>
          <label>Y</label>
          <input type="number" value={props.y} onChange={(e) => props.setY(parseFloat(e.target.value))} />
        </Form.Field>

        <Form.Field>
          <label>Z</label>
          <input type="number" disabled={props.pidEnabled} value={props.z} onChange={(e) => props.setZ(parseFloat(e.target.value))} />
        </Form.Field>
      </Form.Group>
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
  pidEnabled: PropTypes.bool
};

export default ManualPosition;
