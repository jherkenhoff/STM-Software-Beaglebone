
import React from 'react';
import PropTypes from "prop-types";
import styled from 'styled-components';
import { Button, Icon, Form, Input, Label } from 'semantic-ui-react'

function BiasVoltage(props) {

  return (
     <Input fluid labelPosition="right" type="number" onChange={(e) => props.onChange(parseFloat(e.target.value))} >
       <input type="number"/>
       <Label>
         <Icon name="caret right" />
         {(props.voltage).toFixed(2)} V
       </Label>
     </Input>

  );
}

BiasVoltage.propTypes = {
  onChange: PropTypes.func,
  voltage: PropTypes.number
};

export default BiasVoltage;
