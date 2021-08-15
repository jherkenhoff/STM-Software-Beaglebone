import React, { useState } from 'react';
import PropTypes from "prop-types";

import { Menu, Button, Icon, Label, Popup, Dropdown, Input } from 'semantic-ui-react'
import GeneralSettingsContainer from 'containers/GeneralSettingsContainer'

function Topbar(props) {
  const [newWorkspaceName, setNewWorkspaceName] = useState("");

  return (
    <Menu attached color={props.connected? undefined:"red"} inverted={!props.connected}>
      <Menu.Item header>
        STM Control
      </Menu.Item>

      {props.workspaces.map( (workspace, i) => (
        <Menu.Item key={i} active={i == props.activeWorkspace}  onClick={() => props.onActiveWorkspaceSelect(i)}>
          {workspace}
        </Menu.Item>
      ))}

      <Popup
        trigger={
          <Menu.Item icon>
            <Icon name="plus"/>
          </Menu.Item>
        }
        on='click'
        position='bottom right'
        flowing
      >
        <Popup.Header>Create new workspace</Popup.Header>
        <Popup.Content>
          <Input action={{content: 'Create', disabled: newWorkspaceName=="", onClick: () => props.onWorkspaceAdd(newWorkspaceName)}} value={newWorkspaceName} onChange={(e, data) => setNewWorkspaceName(e.target.value)} placeholder='Name' />
        </Popup.Content>
      </Popup>

      <Popup
        trigger={
          <Menu.Item icon
          disabled={props.workspaces.length == 0}>
            <Icon name="trash"/>
          </Menu.Item>
        }
        on='click'
        position='bottom right'
        flowing
        disabled={props.workspaces.length == 0}
      >
        <Popup.Header>Confirm deletion</Popup.Header>
        <Popup.Content>
          <Button color="orange" onClick={() => props.onWorkspaceRemove(props.activeWorkspace)}>Delete Workspace "{props.workspaces[props.activeWorkspace]}"</Button>
        </Popup.Content>
      </Popup>


      <Menu.Menu position='right'>
        <Dropdown item text='Add Widget' icon="grid layout">
          <Dropdown.Menu>
            {props.widgetList.map( widget => (<Dropdown.Item key={widget.widgetType} onClick={() => props.onWidgetAdd(widget.widgetType)}>{widget.name}</Dropdown.Item>) )}
          </Dropdown.Menu>
        </Dropdown>

        <Popup
          trigger={
            <Menu.Item icon>
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
  connected: PropTypes.bool,
  widgetList: PropTypes.array,
  workspaces: PropTypes.array,
  activeWorkspace: PropTypes.number,
  onActiveWorkspaceSelect: PropTypes.function,
  onWidgetAdd: PropTypes.function,
  onWorkspaceAdd: PropTypes.function,
  onWorkspaceRemove: PropTypes.function,
};

export default Topbar;
