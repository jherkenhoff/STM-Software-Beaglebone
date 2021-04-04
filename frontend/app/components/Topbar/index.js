
import React from 'react';
import PropTypes from "prop-types";

import { Menu, Icon, Label, Popup } from 'semantic-ui-react'
import GeneralSettingsContainer from 'containers/GeneralSettingsContainer'

function Topbar(props) {
  return (
    <Menu attached>
      <Menu.Item header>
        STM Control
      </Menu.Item>

      <Menu.Menu position='right'>
        <Menu.Item>
          Tip Current: <b>{props.tipCurrent.toFixed(3)} nA</b>
        </Menu.Item>
        <Menu.Item>
          <Label color={props.tunneling? 'olive':'grey'}>
            Tunneling
          </Label>
          <Label color={props.pid? 'olive':'grey'}>
            PID
          </Label>
          <Label color={props.scanning? 'olive':'grey'}>
            Scan
          </Label>
        </Menu.Item>

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
  tunneling: PropTypes.bool,
  pid: PropTypes.bool,
  scan: PropTypes.bool,
  tipCurrent: PropTypes.number
};

export default Topbar;
