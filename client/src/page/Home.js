import React, { useEffect } from 'react';
import Layout from '../components/core/Layout';
import PropTypes from 'prop-types';
import Card from '../components/product/Card';
import { useSelector, useDispatch } from 'react-redux';
import { LOAD_PRODUCTS_REQUEST } from '../actions/types';
const Home = props => {
    const dispatch = useDispatch();
    const { productsByArrival, productsBySell, loadProductsLoading } = useSelector((state) => state.product);

    useEffect(() => {

        dispatch({
            type: LOAD_PRODUCTS_REQUEST,
            data: 'sold',
        });
        dispatch({
            type: LOAD_PRODUCTS_REQUEST,
            data: 'createdAt',
        });
    }, []);



    return (
        <Layout title="Home Page" description="Node React E-commerce App" className="container-fluid">
            <h2 className="mb-4">New Arrivals</h2>
            <div className="row">
                {productsByArrival && productsByArrival.product.map((product, i) => (
                    <div key={i} className="col-4 mb-3">
                        <Card product={product} />
                    </div>
                ))}
            </div>
            <h2 className="mb-4">Best Sellers</h2>
            <div className="row">
                {productsBySell && productsBySell.product.map((product, i) => (
                    <div key={i} className="col-4 mb-3">
                        <Card product={product} />
                    </div>
                ))}
            </div>
        </Layout>
    );
};

Home.propTypes = {

};

export default Home;