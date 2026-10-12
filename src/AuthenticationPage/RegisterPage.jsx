import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./AuthenticationPage.css";

const RegisterPage = () => {
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleRegister = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert("Паролі не співпадають!");
            return;
        }

        const userData = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            phone: phone,
            password: password,
        };

        try {
            const response = await fetch("http://localhost:5000/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userData),
            });

            const result = await response.json();
            if (response.ok) {
                alert("Реєстрація успішна!");
                navigate("/login");
            } else {
                alert(result.error);
            }
        } catch (error) {
            console.error("Помилка реєстрації:", error);
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
                    <h2>Реєстрація</h2>
                    <form onSubmit={handleRegister}>
                        <label>Ім'я</label>
                        <input
                            type="text"
                            placeholder="Введіть ім'я"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                        <label>Прізвище</label>
                        <input
                            type="text"
                            placeholder="Введіть прізвище"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                        <label>Номер телефону</label>
                        <input
                            type="text"
                            placeholder="Введіть номер телефону"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                        <label>Email</label>
                        <input
                            type="email"
                            placeholder="Введіть email"
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
                        <label>Повторіть пароль</label>
                        <input
                            type="password"
                            placeholder="Повторіть пароль"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <button type="submit" className="submit-btn">
                            Зареєструватись
                        </button>
                    </form>
                    <p>
                        Вже маєте обліковий запис?{" "}
                        <button
                            className="link-button"
                            onClick={() => navigate("/login")}
                        >
                            Увійти
                        </button>
                    </p>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default RegisterPage;
