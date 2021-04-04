
import React from 'react';
import PropTypes from "prop-types";
import styled from 'styled-components';
import { List, Transition, Header, Icon } from 'semantic-ui-react'


function Logs(props) {
  const iconMap = {
    error: "times circle",
    warning: "exclamation circle",
    info: "info circle",
    debug: "check circle outline"
  }
  const colorMap = {
    error: "red",
    warning: "orange",
    info: "blue",
    debug: "grey"
  }

  return (
    <Transition.Group
      as={List}
      duration={200}
      divided
      animation="fly up"
      verticalAlign='middle'
    >;

      {props.logs.length == 0 &&
        <Header icon>
          <Icon name='sticky note outline' />
          No logs available
        </Header>
      }
      {props.logs.map((log) => (
        <List.Item key={log.time}>
          <List.Icon name={iconMap[log.severity]} color={colorMap[log.severity]} size='large' verticalAlign='middle' />
          <List.Content>
            <List.Header>{log.msg}</List.Header>
            <List.Description as='a'>{new Date(log.time*1000).toLocaleTimeString("de-De")}</List.Description>
          </List.Content>
        </List.Item>
      ))}
    </Transition.Group>
  );
}

Logs.propTypes = {
  logs: PropTypes.array
};

export default Logs;
