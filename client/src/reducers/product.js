import {
    LOAD_PRODUCTS_FAILURE,
    LOAD_PRODUCTS_REQUEST,
    LOAD_PRODUCTS_SUCCESS,
    LOAD_PRODUCT_FAILURE,
    LOAD_PRODUCT_REQUEST,
    LOAD_PRODUCT_SUCCESS,
    LOAD_RELATED_FAILURE,
    LOAD_RELATED_REQUEST,
    LOAD_RELATED_SUCCESS,
    LOAD_FILTER_PRODUCT_REQUEST,
    LOAD_FILTER_PRODUCT_SUCCESS,
    LOAD_FILTER_PRODUCT_FAILURE,
    ADD_PRODUCT_FAILURE,
    ADD_PRODUCT_REQUEST,
    ADD_PRODUCT_SUCCESS,

} from '../actions/types';
import produce from 'immer';

const initialState = {
    productsBySell: null,
    productsByArrival: null,
    product: null,
    realted: [],
    productsFilter: [],
    productFilterSize: null,
    addProductsDone: false,
    addProductsLoading: false,
    addProductsError: null,
    loadProductsFilterDone: false,
    loadProductsFilterLoading: false,
    loadProductsFilterError: null,
    loadProductsDone: false,
    loadProductsLoading: false,
    loadProductsError: null,
    loadProductDone: false,
    loadProductLoading: false,
    loadProductError: null,
    loadRelatedtDone: false,
    loadRelatedtLoading: false,
    loadRelatedtError: null,

};

const reducer = (state = initialState, action) => produce(state, (draft) => {
    switch (action.type) {
        case LOAD_PRODUCTS_REQUEST:
            draft.loadProductsLoading = true;
            draft.loadProductsDone = false;
            draft.loadProductsError = null;
            break;
        case LOAD_PRODUCTS_SUCCESS:
            if (action.data.dataCheck === 'sold')
                draft.productsBySell = action.data.data;
            else if (action.data.dataCheck === 'createdAt')
                draft.productsByArrival = action.data.data;
            draft.loadProductsLoading = false;
            draft.loadProductsDone = true;

            break;
        case LOAD_PRODUCTS_FAILURE:
            draft.loadProductsLoading = false;
            draft.loadProductsError = action.error;
            break;
        case ADD_PRODUCT_REQUEST:
            draft.addProductsLoading = true;
            draft.addProductsDone = false;
            draft.addProductsError = null;
            break;
        case ADD_PRODUCT_SUCCESS:
            draft.addProductsLoading = false;
            draft.addProductsDone = true;

            break;
        case ADD_PRODUCT_FAILURE:
            draft.addProductsLoading = false;
            draft.addProductsError = action.error;
            break;
        case LOAD_FILTER_PRODUCT_REQUEST:
            draft.loadProductsFilterLoading = true;
            draft.loadProductsFilterDone = false;
            draft.loadProductsFilterError = null;
            break;
        case LOAD_FILTER_PRODUCT_SUCCESS:
            // draft.productsFilter = action.data.data;
            if (action.data.check)
                draft.productsFilter = draft.productsFilter.concat(action.data.data)
            else
                draft.productsFilter = action.data.data
            draft.productFilterSize = action.data.size
            draft.loadProductsFilterLoading = false;
            draft.loadProductsFilterDone = true;

            break;
        case LOAD_FILTER_PRODUCT_FAILURE:
            draft.loadProductsFilterLoading = false;
            draft.loadProductsFilterError = action.error;
            break;
        case LOAD_PRODUCT_REQUEST:
            draft.loadProductLoading = true;
            draft.loadProductDone = false;
            draft.loadProductError = null;
            break;
        case LOAD_PRODUCT_SUCCESS:
            draft.product = action.data;
            draft.loadProductLoading = false;
            draft.loadProductDone = true;

            break;
        case LOAD_PRODUCT_FAILURE:
            draft.loadProductLoading = false;
            draft.loadProductError = action.error;
            break;
        case LOAD_RELATED_REQUEST:
            draft.loadRealtedLoading = true;
            draft.loadRealtedDone = false;
            draft.loadRealtedError = null;
            break;
        case LOAD_RELATED_SUCCESS:
            draft.realted = action.data;
            draft.loadRealtedLoading = false;
            draft.loadRealtedDone = true;

            break;
        case LOAD_RELATED_FAILURE:
            draft.loadRealtedLoading = false;
            draft.loadRealtedError = action.error;
            break;
        default:
            break;
    }
});




export default reducer;