import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage/Home.jsx";
import ProductsPage from "./ProductsPage/Products.jsx";
import ProfilePage from "./ProfilePage/Profile.jsx";
import OrderPage from "./OrderPage/Order.jsx";
import OrderConfirmation from "./OrderPage/OrderConfirmation";
import LoginPage from "./AuthenticationPage/LoginPage";
import RegisterPage from "./AuthenticationPage/RegisterPage";
import AboutPage from "./AboutPage/About.jsx";
import ContactsPage from "./ContactsPage/Contacts.jsx";
import AdminPage from "./AdminPage/Admin.jsx";
import ProtectedRoute from "./ProtectedRoute";

function App() {
    const [cartItems, setCartItems] = useState([]);

    const addToCart = (item) => {
        setCartItems((prevItems) => [...prevItems, item]);
    };

    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route
                    path="/products"
                    element={<ProductsPage addToCart={addToCart} />}
                />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/order" element={<OrderPage />} />
                <Route
                    path="/order-confirmation"
                    element={<OrderConfirmation />}
                />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contacts" element={<ContactsPage />} />
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute>
                            <AdminPage />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;
