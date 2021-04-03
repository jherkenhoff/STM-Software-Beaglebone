import { SOCKET_CONNECTION_CHANGED } from 'actions'

const initialState = {
  connection: false
}

export default function status(state = initialState, action) {
  switch (action.type) {
    case SOCKET_CONNECTION_CHANGED:
      return { ...state,
        connection: action.state
      }

    default:
      return state
  }
}
