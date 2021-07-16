
import React, { useState } from 'react';
import PropTypes from "prop-types";
import styled from 'styled-components';
import { Button, Icon, Form, Input, Label, Popup } from 'semantic-ui-react'


function ValueInput(props) {

  const [typedValue, setTypedValue] = useState(NaN);
  const [lastSentValue, setLastSentValue] = useState(NaN);

  function sendValue() {
    props.onChange(typedValue)
    setLastSentValue(typedValue)
  }

  function onClick() {
    if (isNaN(typedValue)) {
      setTypedValue(props.value.toFixed(props.precision))
      setLastSentValue(props.value.toFixed(props.precision))
    } else {
      sendValue()
    }
  }

  function onKeyDown(e) {
    if (e.keyCode == 13) { // Enter
      sendValue()
      e.preventDefault()
      e.stopPropagation()
    }
  }

  const valueButton = <Button compact color={(typedValue==lastSentValue || isNaN(typedValue))? undefined:"yellow"}>
    {props.value.toFixed(props.precision)} {props.unit}
  </Button>

  return (
     <Form.Input fluid action type="number" onChange={(e) => setTypedValue(parseFloat(e.target.value))} labelPosition="right">
       {props.label? <Label>{props.label}</Label>:undefined}
       <input disabled={props.disabled} step={0.1} value={typedValue} type="number" onKeyDown={onKeyDown}/>
       <Button compact icon onClick={onClick}>
         <Icon name={isNaN(typedValue)?"caret left":"caret right"}/>
       </Button>
       <Popup content={props.value + " " + (props.unit? props.unit:"") } on="click" trigger={valueButton} />

     </Form.Input>

  );
}

ValueInput.propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.number,
  unit: PropTypes.string,
  precision: PropTypes.number,
  label: PropTypes.string,
  disabled: PropTypes.bool
};

export default ValueInput;
