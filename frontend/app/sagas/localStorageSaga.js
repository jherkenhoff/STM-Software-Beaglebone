import { takeLatest, take, select, put, call, fork } from 'redux-saga/effects'

import {
  ADD_WIDGET_TO_WORKSPACE,
  UPDATE_WORKSPACE_LAYOUTS,
  ADD_WORKSPACE,
  REMOVE_WORKSPACE,
  loadWorkspaces
} from 'actions/workspaceActions'

function* loadWorkspaceState() {
  try {
    yield put(loadWorkspaces(JSON.parse(localStorage.workspaces)))
  } catch (e) {

  }
}

function* storeWorkspaceState() {
  const workspaces = yield select(state => state.workspaces.workspaces)
  localStorage.workspaces = JSON.stringify(workspaces)
}

export default function* loalStorageSaga() {
  yield call(loadWorkspaceState)
  yield takeLatest([UPDATE_WORKSPACE_LAYOUTS, ADD_WORKSPACE, REMOVE_WORKSPACE], storeWorkspaceState)
}
