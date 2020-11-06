import {
    combineReducers
} from 'redux';
import categoryReducer from './category';

import productReducer from './product'

export default combineReducers({
    category: categoryReducer,
    product: productReducer,

});