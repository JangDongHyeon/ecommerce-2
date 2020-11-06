// Imports: Dependencies
import { all, fork } from 'redux-saga/effects';

// Imports: Redux Sagas

import productSaga from './product';

import categorySaga from './category';

import axios from 'axios';
import { API } from '../config';
//http://155.230.24.116:8777/api
// axios.defaults.baseURL = 'http://155.230.24.116:8888/api';
// axios.defaults.baseURL = 'https://pro.neoali.com:40008/api';
axios.defaults.baseURL = `${API}`
// Redux Saga: Root Saga

export function* rootSaga() {
    yield all([
        fork(categorySaga),
        fork(productSaga),

    ]);
};