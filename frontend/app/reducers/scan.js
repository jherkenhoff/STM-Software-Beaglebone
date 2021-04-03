import { SOCKET_CONNECTION_CHANGED } from 'actions'

const initialState = {
  enabled: false,
  dacX: 0,
  dacY: 0
}

export default function scan(state = initialState, action) {
  switch (action.type) {

    default:
      return state
  }
}
