
import React from 'react';
import PropTypes from "prop-types";
import styled from 'styled-components';
import { Input, Header, Table, Image, Form, Label, Icon } from 'semantic-ui-react'
import ValueInput from 'components/ValueInput'


function ManualPosition(props) {

  return (
    <Form>
      <ValueInput onChange={(v) => props.setX(v)} label="X" value={props.x} unit="V" precision={1} disabled={props.scanEnabled}/>
      <ValueInput onChange={(v) => props.setY(v)} label="Y" value={props.y} unit="V" precision={1} disabled={props.scanEnabled}/>
      <ValueInput onChange={(v) => props.setZ(v)} label="Z" value={props.z} unit="V" precision={1} disabled={props.pidEnabled}/>
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
