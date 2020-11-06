import React, { useState } from "react";
import Layout from '../../components/core/Layout'
import { CATEGORY_ADD_REQUEST } from '../../actions/types'
import { isAuthenticated } from "../apiCore";
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from "react-redux";

const AddCategory = props => {
    const [name, setName] = useState("");

    const { user, token } = isAuthenticated();
    const dispatch = useDispatch();
    const { addCategorysError, addCategorysDone } = useSelector((state) => state.category);

    const handleChange = e => {
        setName(e.target.value);
    };

    const clickSubmit = e => {
        e.preventDefault();
        dispatch({
            type: CATEGORY_ADD_REQUEST,
            data: { name, token, userId: user._id }
        })
    }

    const newCategoryFom = () => (
        <form onSubmit={clickSubmit}>
            <div className="form-group">
                <label className="text-muted">Name</label>
                <input
                    type="text"
                    className="form-control"
                    onChange={handleChange}
                    value={name}
                    autoFocus
                    required
                />
            </div>
            <button className="btn btn-outline-primary">Create Category</button>
        </form>
    );

    const showSuccess = () => {
        if (addCategorysDone) {
            return <h3 className="text-success">{name} is created</h3>;
        }
    };

    const showError = () => {
        if (addCategorysError) {
            return <h3 className="text-danger">Category should be unique</h3>;
        }
    };

    const goBack = () => (
        <div className="mt-5">
            <Link to="/admin/dashboard" className="text-warning">
                Back to Dashboard
            </Link>
        </div>
    );

    return (
        <Layout
            title="Add a new category"
            description={`G'day ${user.name}, ready to add a new category?`}
        >
            <div className="row">
                <div className="col-md-8 offset-md-2">
                    {showSuccess()}
                    {showError()}
                    {newCategoryFom()}
                    {goBack()}
                </div>
            </div>
        </Layout>
    );
};

AddCategory.propTypes = {

};

export default AddCategory;