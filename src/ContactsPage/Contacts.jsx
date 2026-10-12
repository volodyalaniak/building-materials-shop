import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./Contacts.css";

const ContactsPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        message: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert("Дякуємо! Ми зв'яжемося з вами найближчим часом.");
        navigate("/");
        setFormData({ name: "", phone: "", email: "", message: "" });
    };

    const handleCartClick = () => {
        navigate("/products?openCart=true");
    };

    return (
        <div>
            <Header onCartClick={handleCartClick} />
            <div className="contacts-page">
                <div className="contacts-content">
                    <div className="contact-info">
                        <h2>Зателефонувати нам</h2>
                        <p>
                            <i className="fas fa-phone-alt"></i> +38 (099) 000
                            00 00
                        </p>
                        <p>
                            <i className="fas fa-phone-alt"></i> +38 (098) 000
                            00 00
                        </p>
                        <p>
                            <i className="fas fa-phone-alt"></i> +38 (093) 000
                            00 00
                        </p>

                        <h2>Електронна пошта</h2>
                        <p>
                            <i className="fas fa-envelope"></i>{" "}
                            support@support.com.ua
                        </p>

                        <h2>Адреса офісу</h2>
                        <p>
                            <i className="fas fa-map-marker-alt"></i> м. Київ,
                            вул. Київська
                        </p>
                    </div>

                    <form className="contact-form" onSubmit={handleSubmit}>
                        <h2>Зворотній зв'язок</h2>
                        <div className="form-group">
                            <input
                                type="text"
                                name="name"
                                placeholder="Ім'я *"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="tel"
                                name="phone"
                                placeholder="Телефон"
                                value={formData.phone}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="email"
                                name="email"
                                placeholder="Email *"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <textarea
                                name="message"
                                placeholder="Повідомлення"
                                value={formData.message}
                                onChange={handleChange}
                                required
                            ></textarea>
                        </div>
                        <button type="submit">Відправити</button>
                    </form>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ContactsPage;
