import { LOAD_CATEGORY_REQUEST, LOAD_CATEGORY_SUCCESS, LOAD_CATEGORY_FAILURE } from '../../redux/modules/constants';

export function fetchIndividualCategory(id) {
  return {
    types: [LOAD_CATEGORY_REQUEST, LOAD_CATEGORY_SUCCESS, LOAD_CATEGORY_FAILURE],
    promise: (client) => client.get(`/api/v1/category/${id}/`)
  };
}
