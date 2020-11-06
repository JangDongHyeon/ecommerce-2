import {
    CATEGORY_GET,
    CATEGORY_GET_REQUEST,
    CATEGORY_GET_FAILURE,
    CATEGORY_GET_SUCCESS,
    CATEGORY_ERROR,
    CATEGORY_ADD_REQUEST,
    CATEGORY_ADD_FAILURE,
    CATEGORY_ADD_SUCCESS,
    CATEGORY_ADD_RESET
} from '../actions/types';
import { produce } from 'immer';

export const getCategory = () => ({
    type: CATEGORY_GET_REQUEST,
});




const initialState = {
    categorys: null,
    loading: false,
    loadCategorysDone: false,
    loadCategorysLoading: false,
    loadCategorysError: null,
    addCategorysDone: false,
    addCategorysLoading: false,
    addCategorysError: null
};


const reducer = (state = initialState, action) => produce(state, (draft) => {

    switch (action.type) {
        case CATEGORY_GET_REQUEST:
            draft.loadCategorysLoading = true;
            draft.loadCategorysDone = false;
            draft.loadCategorysError = null;
            break;
        case CATEGORY_GET_SUCCESS:
            draft.loadCategorysLoading = false;
            draft.loadCategorysDone = true;
            draft.categorys = action.data;
            break;

        case CATEGORY_GET_FAILURE:
            draft.loadCategorysLoading = false;
            draft.loadCategorysError = action.error;
            break;
        case CATEGORY_ADD_REQUEST:
            draft.addCategorysLoading = true;
            draft.addCategorysDone = false;
            draft.addCategorysError = null;
            break;
        case CATEGORY_ADD_SUCCESS:
            draft.addCategorysLoading = false;
            draft.addCategorysDone = true;

            break;

        case CATEGORY_ADD_FAILURE:
            draft.addCategorysLoading = false;
            draft.addCategorysError = action.error;
            break;
        case CATEGORY_ADD_RESET:
            draft.addCategorysDone = false;
            draft.addCategorysLoading = false;
            draft.addCategorysError = null;
            break;
        default:
            break;
    }
});
export default reducer;