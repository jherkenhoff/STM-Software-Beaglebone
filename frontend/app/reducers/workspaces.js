import produce from 'immer';
import {
  ADD_WIDGET_TO_WORKSPACE,
  LOAD_WORKSPACES,
  UPDATE_WORKSPACE_LAYOUTS,
  SET_ACTIVE_WORKSPACE,
  ADD_WORKSPACE,
  REMOVE_WORKSPACE
} from 'actions/workspaceActions'

import widgetList from 'workspaceProvider/widgetList'

const initialState = {
  activeWorkspace: 0,
  workspaces: [
    {
      name: "moin",
      widgets: [
        {
          widgetType: "auto-approach",
          key: "auto-approach-1"
        }
      ],
      layouts: {

      }
    },
    {
      name: "hi",
      widgets: [],
      layouts: {

      }
    }
  ],
  widgetList: widgetList.map(widget => ({widgetType: widget.widgetType, name: widget.name}))
}

const reducer = (state = initialState, action) =>
  produce( state, draft => {
    switch (action.type) {
      case ADD_WIDGET_TO_WORKSPACE:
        // Count how many widgets of the type to be added are already in the active workspace
        const num_widgets_of_same_type = state.workspaces[state.activeWorkspace].widgets.filter((widget) => widget.type == action.type).length
        const new_widget_key = action.widgetType + "-" + num_widgets_of_same_type.toString()
        draft.workspaces[state.activeWorkspace].widgets.push({widgetType: action.widgetType, key: new_widget_key})
        break
      case LOAD_WORKSPACES:
        draft.workspaces = action.workspaces
        break
      case UPDATE_WORKSPACE_LAYOUTS:
        draft.workspaces[state.activeWorkspace].layouts = action.layouts
        break
      case SET_ACTIVE_WORKSPACE:
        draft.activeWorkspace = action.workspace
        break
      case ADD_WORKSPACE:
        draft.workspaces.push({name: action.name, widgets: [], layouts: {}})
        draft.activeWorkspace = draft.workspaces.length-1
        break
      case REMOVE_WORKSPACE:
        draft.workspaces = draft.workspaces.filter((workspace, index) => index !=action.index)
        if (action.index == 0 && draft.workspaces.length > 0) {
          draft.activeWorkspace = 0
        } else if (state.activeWorkspace >= action.index) {
          draft.activeWorkspace -= 1
        }
        break
    }
  });

export default reducer;
