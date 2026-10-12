import React from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";
import logo from "../assets/logo.jpg";

const Header = ({ uniqueCartItemsCount, onCartClick }) => {
    const navigate = useNavigate();

    return (
        <div>
            {/* Верхній білий хедер */}
            <div className="top-header">
                <div className="logo">
                    <img src={logo} alt="Technology Systems" />
                    <span>Building Shop</span>
                </div>
                <div className="header-contact">
                    <p>
                        Зв'язатися з нами:{" "}
                        <span className="contact-phone">
                            +38 (099) 000 00 00
                        </span>
                    </p>
                </div>
                <div className="header-actions">
                    <a href="/profile"> 🧑 Профіль</a>
                    <a
                        href="#"
                        onClick={(e) => {
                            e.preventDefault(); // Зупиняємо стандартний перехід
                            if (window.location.pathname === "/profile") {
                                // Якщо вже на сторінці профілю
                                const event = new CustomEvent("switchSection", {
                                    detail: { section: "favorites" },
                                });
                                window.dispatchEvent(event); // Відправляємо подію для зміни секції
                            } else {
                                navigate("/profile#wishlist"); // Перехід на профіль
                            }
                        }}
                    >
                        ❤️ Улюблене
                    </a>

                    <div className="cart-icon" onClick={onCartClick}>
                        🛒
                        <span className="cart-count">
                            {uniqueCartItemsCount}
                        </span>
                    </div>
                </div>
            </div>

            {/* Нижній чорний хедер */}
            <div className="main-header">
                <nav>
                    <ul>
                        <li>
                            <a href="/products" className="highlight">
                                Магазин
                            </a>
                        </li>
                        <li>
                            <a href="/">Головна</a>
                        </li>
                        <li>
                            <a href="/about">Про нас</a>
                        </li>
                        <li>
                            <a href="/contacts">Контакти</a>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
};

export default Header;
