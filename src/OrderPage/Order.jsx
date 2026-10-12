import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./Order.css";
import "../CartPage/Cart.css";

const OrderPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const [orderDetails, setOrderDetails] = useState({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        country: "Україна",
        city: "",
        postOffice: "",
        comment: "",
    });
    const navigate = useNavigate();
    const [manualQuantities, setManualQuantities] = useState({});

    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/cart");
                if (!response.ok)
                    throw new Error("Failed to fetch cart items.");
                const data = await response.json();
                setCartItems(data);

                // 🔽 Ініціалізуємо локальні кількості для input
                const quantities = {};
                data.forEach((item) => {
                    quantities[item.product_id] = item.quantity;
                });
                setManualQuantities(quantities);
            } catch (error) {
                console.error("Error fetching cart items:", error);
            }
        };

        fetchCartItems();
    }, []);

    const calculateTotal = () =>
        cartItems.reduce(
            (total, item) => total + item.price * item.quantity,
            0
        );

    const handleManualQuantityChange = async (product_id, value) => {
        const updatedCart = cartItems.map((item) =>
            item.product_id === product_id ? { ...item, quantity: value } : item
        );
        setCartItems(updatedCart);

        try {
            await fetch("http://localhost:5000/api/cart/update", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ product_id, quantity: value }),
            });
        } catch (error) {
            console.error("Помилка ручного оновлення:", error);
        }
    };

    const handleCartQuantityChange = async (product_id, delta) => {
        const updatedCart = cartItems.map((item) => {
            if (item.product_id === product_id) {
                const newQuantity = item.quantity + delta;

                if (newQuantity > item.stock_quantity) {
                    alert(`На складі лише ${item.stock_quantity} шт.`);
                    return item;
                }

                if (newQuantity <= 0) {
                    alert("Кількість не може бути менше 1.");
                    return item;
                }

                return { ...item, quantity: newQuantity };
            }
            return item;
        });

        const updatedItem = updatedCart.find(
            (item) => item.product_id === product_id
        );

        // 🔄 Оновлюємо і cartItems, і manualQuantities
        setCartItems(updatedCart);
        setManualQuantities((prev) => ({
            ...prev,
            [product_id]: updatedItem.quantity,
        }));

        try {
            await fetch("http://localhost:5000/api/cart/update", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    product_id: updatedItem.product_id,
                    quantity: updatedItem.quantity,
                }),
            });
        } catch (error) {
            console.error("Помилка оновлення кількості:", error);
        }
    };

    const handleRemoveFromCart = async (product_id) => {
        const updatedCart = cartItems.filter(
            (item) => item.product_id !== product_id
        );
        setCartItems(updatedCart);

        try {
            await fetch("http://localhost:5000/api/cart/remove", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ product_id }),
            });
        } catch (error) {
            console.error("Error removing cart item:", error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setOrderDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (cartItems.length === 0) {
            alert(
                "Ваш кошик пустий. Додайте товари перед оформленням замовлення."
            );
            navigate("/products");
            return;
        }

        const totalPrice = calculateTotal();

        try {
            const orderResponse = await fetch(
                "http://localhost:5000/api/orders",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        ...orderDetails, // Включаємо postOffice
                        totalPrice,
                        cartItems,
                    }),
                }
            );

            if (!orderResponse.ok) {
                throw new Error("Не вдалося створити замовлення.");
            }

            const orderData = await orderResponse.json();
            await fetch("http://localhost:5000/api/cart/clear", {
                method: "POST",
            });

            setCartItems([]);
            navigate("/order-confirmation", {
                state: { orderId: orderData.orderId, totalPrice },
            });
        } catch (error) {
            console.error("Error placing order:", error.message);
            alert(`Щось пішло не так: ${error.message}`);
        }
    };

    useEffect(() => {
        const userId = localStorage.getItem("userId");

        if (userId) {
            const fetchUserData = async () => {
                try {
                    const response = await fetch(
                        `http://localhost:5000/api/user/${userId}`
                    );
                    if (!response.ok)
                        throw new Error(
                            "Не вдалося отримати дані користувача."
                        );
                    const data = await response.json();
                    setOrderDetails((prevDetails) => ({
                        ...prevDetails,
                        firstName: data.first_name,
                        lastName: data.last_name,
                        phone: data.phone,
                        email: data.email,
                    }));
                } catch (error) {
                    console.error(
                        "Помилка отримання даних користувача:",
                        error
                    );
                }
            };

            fetchUserData();
        }
    }, []);

    useEffect(() => {
        const userId = localStorage.getItem("userId");
        if (userId) {
            fetch(`http://localhost:5000/api/orders/${userId}`)
                .then((res) => res.json())
                .then((data) => setOrders(data))
                .catch((err) => console.error("Error fetching orders:", err));
        }
    }, []);

    const uniqueCartItemsCount = cartItems.length;

    return (
        <div>
            <Header
                uniqueCartItemsCount={uniqueCartItemsCount}
                onCartClick={() => console.log("Cart clicked")}
            />
            <div className="order-container">
                <h1>Оформлення замовлення</h1>
                <div className="order-content">
                    <form className="order-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <input
                                type="text"
                                name="firstName"
                                placeholder="Ім'я"
                                value={orderDetails.firstName}
                                onChange={handleChange}
                                required
                            />
                            <input
                                type="text"
                                name="lastName"
                                placeholder="Прізвище"
                                value={orderDetails.lastName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="tel"
                                name="phone"
                                placeholder="Номер телефону"
                                value={orderDetails.phone}
                                onChange={handleChange}
                                required
                            />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={orderDetails.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <select
                                name="country"
                                value={orderDetails.country}
                                onChange={handleChange}
                                required
                            >
                                <option value="Україна">Україна</option>
                            </select>
                            <input
                                type="text"
                                name="city"
                                placeholder="Місто"
                                value={orderDetails.city}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="text"
                                name="postOffice"
                                placeholder="Відділення Нової пошти"
                                value={orderDetails.postOffice}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Спосіб оплати:</label>
                            <select
                                name="paymentMethod"
                                value={orderDetails.paymentMethod}
                                onChange={handleChange}
                                required
                            >
                                <option value="Готівкою">Готівкою</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <textarea
                                name="comment"
                                placeholder="Додаткові побажання (необов'язково)"
                                value={orderDetails.comment}
                                onChange={handleChange}
                            ></textarea>
                        </div>
                        <button type="submit">Оформити замовлення</button>
                    </form>
                    <div className="order-summary">
                        <h2>Кошик</h2>
                        <div className="cart-items-slider">
                            <div className="cart-items-wrapper">
                                {cartItems.length > 0 ? (
                                    cartItems.map((item) => (
                                        <div
                                            className="cart-item"
                                            key={item.product_id}
                                        >
                                            <img
                                                src={`http://localhost:5000${item.photo_path}`}
                                                alt={item.name}
                                                className="cart-item-image"
                                            />
                                            <div className="cart-item-details">
                                                <h3>{item.name}</h3>
                                                <p>{item.price} грн / шт</p>
                                                <div className="cart-item-quantity">
                                                    <button
                                                        onClick={() =>
                                                            handleCartQuantityChange(
                                                                item.product_id,
                                                                -1
                                                            )
                                                        }
                                                    >
                                                        -
                                                    </button>
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        max={
                                                            item.stock_quantity
                                                        }
                                                        value={
                                                            manualQuantities[
                                                                item.product_id
                                                            ] ?? item.quantity
                                                        }
                                                        onChange={(e) => {
                                                            const rawValue =
                                                                e.target.value;
                                                            const parsed =
                                                                parseInt(
                                                                    rawValue,
                                                                    10
                                                                );
                                                            if (
                                                                !isNaN(parsed)
                                                            ) {
                                                                setManualQuantities(
                                                                    {
                                                                        ...manualQuantities,
                                                                        [item.product_id]:
                                                                            parsed,
                                                                    }
                                                                );
                                                            } else if (
                                                                rawValue === ""
                                                            ) {
                                                                setManualQuantities(
                                                                    {
                                                                        ...manualQuantities,
                                                                        [item.product_id]:
                                                                            "",
                                                                    }
                                                                );
                                                            }
                                                        }}
                                                        onBlur={() => {
                                                            const value =
                                                                manualQuantities[
                                                                    item
                                                                        .product_id
                                                                ];
                                                            const validValue =
                                                                Math.min(
                                                                    Math.max(
                                                                        value ||
                                                                            1,
                                                                        1
                                                                    ),
                                                                    item.stock_quantity
                                                                );

                                                            // 🔔 Показуємо alert, якщо введено більше за наявне
                                                            if (
                                                                value >
                                                                item.stock_quantity
                                                            ) {
                                                                alert(
                                                                    `На складі лише ${item.stock_quantity} шт.`
                                                                );
                                                            }

                                                            handleManualQuantityChange(
                                                                item.product_id,
                                                                validValue
                                                            );
                                                            setManualQuantities(
                                                                {
                                                                    ...manualQuantities,
                                                                    [item.product_id]:
                                                                        validValue,
                                                                }
                                                            );
                                                        }}
                                                        style={{
                                                            width: "40px",
                                                            textAlign: "center",
                                                            border: "none",
                                                            outline: "none",
                                                        }}
                                                    />
                                                    <button
                                                        onClick={() =>
                                                            handleCartQuantityChange(
                                                                item.product_id,
                                                                1
                                                            )
                                                        }
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>
                                            <button
                                                className="remove-button"
                                                onClick={() =>
                                                    handleRemoveFromCart(
                                                        item.product_id
                                                    )
                                                }
                                            >
                                                ✖
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <p>Ваш кошик пустий!</p>
                                )}
                            </div>
                        </div>
                        <div className="total">
                            <p>Загалом: {calculateTotal()} грн</p>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default OrderPage;
