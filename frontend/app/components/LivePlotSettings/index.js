
import React from 'react';
import PropTypes from "prop-types";
import styled from 'styled-components';
import { Form } from 'semantic-ui-react'


function LivePlotSettings(props) {
  return (
    <Form>
      <Form.Field>
        <label>Update Interval</label>
        <input type="number" />
      </Form.Field>
      <Form.Field>
        <label>Time Window</label>
        <input type="number" />
      </Form.Field>
    </Form>
  );
}

LivePlotSettings.propTypes = {
};

export default LivePlotSettings;
