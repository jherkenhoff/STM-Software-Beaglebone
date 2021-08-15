
import React from 'react';
import { compose } from 'redux'
import { connect } from 'react-redux'
import PropTypes from "prop-types";

import Topbar from 'components/Topbar';
import { addWidgetToWorkspace, setActiveWorkspace, addWorkspace, removeWorkspace } from "actions/workspaceActions";

function TopbarContainer(props) {
  return (
    <Topbar
      connected={props.connected}
      widgetList={props.widgetList}
      workspaces={props.workspaces}
      activeWorkspace={props.activeWorkspace}
      onWidgetAdd={props.addWidgetToWorkspace}
      onActiveWorkspaceSelect={props.setActiveWorkspace}
      onWorkspaceAdd={props.addWorkspace}
      onWorkspaceRemove={props.removeWorkspace}
    />
  );
}

function mapStateToProps(state) {

  return {
    connected: state.monitor.connection,
    widgetList: state.workspaces.widgetList,
    workspaces: state.workspaces.workspaces.map(workspace => workspace.name),
    activeWorkspace: state.workspaces.activeWorkspace
  }
}

function mapDispatchToProps(dispatch) {
  return {
    addWidgetToWorkspace: (type) => dispatch(addWidgetToWorkspace(type)),
    setActiveWorkspace: (workspace) => dispatch(setActiveWorkspace(workspace)),
    addWorkspace: (name) => dispatch(addWorkspace(name)),
    removeWorkspace: (name) => dispatch(removeWorkspace(name))
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

export default compose(withConnect)(TopbarContainer);
