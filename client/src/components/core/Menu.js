import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { signout, isAuthenticated } from '../../page/apiCore';
import { itemTotal } from '../../util/CartHelpers';

const isActive = (history, path) => {
    if (history.location.pathname === path) {
        return { color: '#ff9900' };
    } else {
        return { color: '#ffffff' };
    }
};

const Menu = ({ history }) => {
    return (
        <div>
            <ul className="nav nav-tabs bg-primary">
                <li className="nav-item">
                    <Link className="nav-link" to="/" style={isActive(history, '/')}>
                        Home
                    </Link>
                </li>
                <li className="nav-item">
                    <Link
                        className="nav-link"
                        style={isActive(history, "/shop")}
                        to="/shop"
                    >
                        Shop
                </Link>
                </li>

                <li className="nav-item">
                    <Link
                        className="nav-link"
                        style={isActive(history, "/cart")}
                        to="/cart"
                    >
                        Cart{" "}
                        <sup>
                            <small className="cart-badge">{itemTotal()}</small>
                        </sup>
                    </Link>
                </li>


                {isAuthenticated() && isAuthenticated().user.role === 0 && (
                    <li className="nav-item">
                        <Link className="nav-link" to="/user/dashboard" style={isActive(history, '/user/dashboard')}>
                            UserDashboard
                        </Link>
                    </li>
                )}

                {isAuthenticated() && isAuthenticated().user.role === 1 && (
                    <li className="nav-item">
                        <Link className="nav-link" to="/admin/dashboard" style={isActive(history, '/admin/dashboard')}>
                            AdminDashboard
                        </Link>
                    </li>
                )}

                {!isAuthenticated() && (
                    <>
                        <li className="nav-item">
                            <Link className="nav-link" to="/signin" style={isActive(history, '/signin')}>
                                Signin
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/signup" style={isActive(history, '/signup')}>
                                Signup
                            </Link>
                        </li>
                    </>
                )}
                {isAuthenticated() && (
                    <>
                        <li className="nav-item">
                            <span
                                className="nav-link"
                                onClick={() =>
                                    signout(() => {
                                        history.push('/');
                                    })
                                }
                                style={{ cursor: 'pointer', color: '#ffffff' }}
                            >
                                SignOut
                            </span>
                        </li>
                    </>
                )}
            </ul>
        </div>
    );
};

export default withRouter(Menu);
