import React, { useEffect } from "react";

import Header from "../components/Header"; // Якщо у вас є загальний Header
import Footer from "../components/Footer"; // Якщо у вас є загальний Footer
import { useNavigate, Link, useLocation } from "react-router-dom";
import "./OrderConfirmation.css";

const OrderConfirmation = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { orderId, totalPrice } = location.state || {
        orderId: "N/A",
        totalPrice: 0,
    };

    useEffect(() => {
        if (totalPrice === 0) {
            navigate("/products");
        }
    }, [totalPrice, navigate]);

    const formattedOrderId = `#A000${orderId}`;

    return (
        <div>
            <Header />
            <div className="confirmation-container">
                <h1>Замовлення оформлено</h1>
                <p>
                    Дякуємо за замовлення. Воно буде оброблено найближчим часом.
                </p>
                <div className="order-details">
                    <p>
                        Номер замовлення: <strong>{formattedOrderId}</strong>
                    </p>
                    <p>
                        Сума: <strong>{totalPrice} ₴</strong>
                    </p>
                    <p>Статус: Новий</p>
                </div>
                <Link to="/" className="home-link">
                    Повернутися на головну
                </Link>
            </div>
            <Footer />
        </div>
    );
};

export default OrderConfirmation;
