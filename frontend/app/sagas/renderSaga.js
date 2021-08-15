import { takeLatest, take, takeEvery, put, call, select } from 'redux-saga/effects'
import { eventChannel } from 'redux-saga'
import Voronoi from 'voronoi';

var voronoi = new Voronoi();
var diagram;

import {
  START_VORONOI_RENDER,
  setVoronoiRenderStatus,
  setVoronoiRenderResults
} from 'actions/renderActions'


function* handleStartVoronoiRender() {
  yield put(setVoronoiRenderStatus(true))

  const points = yield select(state => state.scan.scanResult.points)
  const scanRange = yield select(state => state.scan.scanRange)

  var bbox = {xl: -scanRange.x/2, xr: scanRange.x/2, yt: -scanRange.y/2, yb: scanRange.y/2};

  // Todo compute
  diagram = voronoi.recycle(diagram)
  diagram = voronoi.compute(points, bbox)
  yield put(setVoronoiRenderResults(diagram.cells))
  yield put(setVoronoiRenderStatus(false))
}

export default function* renderSaga() {
  yield takeLatest(START_VORONOI_RENDER, handleStartVoronoiRender)
}
