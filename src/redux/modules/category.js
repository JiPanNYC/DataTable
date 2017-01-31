import {
  LOAD_CATEGORY_REQUEST, LOAD_CATEGORY_SUCCESS, LOAD_CATEGORY_FAILURE
} from './constants';

const initialState = {
  isFetching: false,
  loaded: false,
  category: [],
  dataTableInCategory: [],
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD_CATEGORY_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
        loaded: false,
      });
    case LOAD_CATEGORY_SUCCESS:
      
      return Object.assign({}, state, {
        isFetching: false,
        loaded: true,
        category: action.result,
        dataTableInCategory: action.result.dataTableInCategory,
      });
    case LOAD_CATEGORY_FAILURE:
      return Object.assign({}, state, {
        error: action.error
      });
    default:
      return state;
  }
}

export function isLoaded(globalState, slug) {
  return globalState.category && globalState.category.loaded && (globalState.category.slug === slug);
}

