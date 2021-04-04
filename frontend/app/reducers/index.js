/**
 * Combine all reducers in this file and export the combined reducers.
 */

import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

import history from 'utils/history';
import monitor from './monitor'
import pid from './pid'
import scan from './scan'

export default combineReducers({
    router: connectRouter(history),
    monitor,
    pid,
    scan
  });
