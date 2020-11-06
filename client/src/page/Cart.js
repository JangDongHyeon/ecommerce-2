import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/core/Layout';
import { getCart } from '../util/CartHelpers';
import Card from '../components/product/Card';
import CheckOut from '../components/product/CheckOut';

const Cart = props => {
    const [items, setItem] = useState([]);
    const [run, setRun] = useState(false)

    useEffect(() => {
        setItem(getCart())
    }, [run]);

    const showItems = items => {
        return (
            <div>
                <h2>Your cart has {`${items.length}`} items</h2>
                <hr />
                {items.map((product, i) => (
                    <Card
                        key={i}
                        product={product}
                        showAddToCartButton={false}
                        cartUpdate={true}
                        showRemoveProductButton={true}
                        setRun={setRun}
                        run={run}
                    />
                ))}
            </div>
        )
    }


    const noItemsMessage = () => (
        <h2>
            Your cart is empty. <br /> <Link to="/shop">Continue shopping</Link>
        </h2>
    );

    return (
        <Layout
            title="Shopping Cart"
            description="Manage your cart items. Add remove checkout or continue shopping."
            className="container-fluid"
        >
            <div className="row">
                <div className="col-6">{items.length > 0 ? showItems(items) : noItemsMessage()}</div>

                <div className="col-6">
                    <h2 className="mb-4">Your cart summary</h2>
                    <hr />
                    <CheckOut products={items} setRun={setRun} run={run} />
                </div>
            </div>
        </Layout>
    );
};

Cart.propTypes = {

};

export default Cart;