
import React from 'react';
import PropTypes from "prop-types";
import styled from 'styled-components';
import { Form } from 'semantic-ui-react'


function GeneralSettings(props) {
  return (
    <Form>
      <Form.Group>
        <Form.Field>
          <label>Env. Monitor Interval / s</label>
          <input type="number"  value={props.envMonitorInterval} onChange={(e) => props.onEnvMonitorIntervalChanged(parseFloat(e.target.value))}/>
        </Form.Field>
        <Form.Field>
          <label>Env. Monitor Memory</label>
          <input type="number" value={props.envMonitorMemory} onChange={(e) => props.onEnvMonitorMemoryChanged(parseInt(e.target.value))} />
        </Form.Field>
      </Form.Group>
      <Form.Group>
        <Form.Field>
          <label>Tip Monitor Interval / s</label>
          <input type="number"  value={props.tipMonitorInterval} onChange={(e) => props.onTipMonitorIntervalChanged(parseFloat(e.target.value))}/>
        </Form.Field>
        <Form.Field>
          <label>Tip Monitor Memory</label>
          <input type="number" value={props.tipMonitorMemory} onChange={(e) => props.onTipMonitorMemoryChanged(parseInt(e.target.value))} />
        </Form.Field>
      </Form.Group>
    </Form>
  );
}

GeneralSettings.propTypes = {
  envMonitorMemory: PropTypes.number,
  envMonitorInterval: PropTypes.number,
  tipMonitorMemory: PropTypes.number,
  tipMonitorInterval: PropTypes.number,
  
  onEnvMonitorIntervalChanged: PropTypes.func,
  onEnvMonitorMemoryChanged: PropTypes.func,
  onTipMonitorIntervalChanged: PropTypes.func,
  onTipMonitorMemoryChanged: PropTypes.func
};

export default GeneralSettings;
