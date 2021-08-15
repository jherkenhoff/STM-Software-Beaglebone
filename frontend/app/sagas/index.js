import { takeEvery, take, put, call, fork, all } from 'redux-saga/effects'


import socketSaga from './socketSaga'
import renderSaga from './renderSaga'
import localStorageSaga from './localStorageSaga'

export function* rootSaga() {
  yield all([
    socketSaga(),
    renderSaga(),,
    localStorageSaga()
  ])
}
