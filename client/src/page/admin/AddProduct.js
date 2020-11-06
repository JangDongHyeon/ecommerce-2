import React, { useState, useEffect } from 'react';
import Layout from '../../components/core/Layout';
import { isAuthenticated } from '../apiCore';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { CATEGORY_GET_REQUEST, ADD_PRODUCT_REQUEST } from '../../actions/types';

const AddProduct = () => {
    const dispatch = useDispatch();
    const { loadCategorysError, getCategorysDone, categorys } = useSelector((state) => state.category);
    const { addProductsDone, addProductsError } = useSelector((state) => state.product);
    const [values, setValues] = useState({
        name: '',
        description: '',
        price: '',
        categories: [],
        category: '',
        shipping: '',
        quantity: '',
        photo: '',
        formData: new FormData()
    });


    const { user, token } = isAuthenticated();
    const {
        name,
        description,
        price,
        categories,
        category,
        shipping,
        quantity,
        formData


    } = values;

    useEffect(() => {
        dispatch({
            type: CATEGORY_GET_REQUEST
        })
    }, []);

    const handleChange = (name) => (event) => {
        const value = name === 'photo' ? event.target.files[0] : event.target.value;
        formData.set(name, value);
        setValues({ ...values, [name]: value });
    };
    const clickSubmit = (event) => {
        event.preventDefault();

        dispatch({
            type: ADD_PRODUCT_REQUEST,
            data: { userId: user._id, token, formData }
        })
    }

    const newPostForm = () => (
        <form className="mb-3" onSubmit={clickSubmit}>
            <h4>Post Photo</h4>
            <div className="form-group">
                <label className="btn btn-secondary">
                    <input onChange={handleChange('photo')} type="file" name="photo" accept="image/*" />
                </label>
            </div>

            <div className="form-group">
                <label className="text-muted">Name</label>
                <input onChange={handleChange('name')} type="text" className="form-control" value={name} />
            </div>

            <div className="form-group">
                <label className="text-muted">Description</label>
                <textarea onChange={handleChange('description')} className="form-control" value={description} />
            </div>

            <div className="form-group">
                <label className="text-muted">Price</label>
                <input onChange={handleChange('price')} type="number" className="form-control" value={price} />
            </div>

            <div className="form-group">
                <label className="text-muted">Category</label>
                <select onChange={handleChange('category')} className="form-control">
                    <option>Please select</option>
                    {categorys &&
                        categorys.map((c, i) => (
                            <option key={i} value={c._id}>
                                {c.name}
                            </option>
                        ))}
                </select>
            </div>

            <div className="form-group">
                <label className="text-muted">Shipping</label>
                <select onChange={handleChange('shipping')} className="form-control">
                    <option>Please select</option>
                    <option value="0">No</option>
                    <option value="1">Yes</option>
                </select>
            </div>

            <div className="form-group">
                <label className="text-muted">Quantity</label>
                <input onChange={handleChange('quantity')} type="number" className="form-control" value={quantity} />
            </div>

            <button className="btn btn-outline-primary">Create Product</button>
        </form>
    );

    const showError = () => (
        <div className="alert alert-danger" style={{ display: loadCategorysError || addProductsError ? '' : 'none' }}>
            error
        </div>
    );

    const showSuccess = () => (
        <div className="alert alert-info" style={{
            display:
                addProductsDone ? '' : 'none'
        }}>
            <h2>  created!</h2>
        </div>
    );

    return (
        <Layout title="Add a new product" description={`G'day ${user.name}, ready to add a new product?`}>
            <div className="row">
                <div className="col-md-8 offset-md-2">
                    {showSuccess()}
                    {showError()}
                    {newPostForm()}
                </div>
            </div>
        </Layout>
    );
};

AddProduct.propTypes = {

};

export default AddProduct;