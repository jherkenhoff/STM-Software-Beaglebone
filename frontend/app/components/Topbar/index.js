
import React from 'react';
import PropTypes from "prop-types";

import { Menu, Icon, Label, Popup } from 'semantic-ui-react'
import GeneralSettingsContainer from 'containers/GeneralSettingsContainer'

function Topbar(props) {
  return (
    <Menu attached color={props.connected? undefined:"red"} inverted={!props.connected}>
      <Menu.Item header>
        STM Control
      </Menu.Item>

      <Menu.Menu position='right'>

        <Popup
          trigger={
            <Menu.Item>
              <Icon name='settings' />
            </Menu.Item>
          }
          on='click'
          position='bottom right'
          flowing
        >
          <Popup.Header>Connection Settings</Popup.Header>
          <Popup.Content>
            <GeneralSettingsContainer />
          </Popup.Content>
        </Popup>
      </Menu.Menu>
    </Menu>
  );
}

Topbar.propTypes = {
  connected: PropTypes.bool
};

export default Topbar;
