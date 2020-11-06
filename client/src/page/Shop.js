import React, { useState, useEffect } from 'react';
import Layout from "../components/core/Layout";
import Card from "../components/product/Card";
import CheckBox from "../components/product/CheckBox";
import RadioBox from "../components/product/RadioBox";
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { CATEGORY_GET_REQUEST, LOAD_FILTER_PRODUCT_REQUEST } from '../actions/types';
import { prices } from '../util/fixedPrices'
const Shop = () => {

    const dispatch = useDispatch();
    const { categorys } = useSelector((state) => state.category);
    const { productFilterSize, productsFilter } = useSelector((state) => state.product);

    const [limit, setLimit] = useState(6);
    const [skip, setSkip] = useState(0);


    const [myFilters, setMyFilters] = useState({
        filters: { category: [], price: [] }
    });

    const loadFilteredResults = newFilters => {
        dispatch({
            type: LOAD_FILTER_PRODUCT_REQUEST,
            data: { skip, limit, filters: newFilters, check: false }
        });

        setSkip(0);
    }


    const loadMore = () => {
        let toSkip = skip + limit;
        dispatch({
            type: LOAD_FILTER_PRODUCT_REQUEST,
            data: { skip: toSkip, limit, filters: myFilters.filters, check: true }
        });
        setSkip(toSkip);
    }

    const loadMoreButton = () => {
        return (
            productFilterSize > 0 &&
            productFilterSize >= limit && (
                <button onClick={loadMore} className="btn btn-warning mb-5">
                    Load more
                </button>
            )
        )
    }


    useEffect(() => {
        dispatch({
            type: CATEGORY_GET_REQUEST
        })
        loadFilteredResults(skip, limit, myFilters.filters);
    }, [])

    const handlePrice = value => {
        const data = prices;
        let array = [];

        for (let key in data) {
            if (data[key]._id === parseInt(value)) {
                array = data[key].array;
            }
        }
        return array;
    }

    const handleFilters = (filters, filterBy) => {
        const newFilters = { ...myFilters };
        newFilters.filters[filterBy] = filters;

        if (filterBy === 'price') {
            let priceValues = handlePrice(filters);
            newFilters.filters[filterBy] = priceValues;
        }
        loadFilteredResults(myFilters.filters);
        setMyFilters(newFilters);
    }



    return (
        <Layout
            title="Shop Page"
            description="Search and find books of your choice"
            className="container-fluid"
        >
            <div className="row">
                <div className="col-4">
                    <h4>Filter by categories</h4>
                    <ul>{categorys && <CheckBox categories={categorys} handleFilters={filters => handleFilters(filters, 'category')} />}

                    </ul>
                </div>

                <div className="col-8">
                    <h4>Filter by price range</h4>

                    <RadioBox prices={prices} handleFilters={filters => handleFilters(filters, 'price')} />
                </div>
            </div>
            <div className="col-8">
                <h2 className="mb-4">Products</h2>
                <div className="row">
                    {productsFilter.map((product, i) => (
                        <div key={i} className="col-4 mb-3">
                            <Card product={product} />
                        </div>
                    ))}
                </div>
                <hr />
                {loadMoreButton()}
            </div>
        </Layout>
    );
};

Shop.propTypes = {

};

export default Shop;