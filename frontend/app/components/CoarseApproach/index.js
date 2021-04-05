
import React from 'react';
import PropTypes from "prop-types";
import styled from 'styled-components';
import { Button, Icon, Form } from 'semantic-ui-react'

const options = [
  { key: 's', text: 'Small', value: 100, description: "100"},
  { key: 'm', text: 'Medium', value: 100, description: "1000"},
  { key: 'l', text: 'Large', value: 100, description: "10000"},
]

function CoarseApproach(props) {

  return (
    <div>

      <Form>
        <Form.Select
          fluid
          label='Step Size'
          options={options}
          placeholder='Step Size'
        />
        <Button.Group fluid>
          <Button labelPosition='left' icon='up arrow' content='Up' onClick={(e) => props.moveStepper(10000)}/>
          <Button labelPosition='right' icon='down arrow' content='Down' onClick={(e) => props.moveStepper(-10000)} />
        </Button.Group>
      </Form>
    </div>
  );
}

CoarseApproach.propTypes = {
  moveStepper: PropTypes.func
};

export default CoarseApproach;
