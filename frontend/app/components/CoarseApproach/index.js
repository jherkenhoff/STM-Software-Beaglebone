
import React from 'react';
import PropTypes from "prop-types";
import styled from 'styled-components';
import { Button, Icon, Form } from 'semantic-ui-react'

function CoarseApproach(props) {

  return (
    <div>

      <Form>
        <Form.Group widths='equal'>
          <Form.Field>
            <label>Step size</label>
            <input type="number" value={props.P} onChange={(e) => props.onPChange(parseFloat(e.target.value))} />
          </Form.Field>

          <Form.Field>
            <label>Speed</label>
            <input type="number" value={props.I} onChange={(e) => props.onIChange(parseFloat(e.target.value))} />
          </Form.Field>
        </Form.Group>
        <Button.Group fluid>
          <Button labelPosition='left' icon='up arrow' content='Up' />
          <Button labelPosition='right' icon='down arrow' content='Down' />
        </Button.Group>
      </Form>
    </div>
  );
}


// Up
// Down
// Speed
// Step Size
//
// Start CoarseApproach
// Stop Approach

CoarseApproach.propTypes = {
};

export default CoarseApproach;
