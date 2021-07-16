
import React from 'react';
import PropTypes from "prop-types";
import styled from 'styled-components';
import { Button, Icon, Form, Input, Label } from 'semantic-ui-react'
import ValueInput from 'components/ValueInput'

function BiasVoltage(props) {

  return (
      <ValueInput onChange={(v) => props.onChange(v/1e3)} value={props.voltage*1e3} unit="mV" precision={3}/>
  );
}

BiasVoltage.propTypes = {
  onChange: PropTypes.func,
  voltage: PropTypes.number
};

export default BiasVoltage;
