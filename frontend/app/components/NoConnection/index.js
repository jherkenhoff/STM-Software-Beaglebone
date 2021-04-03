/**
 *
 * Topbar
 *
 */

import React from "react";
import PropTypes from "prop-types";

import { Message, Icon } from 'semantic-ui-react'

function NoConnection(props) {
  return (
    <Message icon floating compact negative attached='top'>
      <Icon name='circle notched' loading />
      <Message.Content>
        <Message.Header>Just one second</Message.Header>
        We are fetching that content for you.
      </Message.Content>
    </Message>
  );
}

NoConnection.propTypes = {
  isOpen: PropTypes.bool,
};

export default NoConnection;
