import React from "react";
import { useNavigate } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
    const navigate = useNavigate();

    return (
        <footer className="footer">
            <div className="footer-section">
                <h3>Меню</h3>
                <ul>
                    <li>
                        <a href="/">Головна</a>
                    </li>
                    <li>
                        <a href="/products">Магазин</a>
                    </li>
                    <li>
                        <a href="/about">Про нас</a>
                    </li>
                    <li>
                        <a href="/contacts">Контакти</a>
                    </li>
                </ul>
            </div>
            <div className="footer-section">
                <h3>Особистий кабінет</h3>
                <ul>
                    <li>
                        <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                if (window.location.pathname === "/profile") {
                                    const event = new CustomEvent(
                                        "switchSection",
                                        {
                                            detail: { section: "orders" },
                                        }
                                    );
                                    window.dispatchEvent(event);
                                } else {
                                    navigate("/profile#orders");
                                }
                            }}
                        >
                            Історія замовлень
                        </a>
                    </li>

                    <li>
                        <a href="/profile">Мої дані</a>
                    </li>
                    <li>
                        <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                if (window.location.pathname === "/profile") {
                                    const event = new CustomEvent(
                                        "switchSection",
                                        {
                                            detail: { section: "favorites" },
                                        }
                                    );
                                    window.dispatchEvent(event);
                                } else {
                                    navigate("/profile#wishlist");
                                }
                            }}
                        >
                            Улюблене
                        </a>
                    </li>
                </ul>
            </div>
            <div className="footer-section">
                <h3>Контакти</h3>
                <p>Залишилися питання? Зателефонуйте нам:</p>
                <p>
                    <strong>+38 (099) 000 00 00</strong>
                </p>
                <p>Зв'яжіться з нами по пошті:</p>
                <p>
                    <a href="mailto:email@gmail.com">support@support.com.ua</a>
                </p>
            </div>
        </footer>
    );
};

export default Footer;
