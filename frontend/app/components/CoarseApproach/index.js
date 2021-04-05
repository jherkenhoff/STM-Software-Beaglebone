
import React, { useState } from 'react';
import PropTypes from "prop-types";
import styled from 'styled-components';
import { Button, Icon, Form } from 'semantic-ui-react'

const options = [
  { key: '1n', text: '1 nm', value: 1e-9},
  { key: '10n', text: '10 nm', value: 10e-9},
  { key: '100n', text: '100 nm', value: 100e-9},
  { key: '1u', text: '1 um', value: 1e-6},
  { key: '10u', text: '10 um', value: 10e-6},
  { key: '100u', text: '100 um', value: 100e-6},
]

function CoarseApproach(props) {

  const [tipIncrement, setTipIncrement] = useState(1e-6);

  return (
    <div>

      <Form>
        <Form.Select
          fluid
          label='Tip increment distance'
          options={options}
          defaultValue={1e-6}
          placeholder='Step Size'
          onChange={(e, { value }) => setTipIncrement(value)}
        />
        <Button.Group fluid>
          <Button labelPosition='left' icon='up arrow' content='Up' onClick={(e) => props.moveStepper(tipIncrement)}/>
          <Button labelPosition='right' icon='down arrow' content='Down' onClick={(e) => props.moveStepper(-tipIncrement)} />
        </Button.Group>
      </Form>
    </div>
  );
}

CoarseApproach.propTypes = {
  moveStepper: PropTypes.func
};

export default CoarseApproach;
