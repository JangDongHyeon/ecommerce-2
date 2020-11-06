import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider as StoreProvider } from 'react-redux';
import PrivateRoute from './util/PrivateRoute';
import Home from './page/Home';
import Shop from './page/Shop'
import Product from './page/Product'
import Signin from './page/Signin'
import Signup from './page/Signup'
import Dashboard from './page/Dashboard'
import { store } from './store/store';
import Cart from './page/Cart';
import AdminRoute from './util/AdminRoute';
import Admindashboard from './page/admin/Dashboard';
import AddCategory from './page/admin/AddCategory';
import AddProduct from './page/admin/AddProduct'
import Orders from './page/admin/Orders'
import Profile from './page/Profile'
import ManageProducts from './page/admin/ManageProducts';
import UpdateProduct from './page/admin/UpdateProduct';

const App = () => (
  <StoreProvider store={store}>
    <Router>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/shop" exact component={Shop} />

        <Route path="/signin" exact component={Signin} />
        <Route path="/signup" exact component={Signup} />
        <PrivateRoute path="/user/dashboard" exact component={Dashboard} />

        <AdminRoute path="/admin/dashboard" exact component={Admindashboard} />
        <AdminRoute path="/admin/Orders" exact component={Orders} />
        <AdminRoute path="/create/category" exact component={AddCategory} />

        <AdminRoute path="/create/product" exact component={AddProduct} />
        {/* sdsd ssdsd*/}
        <Route path="/cart" exact component={Cart} />
        <Route path="/product/:productId" exact component={Product} />
        <PrivateRoute path="/profile/:userId" exact component={Profile} />
        <PrivateRoute path="/admin/products" exact component={ManageProducts} />
        <AdminRoute path="/admin/product/update/:productId" exact component={UpdateProduct} />
        {/* <AdminRoute path="/admin/category/update/:categoryId" exact component={UpdateCategory} /> */}
      </Switch>
    </Router>
  </StoreProvider>
);

export default App;


