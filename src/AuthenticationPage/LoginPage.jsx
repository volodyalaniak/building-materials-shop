import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./AuthenticationPage.css";

const LoginPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:5000/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const result = await response.json();
            if (response.ok) {
                localStorage.setItem("isLoggedIn", "true");
                localStorage.setItem("userId", result.user.id);
                localStorage.setItem("userRole", result.user.role); // Зберігаємо роль

                // Перевірка ролі
                if (result.user.role === "admin") {
                    navigate("/admin"); // Якщо роль "admin", переадресація на сторінку адміністратора
                } else {
                    navigate("/"); // Інакше на головну сторінку
                }
            } else {
                alert(result.error);
            }
        } catch (error) {
            console.error("Помилка входу:", error);
            alert("Сталася помилка. Спробуйте ще раз.");
        }
    };

    const handleCartClick = () => {
        <Header onCartClick={handleCartClick} />;
    };

    return (
        <div>
            <Header />
            <div className="auth-container">
                <div className="auth-content">
                    <h2>Увійти</h2>
                    <form onSubmit={handleLogin}>
                        <label>Email або номер телефону</label>
                        <input
                            type="text"
                            placeholder="Введіть email або номер телефону"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <label>Пароль</label>
                        <input
                            type="password"
                            placeholder="Введіть пароль"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <div className="auth-options">
                            <label>
                                <input type="checkbox" /> Запам'ятати мене
                            </label>
                        </div>
                        <button type="submit" className="submit-btn">
                            Увійти
                        </button>
                    </form>
                    <p>
                        Немає облікового запису?{" "}
                        <button
                            className="link-button"
                            onClick={() => navigate("/register")}
                        >
                            Зареєструватись
                        </button>
                    </p>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default LoginPage;
