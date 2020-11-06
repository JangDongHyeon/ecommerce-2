import React, { useState, useEffect } from 'react';
import Layout from '../components/core/Layout';
// import { read, listRelated } from './apiCore';
import { LOAD_PRODUCT_REQUEST, LOAD_RELATED_REQUEST } from '../actions/types'
import Card from '../components/product/Card';
import { useDispatch, useSelector } from 'react-redux';

const Product = props => {
    const dispatch = useDispatch();
    const { product, realted } = useSelector((state) => state.product);

    const loadSingleProduct = productId => {
        dispatch({
            type: LOAD_PRODUCT_REQUEST,
            data: productId
        })
        dispatch({
            type: LOAD_RELATED_REQUEST,
            data: productId
        })
    }


    useEffect(() => {
        const productId = props.match.params.productId;
        loadSingleProduct(productId);
    }, [props]);

    return (
        <Layout
            title={product && product.name}
            description={product && product.description && product.description.substring(0, 100)}
            className="container-fluid"
        >
            <div className="row">
                <div className="col-8">
                    {product && product.description && <Card product={product} showViewProductButton={false} />}
                </div>
                <div className="col-4">
                    <h4>Related products</h4>
                    {realted.length > 0 && realted.map((p, i) => (
                        <div className="mb-3" key={i}>

                            <Card product={p} />
                        </div>
                    ))}
                </div>
            </div>

        </Layout>
    );
};

Product.propTypes = {

};

export default Product;