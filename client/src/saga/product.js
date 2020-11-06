import { all, delay, fork, put, takeLatest, throttle, call, takeEvery } from 'redux-saga/effects';
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

import axios from 'axios';
import { API } from '../config';

function loadProductsAPI(data) {
    return axios.get(`/product/products?sortBy=${data}&order=desc&limit=6`);
}

function* loadProducts(action) {
    try {


        const result = yield call(loadProductsAPI, action.data);

        yield put({
            type: LOAD_PRODUCTS_SUCCESS,
            data: { data: result.data, dataCheck: action.data },
        });

        yield put({
            type: LOAD_PRODUCTS_SUCCESS,
            data: { data: result.data, dataCheck: action.data },
        });



    } catch (err) {
        console.error(err);
        yield put({
            type: LOAD_PRODUCTS_FAILURE,
            data: err.response.data,
        });
    }
}


function addProductsAPI(data) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
    // console.log(data.data.getAll())
    return axios.post(`${API}/product/create/${data.userId}`, data.formData);
}

function* addProducts(action) {
    try {


        const result = yield call(addProductsAPI, action.data);

        yield put({
            type: ADD_PRODUCT_SUCCESS,

        });




    } catch (err) {
        console.error(err);
        yield put({
            type: ADD_PRODUCT_FAILURE,
            data: err.response.data,
        });
    }
}


function loadProductsFilterAPI(data) {
    return axios.post(`/product/products/by/search`, data);
}

function* loadProductsFilter(action) {
    try {


        const result = yield call(loadProductsFilterAPI, action.data);

        yield put({
            type: LOAD_FILTER_PRODUCT_SUCCESS,
            data: { data: result.data.data, size: result.data.size, check: action.data.check }
        });



    } catch (err) {
        console.error(err);
        yield put({
            type: LOAD_FILTER_PRODUCT_FAILURE,
            data: err.response.data,
        });
    }
}

function loadProductAPI(data) {
    return axios.get(`/product/${data}`);
}

function* loadProduct(action) {
    try {
        const result = yield call(loadProductAPI, action.data);

        yield put({
            type: LOAD_PRODUCT_SUCCESS,
            data: result.data
        });

    } catch (err) {
        console.error(err);
        yield put({
            type: LOAD_PRODUCT_FAILURE,
            data: err.response.data,
        });
    }
}
function loadRealtedAPI(data) {
    return axios.get(`/product/products/related/${data}`);
}

function* loadRealted(action) {
    try {
        const result = yield call(loadRealtedAPI, action.data);

        yield put({
            type: LOAD_RELATED_SUCCESS,
            data: result.data
        });

    } catch (err) {
        console.error(err);
        yield put({
            type: LOAD_RELATED_FAILURE,
            data: err.response.data,
        });
    }
}



function* watchAddProducts() {
    yield takeEvery(ADD_PRODUCT_REQUEST, addProducts)
}


function* watchLoadProducts() {
    yield takeEvery(LOAD_PRODUCTS_REQUEST, loadProducts)
}

function* watchLoadProduct() {
    yield takeLatest(LOAD_PRODUCT_REQUEST, loadProduct)
}

function* watchLoadRealted() {
    yield takeLatest(LOAD_RELATED_REQUEST, loadRealted)
}

function* watchLoadProductsFilter() {
    yield takeLatest(LOAD_FILTER_PRODUCT_REQUEST, loadProductsFilter)
}


export default function* foodSaga() {
    yield all([
        fork(watchAddProducts),
        fork(watchLoadProductsFilter),
        fork(watchLoadProducts),
        fork(watchLoadProduct),
        fork(watchLoadRealted),
    ]);
}