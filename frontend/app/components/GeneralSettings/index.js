
import React from 'react';
import PropTypes from "prop-types";
import styled from 'styled-components';
import { Form } from 'semantic-ui-react'


function GeneralSettings(props) {
  return (
    <Form>
      <Form.Group>
        <Form.Field>
          <label>Monitor Interval/ s</label>
          <input type="number"  value={props.monitorInterval} onChange={(e) => props.onMonitorIntervalChanged(parseFloat(e.target.value))}/>
        </Form.Field>
        <Form.Field>
          <label>Monitor memory</label>
          <input type="number" value={props.monitorMemory} onChange={(e) => props.onMonitorMemoryChanged(parseInt(e.target.value))} />
        </Form.Field>
      </Form.Group>
    </Form>
  );
}

GeneralSettings.propTypes = {
  monitorMemory: PropTypes.number,
  monitorInterval: PropTypes.number,
  onMonitorIntervalChanged: PropTypes.function,
  onMonitorMemoryChanged: PropTypes.function
};

export default GeneralSettings;
