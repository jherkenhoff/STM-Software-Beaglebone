import produce from 'immer';
import {
  UPDATE_PATTERN_OPTIONS,
  UPDATE_PATTERN_POINTS,
  SET_SCAN_BOUNDING_BOX_SIZE,
  SET_SCAN_BOUNDING_BOX_POSITION,
  SET_SCAN_BOUNDING_BOX_ROTATION,
  UPDATE_SCAN_RANGE,
  SET_SCAN_PATTERN,
  SET_SCAN_PATTERN_PARAMETERS,
  UPDATE_SCAN_ENABLED,
  UPDATE_SCAN_RESULT
} from 'actions'

const initialState = {
  enabled: false,
  patternOptions: {},
  patternPoints: [],
  selectedPattern: undefined,
  selectedPatternParameters: {},
  isPatternUploaded: false,
  boundingBox: {
    size: {x: 1, y: 1},
    position: {x: 0, y: 0},
    rotation: 0
  },
  scanRange: {
    x: 1,
    y: 0
  },
  scanResult: {
    points: [],
    statistics: {
      adc: {min:0, max:1},
      z:   {min:0, max:1},
    },
    running: false,
    finished: false,
    progress: 0
  },
  isScanResultUpToDate: false
}

const reducer = (state = initialState, action) =>
  produce( state, draft => {
    switch (action.type) {
      case SET_SCAN_PATTERN:
        draft.selectedPattern = action.pattern
        draft.selectedPatternParameters = Object.fromEntries(Object.entries(draft.patternOptions[action.pattern].parameters).map(([k, param]) => [k, param.default]));
        draft.isPatternUploaded = false
        draft.isScanResultUpToDate = false
        break
      case UPDATE_PATTERN_OPTIONS:
        draft.patternOptions = action.options
        draft.isPatternUploaded = false
        draft.isScanResultUpToDate = false
        break
      case SET_SCAN_PATTERN_PARAMETERS:
        draft.selectedPatternParameters = action.parameters
        draft.isPatternUploaded = false
        draft.isScanResultUpToDate = false
        break
      case UPDATE_PATTERN_POINTS:
        draft.patternPoints = action.points
        draft.isPatternUploaded = true
        draft.isScanResultUpToDate = false
        break
      case SET_SCAN_BOUNDING_BOX_SIZE:
        draft.boundingBox.size = action.size
        draft.isPatternUploaded = false
        draft.isScanResultUpToDate = false
        break
      case SET_SCAN_BOUNDING_BOX_POSITION:
        draft.boundingBox.position = action.position
        draft.isPatternUploaded = false
        draft.isScanResultUpToDate = false
        break
      case SET_SCAN_BOUNDING_BOX_ROTATION:
        draft.boundingBox.rotation = action.rotation
        draft.isPatternUploaded = false
        draft.isScanResultUpToDate = false
        break
      case UPDATE_SCAN_RANGE:
        draft.scanRange = action.range
        draft.isPatternUploaded = false
        draft.isScanResultUpToDate = false
        break
      case UPDATE_SCAN_ENABLED:
        draft.enabled = action.enabled
        break
      case UPDATE_SCAN_RESULT:
        draft.scanResult = action.scanResult
        draft.isScanResultUpToDate = true
        break

    }
  });

export default reducer;
