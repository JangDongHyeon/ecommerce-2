import { takeLatest, put, all, call, fork, throttle, takeEvery } from 'redux-saga/effects';
import {
    CATEGORY_GET_REQUEST,
    CATEGORY_GET_SUCCESS,
    CATEGORY_GET_FAILURE,
    CATEGORY_ADD_REQUEST,
    CATEGORY_ADD_FAILURE,
    CATEGORY_ADD_SUCCESS,
    CATEGORY_ADD_RESET
} from '../actions/types';
import axios from 'axios'
import { API } from '../config';


function categoryGetAPI() {
    return axios.get(`${API}/category/categories`);
}


function* categoryGet() {
    try {

        const result = yield call(categoryGetAPI);

        yield put({
            type: CATEGORY_GET_SUCCESS,
            data: result.data,
        });

    }
    catch (error) {
        console.error(error);
        yield put({
            type: CATEGORY_GET_FAILURE,
            error: error.response.data,
        });
    }
}

function categoryAddAPI(data) {

    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
    return axios.post(`${API}/category/create/${data.userId}`, { name: data.name });
}


function* categoryAdd(action) {
    try {

        const result = yield call(categoryAddAPI, action.data);

        yield put({
            type: CATEGORY_ADD_SUCCESS,
            data: result.data,
        });

    }
    catch (error) {
        console.error(error);
        yield put({
            type: CATEGORY_ADD_FAILURE,
            error: error.response.data,
        });
    }
}

export function* watchCategoryGet() {

    yield takeLatest(CATEGORY_GET_REQUEST, categoryGet);
}

export function* watchCategoryAdd() {

    yield takeLatest(CATEGORY_ADD_REQUEST, categoryAdd);
}

export default function* categorySaga() {
    yield all([
        fork(watchCategoryGet),
        fork(watchCategoryAdd),
    ]);
}