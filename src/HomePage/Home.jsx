import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./Homepage.css";

// Імпортуємо зображення
import wideSelectionImg from "../assets/wide-selection.jpg";
import deliveryImg from "../assets/delivery.jpg";
import discountsImg from "../assets/discounts.jpg";
import ecoMaterialsImg from "../assets/eco-materials.jpg";
import supportImg from "../assets/support.jpg";

const HomePage = () => {
    const navigate = useNavigate();
    const [specialOffers, setSpecialOffers] = useState([]);

    useEffect(() => {
        const fetchSpecialOffers = async () => {
            try {
                const response = await fetch(
                    "http://localhost:5000/api/products/special-offers"
                );
                if (!response.ok)
                    throw new Error("Failed to fetch special offers.");
                const data = await response.json();
                setSpecialOffers(data);
            } catch (error) {
                console.error("Error fetching special offers:", error);
            }
        };

        fetchSpecialOffers();
    }, []);

    const handleCartClick = () => {
        navigate("/products?openCart=true");
    };

    return (
        <div className="homepage-container">
            <Header onCartClick={handleCartClick} />

            <main className="homepage-main">
                <section className="hero-section">
                    <h2>Ласкаво просимо до нашого будівельного магазину!</h2>
                    <p>
                        Ми пропонуємо широкий вибір матеріалів для будівництва
                        та ремонту за вигідними цінами. Наша команда готова
                        допомогти вам із вибором найкращих товарів для ваших
                        потреб.
                    </p>
                    <Link to="/products">
                        <button className="shop-button">
                            Переглянути товари
                        </button>
                    </Link>
                </section>

                <section className="about-section">
                    <h3 className="section-title">Чому обирають нас?</h3>
                    <div className="about-grid">
                        <div className="about-item">
                            <img src={wideSelectionImg} alt="Широкий вибір" />
                            <h4>Широкий вибір</h4>
                            <p>
                                У нас ви знайдете матеріали для будь-яких
                                будівельних проєктів, незалежно від їх
                                складності чи масштабу.
                            </p>
                        </div>
                        <div className="about-item">
                            <img src={deliveryImg} alt="Швидка доставка" />
                            <h4>Швидка доставка</h4>
                            <p>
                                Ми співпрацюємо з провідними службами доставки,
                                щоб ваші замовлення прибували швидко та без
                                затримок.
                            </p>
                        </div>
                    </div>
                    <div className="about-grid">
                        <div className="about-item">
                            <img src={discountsImg} alt="Вигідні ціни" />
                            <h4>Вигідні ціни</h4>
                            <p>
                                Регулярні знижки та акції на популярні товари
                                роблять покупки ще доступнішими для наших
                                клієнтів.
                            </p>
                        </div>
                        <div className="about-item">
                            <img src={ecoMaterialsImg} alt="Екоматеріали" />
                            <h4>Екологічні матеріали</h4>
                            <p>
                                Ми пропонуємо матеріали, які безпечні для
                                довкілля, допомагаючи підтримувати екологічність
                                будівництва.
                            </p>
                        </div>
                        <div className="about-item">
                            <img src={supportImg} alt="Підтримка клієнтів" />
                            <h4>Підтримка клієнтів</h4>
                            <p>
                                Наша команда завжди готова допомогти, надавши
                                консультації та відповіді на всі ваші запитання.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="special-offers">
                    <h3>Спеціальні пропозиції</h3>
                    <div className="products-grid">
                        {specialOffers.map((product) => (
                            <div className="product-card" key={product.id}>
                                <img
                                    src={`http://localhost:5000${product.photo_path}`}
                                    alt={product.name}
                                    className="product-image"
                                />
                                <h4 className="product-title">
                                    {product.name}
                                </h4>
                                <p>{product.description}</p>
                                <p className="product-price">
                                    {product.price} грн / шт
                                </p>
                                <button
                                    className="buy-button"
                                    onClick={() =>
                                        navigate(
                                            `/products?product=${product.id}`
                                        )
                                    }
                                >
                                    Придбати
                                </button>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default HomePage;
