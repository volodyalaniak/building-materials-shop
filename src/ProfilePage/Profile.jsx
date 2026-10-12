import React, { useState, useEffect } from "react";
import "./Profile.css";
import { useNavigate } from "react-router-dom";
import profileIcon from "../assets/icon.jpg";
import Header from "../components/Header";
import Footer from "../components/Footer";

const ProfilePage = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);

    const [activeSection, setActiveSection] = useState("profile");
    const [originalUserInfo, setOriginalUserInfo] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
    });
    const [editableUserInfo, setEditableUserInfo] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
    });
    const [favoriteProducts, setFavoriteProducts] = useState([]);
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    useEffect(() => {
        const userId = localStorage.getItem("userId");
        if (userId) {
            fetch(`http://localhost:5000/api/user/${userId}`)
                .then((res) => res.json())
                .then((data) => {
                    const userInfo = {
                        firstName: data.first_name,
                        lastName: data.last_name,
                        email: data.email,
                        phone: data.phone,
                    };
                    setOriginalUserInfo(userInfo);
                    setEditableUserInfo(userInfo);
                })
                .catch((err) =>
                    console.error("Помилка завантаження профілю:", err)
                );

            fetch(`http://localhost:5000/api/favorites/products/${userId}`)
                .then((res) => res.json())
                .then((data) => setFavoriteProducts(data))
                .catch((err) =>
                    console.error(
                        "Помилка завантаження улюблених товарів:",
                        err
                    )
                );
        }
    }, []);

    useEffect(() => {
        if (window.location.hash === "#wishlist") {
            setActiveSection("favorites");
        }
    }, []);

    useEffect(() => {
        // Перевірка авторизації
        const isLoggedIn = localStorage.getItem("isLoggedIn");
        if (!isLoggedIn) {
            navigate("/login");
        }
    }, [navigate]);

    useEffect(() => {
        if (window.location.hash === "#orders") {
            setActiveSection("orders");
        }
    }, []);

    useEffect(() => {
        const handleSwitchSection = (event) => {
            const { section } = event.detail;
            setActiveSection(section);
        };

        window.addEventListener("switchSection", handleSwitchSection);

        return () => {
            window.removeEventListener("switchSection", handleSwitchSection);
        };
    }, []);

    useEffect(() => {
        const userId = localStorage.getItem("userId");
        if (userId) {
            fetch(`http://localhost:5000/api/orders/history/${userId}`)
                .then((res) => res.json())
                .then((data) => setOrders(data))
                .catch((err) =>
                    console.error("Помилка завантаження замовлень:", err)
                );
        }
    }, []);

    const handlePasswordChange = async () => {
        const userId = localStorage.getItem("userId");
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert("Паролі не співпадають!");
            return;
        }
        try {
            const response = await fetch(
                "http://localhost:5000/api/user/change-password",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        userId,
                        currentPassword: passwordData.currentPassword,
                        newPassword: passwordData.newPassword,
                    }),
                }
            );
            if (!response.ok) throw new Error("Помилка зміни пароля");
            alert("Пароль успішно змінено!");
            setActiveSection("profile");
        } catch (error) {
            console.error(error);
            alert("Помилка зміни пароля!");
        }
    };

    const handleProfileUpdate = async () => {
        const userId = localStorage.getItem("userId");
        try {
            const response = await fetch(
                "http://localhost:5000/api/user/update",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userId, ...editableUserInfo }),
                }
            );
            if (!response.ok) throw new Error("Помилка оновлення профілю");
            alert("Профіль успішно оновлено!");
            setOriginalUserInfo(editableUserInfo);
            setActiveSection("profile");
        } catch (error) {
            console.error(error);
            alert("Помилка оновлення профілю!");
        }
    };

    const handleCancelEdit = () => {
        setEditableUserInfo(originalUserInfo);
        setActiveSection("profile");
    };

    const clearCart = async () => {
        try {
            const response = await fetch(
                "http://localhost:5000/api/cart/clear",
                {
                    method: "POST",
                }
            );

            if (!response.ok) {
                throw new Error("Помилка очищення кошика на сервері.");
            }

            console.log("Кошик успішно очищено.");
        } catch (error) {
            console.error("Помилка очищення кошика:", error);
            alert("Не вдалося очистити кошик. Спробуйте ще раз.");
        }
    };

    const handleRemoveFavorite = (productId) => {
        const userId = localStorage.getItem("userId");
        fetch("http://localhost:5000/api/favorites/remove", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, productId }),
        })
            .then((res) => {
                if (!res.ok) throw new Error("Не вдалося видалити товар");
                setFavoriteProducts((prev) =>
                    prev.filter((item) => item.id !== productId)
                );
            })
            .catch((err) => console.error("Помилка видалення товару:", err));
    };

    const renderSection = () => {
        switch (activeSection) {
            case "profile":
                return (
                    <div className="profile-info">
                        <h2>ПРОФІЛЬ</h2>
                        <div className="profile-details">
                            <div className="profile-row">
                                <p className="label">Ім'я та прізвище:</p>
                                <p className="value">
                                    {originalUserInfo.firstName}{" "}
                                    {originalUserInfo.lastName}
                                </p>
                            </div>
                            <div className="profile-row">
                                <p className="label">Email:</p>
                                <p className="value">
                                    {originalUserInfo.email}
                                </p>
                            </div>
                            <div className="profile-row">
                                <p className="label">Телефон:</p>
                                <p className="value">
                                    {originalUserInfo.phone}
                                </p>
                            </div>
                        </div>
                        <div className="profile-buttons">
                            <button
                                onClick={() => setActiveSection("password")}
                            >
                                ЗМІНИТИ ПАРОЛЬ
                            </button>
                            <button
                                onClick={() => setActiveSection("edit-profile")}
                            >
                                РЕДАГУВАТИ
                            </button>
                        </div>
                    </div>
                );
            case "favorites":
                return (
                    <div className="favorites">
                        <h2>УЛЮБЛЕНЕ</h2>
                        <div className="favorite-items">
                            {favoriteProducts.length > 0 ? (
                                favoriteProducts.map((product) => (
                                    <div
                                        key={product.id}
                                        className="favorite-item"
                                    >
                                        <img
                                            src={`http://localhost:5000${product.photo_path}`}
                                            alt={product.name}
                                        />
                                        <p>{product.name}</p>
                                        <button
                                            onClick={() =>
                                                handleRemoveFavorite(product.id)
                                            }
                                        >
                                            Видалити з обраного
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p>У вас немає улюблених товарів.</p>
                            )}
                        </div>
                    </div>
                );
            case "password":
                return (
                    <div className="password-change">
                        <h2>ЗМІНА ПАРОЛЯ</h2>
                        <div className="form-group">
                            <label htmlFor="currentPassword">
                                Поточний пароль
                            </label>
                            <input
                                type="password"
                                id="currentPassword"
                                placeholder="Поточний пароль"
                                value={passwordData.currentPassword}
                                onChange={(e) =>
                                    setPasswordData({
                                        ...passwordData,
                                        currentPassword: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="newPassword">Новий пароль</label>
                            <input
                                type="password"
                                id="newPassword"
                                placeholder="Новий пароль"
                                value={passwordData.newPassword}
                                onChange={(e) =>
                                    setPasswordData({
                                        ...passwordData,
                                        newPassword: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="confirmPassword">
                                Повторіть новий пароль
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                placeholder="Повторіть новий пароль"
                                value={passwordData.confirmPassword}
                                onChange={(e) =>
                                    setPasswordData({
                                        ...passwordData,
                                        confirmPassword: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div className="password-change-buttons">
                            <button
                                className="save-btn"
                                onClick={handlePasswordChange}
                            >
                                Зберегти
                            </button>
                            <button
                                className="cancel-btn"
                                onClick={() => setActiveSection("profile")}
                            >
                                Відмінити
                            </button>
                        </div>
                    </div>
                );
            case "orders":
                return (
                    <div className="orders-history">
                        <h2>МОЇ ЗАМОВЛЕННЯ</h2>
                        {orders.length > 0 ? (
                            orders.map((order) => (
                                <div
                                    key={order.order_id}
                                    className="order-item"
                                >
                                    <h3>
                                        Замовлення #{order.order_id} від{" "}
                                        {new Date(
                                            order.created_at
                                        ).toLocaleDateString()}
                                    </h3>
                                    <p>Статус: {order.status}</p>
                                    <p>
                                        Відділення Нової Пошти:{" "}
                                        {order.post_office || "Не вказано"}
                                    </p>
                                    <p>
                                        Загальна вартість:{" "}
                                        {order.total_price.toFixed(2)} ₴
                                    </p>
                                    <div className="order-products">
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Товар</th>
                                                    <th>Кількість</th>
                                                    <th>Вартість (за од.)</th>
                                                    <th>Ціна</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {order.items.map((item) => (
                                                    <tr key={item.product_id}>
                                                        <td>
                                                            {item.product_name}
                                                        </td>
                                                        <td>{item.quantity}</td>
                                                        <td>{item.price} ₴</td>
                                                        <td>
                                                            {(
                                                                item.price *
                                                                item.quantity
                                                            ).toFixed(2)}{" "}
                                                            ₴
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>У вас немає замовлень.</p>
                        )}
                    </div>
                );

            case "edit-profile":
                return (
                    <div className="edit-profile">
                        <h2>РЕДАГУВАННЯ ПРОФІЛЮ</h2>
                        <div className="form-group">
                            <label htmlFor="firstName">Ім'я</label>
                            <input
                                type="text"
                                id="firstName"
                                placeholder="Ім'я"
                                value={editableUserInfo.firstName}
                                onChange={(e) =>
                                    setEditableUserInfo({
                                        ...editableUserInfo,
                                        firstName: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="lastName">Прізвище</label>
                            <input
                                type="text"
                                id="lastName"
                                placeholder="Прізвище"
                                value={editableUserInfo.lastName}
                                onChange={(e) =>
                                    setEditableUserInfo({
                                        ...editableUserInfo,
                                        lastName: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                placeholder="Email"
                                value={editableUserInfo.email}
                                onChange={(e) =>
                                    setEditableUserInfo({
                                        ...editableUserInfo,
                                        email: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="phone">Телефон</label>
                            <input
                                type="text"
                                id="phone"
                                placeholder="Телефон"
                                value={editableUserInfo.phone}
                                onChange={(e) =>
                                    setEditableUserInfo({
                                        ...editableUserInfo,
                                        phone: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div className="edit-profile-buttons">
                            <button
                                className="save-btn"
                                onClick={handleProfileUpdate}
                            >
                                Зберегти
                            </button>
                            <button
                                className="cancel-btn"
                                onClick={handleCancelEdit}
                            >
                                Відмінити
                            </button>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    const handleCartClick = () => {
        navigate("/products?openCart=true");
    };

    return (
        <div className="page-container">
            <Header onCartClick={handleCartClick} />
            <div className="content-wrapper">
                <div className="profile-page">
                    <div className="sidebar">
                        <div className="profile-header">
                            <div className="profile-icon">
                                <img src={profileIcon} alt="profile-icon" />
                            </div>
                            <div className="profile-name-email">
                                <p className="profile-name">
                                    {originalUserInfo.firstName}{" "}
                                    {originalUserInfo.lastName}
                                </p>
                                <p className="profile-email">
                                    {originalUserInfo.email}
                                </p>
                            </div>
                        </div>

                        <button
                            className={
                                activeSection === "profile" ? "active" : ""
                            }
                            onClick={() => setActiveSection("profile")}
                        >
                            Профіль
                        </button>
                        <button
                            className={
                                activeSection === "favorites" ? "active" : ""
                            }
                            onClick={() => setActiveSection("favorites")}
                        >
                            Улюблене
                        </button>
                        <button
                            className={
                                activeSection === "orders" ? "active" : ""
                            }
                            onClick={() => setActiveSection("orders")}
                        >
                            Мої замовлення
                        </button>

                        <button
                            className="logout"
                            onClick={async () => {
                                await clearCart(); // Викликаємо функцію очищення кошика
                                localStorage.removeItem("isLoggedIn");
                                localStorage.removeItem("userId");
                                navigate("/login"); // Перенаправлення на сторінку входу
                            }}
                        >
                            Вийти
                        </button>
                    </div>
                    <div className="content">{renderSection()}</div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ProfilePage;
