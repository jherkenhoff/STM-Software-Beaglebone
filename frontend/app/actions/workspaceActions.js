export const LOAD_WORKSPACES = "LOAD_WORKSPACES"
export const ADD_WIDGET_TO_WORKSPACE = "ADD_WIDGET_TO_WORKSPACE"
export const UPDATE_WORKSPACE_LAYOUTS = "UPDATE_WORKSPACE_LAYOUTS"
export const SET_ACTIVE_WORKSPACE = "SET_ACTIVE_WORKSPACE"
export const ADD_WORKSPACE = "ADD_WORKSPACE"
export const REMOVE_WORKSPACE = "REMOVE_WORKSPACE"

export function addWidgetToWorkspace(widgetType) {
  return {type: ADD_WIDGET_TO_WORKSPACE, widgetType}
}

export function updateWorkspaceLayouts(layouts) {
  return {type: UPDATE_WORKSPACE_LAYOUTS, layouts}
}

export function loadWorkspaces(workspaces) {
  return {type: LOAD_WORKSPACES, workspaces}
}

export function setActiveWorkspace(workspace) {
  return {type: SET_ACTIVE_WORKSPACE, workspace}
}

export function addWorkspace(name) {
  return {type: ADD_WORKSPACE, name}
}

export function removeWorkspace(index) {
  return {type: REMOVE_WORKSPACE, index}
}
