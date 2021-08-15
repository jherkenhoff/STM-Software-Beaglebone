/**
 * Combine all reducers in this file and export the combined reducers.
 */

import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

import history from 'utils/history';
import monitor from './monitor'
import pid from './pid'
import scan from './scan'
import tipMonitor from './tipMonitor'
import bias from './bias'
import autoApproach from './autoApproach'
import workspaces from './workspaces'

export default combineReducers({
    router: connectRouter(history),
    monitor,
    pid,
    scan,
    tipMonitor,
    bias,
    autoApproach,
    workspaces
  });
