const initialState = {
  matches: [],
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_MATCH':
      return {
        ...state,
        matches: [...state.matches, action.payload],
      };
    case 'EDIT_MATCH':
      return {
        ...state,
        matches: state.matches.map((match) =>
          match.id === action.payload.id ? action.payload : match
        ),
      };
    case 'DELETE_MATCH':
      return {
        ...state,
        matches: state.matches.filter((match) => match.id !== action.payload),
      };
      case 'UPDATE_MATCH':
        return {
          ...state,
          matches: state.matches.map((m) =>
            m.id === action.payload.id ? action.payload : m
          ),
        };
    default:
      return state;
  }
};

export default rootReducer;
