
import React from 'react';
import PropTypes from "prop-types";

import { Menu, Icon, Label, Progress } from 'semantic-ui-react'

function Topbar(props) {
  return (
    <Menu pointing>
      <Menu.Item header>
        STM Control
      </Menu.Item>

      <Menu.Menu position='right'>
        <Menu.Item>
          Tip Current: {props.tipCurrent.toFixed(2)}
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
        <Menu.Item>
          <Icon name='settings' />
        </Menu.Item>
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
