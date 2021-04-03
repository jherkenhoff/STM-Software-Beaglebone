/**
 * Combine all reducers in this file and export the combined reducers.
 */

import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

import history from 'utils/history';
import status from './status'
import pid from './pid'
import scan from './scan'

export default combineReducers({
    router: connectRouter(history),
    status,
    pid,
    scan
  });
