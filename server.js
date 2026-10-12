import express from "express";
import cors from "cors";
import sqlite3 from "sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt";

const app = express();
const PORT = 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new sqlite3.Database("./src/db/database.db");

app.use(cors());
app.use(express.json());

app.use("/assets", express.static(path.join(__dirname, "src", "assets")));

// API для категорій
app.get("/api/categories", (req, res) => {
    const query = `
        SELECT c.id as category_id, c.name as category_name, 
               sc.id as subcategory_id, sc.name as subcategory_name
        FROM Categories c
        LEFT JOIN Subcategories sc ON c.id = sc.category_id
        ORDER BY c.id, sc.id;
    `;
    db.all(query, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: "Не вдалося отримати категорії" });
        } else {
            const categories = rows.reduce((acc, row) => {
                const category = acc.find((c) => c.id === row.category_id);
                if (!category) {
                    acc.push({
                        id: row.category_id,
                        name: row.category_name,
                        subcategories: row.subcategory_id
                            ? [
                                  {
                                      id: row.subcategory_id,
                                      name: row.subcategory_name,
                                  },
                              ]
                            : [],
                    });
                } else if (row.subcategory_id) {
                    category.subcategories.push({
                        id: row.subcategory_id,
                        name: row.subcategory_name,
                    });
                }
                return acc;
            }, []);
            res.json(categories);
        }
    });
});

app.get("/api/products", (req, res) => {
    const { category, subcategory } = req.query;

    let query = `
        SELECT p.*, 
               s.name as subcategory_name, 
               c.name as category_name,
               st.quantity as stock_quantity
        FROM Products p
        JOIN Subcategories s ON p.subcategory_id = s.id
        JOIN Categories c ON s.category_id = c.id
        LEFT JOIN Stock st ON p.id = st.product_id
    `;
    const params = [];
    if (category) {
        query += " WHERE c.id = ?";
        params.push(category);
    }
    if (subcategory) {
        query += category ? " AND s.id = ?" : " WHERE s.id = ?";
        params.push(subcategory);
    }

    db.all(query, params, (err, rows) => {
        if (err) {
            res.status(500).json({ error: "Не вдалося отримати товари" });
        } else {
            res.json(rows);
        }
    });
});

// API для роботи з кошиком
app.get("/api/cart", (req, res) => {
    const query = `
        SELECT 
            c.product_id, 
            c.quantity, 
            p.name, 
            p.price, 
            p.photo_path, 
            st.quantity AS stock_quantity
        FROM Cart c
        JOIN Products p ON c.product_id = p.id
        LEFT JOIN Stock st ON p.id = st.product_id;
    `;
    db.all(query, [], (err, rows) => {
        if (err) {
            return res
                .status(500)
                .json({ error: "Failed to fetch cart items." });
        }
        res.json(rows);
    });
});

app.post("/api/cart", (req, res) => {
    const { product_id, quantity } = req.body;

    if (!product_id || !quantity || quantity <= 0) {
        return res
            .status(400)
            .json({ error: "Неправильні дані для додавання до кошика." });
    }

    const querySelect = `SELECT * FROM Cart WHERE product_id = ?`;
    db.get(querySelect, [product_id], (err, row) => {
        if (err) {
            return res
                .status(500)
                .json({ error: "Помилка при перевірці товару в кошику." });
        }

        if (row) {
            const newQuantity = row.quantity + quantity;
            const queryUpdate = `UPDATE Cart SET quantity = ? WHERE product_id = ?`;
            db.run(queryUpdate, [newQuantity, product_id], (err) => {
                if (err) {
                    return res.status(500).json({
                        error: "Помилка при оновленні товару в кошику.",
                    });
                }
                res.json({ message: "Товар оновлено в кошику." });
            });
        } else {
            const queryInsert = `INSERT INTO Cart (product_id, quantity) VALUES (?, ?)`;
            db.run(queryInsert, [product_id, quantity], (err) => {
                if (err) {
                    return res.status(500).json({
                        error: "Помилка при додаванні товару до кошика.",
                    });
                }
                res.json({ message: "Товар додано до кошика." });
            });
        }
    });
});

app.post("/api/cart/update", (req, res) => {
    const { product_id, quantity } = req.body;

    if (!product_id || quantity < 1) {
        return res.status(400).json({ error: "Invalid product data." });
    }

    const query = `UPDATE Cart SET quantity = ? WHERE product_id = ?`;
    db.run(query, [quantity, product_id], (err) => {
        if (err) {
            return res
                .status(500)
                .json({ error: "Failed to update cart item." });
        }
        res.json({ message: "Cart item updated successfully." });
    });
});

app.post("/api/cart/remove", (req, res) => {
    const { product_id } = req.body;

    if (!product_id) {
        return res.status(400).json({ error: "Invalid product ID." });
    }

    const query = `DELETE FROM Cart WHERE product_id = ?`;
    db.run(query, [product_id], (err) => {
        if (err) {
            console.error("Error removing cart item:", err);
            return res
                .status(500)
                .json({ error: "Failed to remove product from cart." });
        }
        res.json({ message: "Product removed from cart." });
    });
});

app.post("/api/cart/clear", (req, res) => {
    const query = `DELETE FROM Cart`;
    db.run(query, [], (err) => {
        if (err) {
            return res
                .status(500)
                .json({ error: "Не вдалося очистити кошик." });
        }
        res.json({ message: "Кошик очищено успішно." });
    });
});

// API для збереження замовлення
app.post("/api/orders", (req, res) => {
    const {
        email,
        firstName,
        lastName,
        phone,
        country,
        city,
        comment,
        totalPrice,
        postOffice,
    } = req.body;

    const queryUser = `SELECT id FROM Users WHERE email = ?`;
    db.get(queryUser, [email], (err, user) => {
        let userId = null;

        if (err) {
            console.error("Помилка доступу до бази даних:", err);
        } else if (user) {
            userId = user.id;
        }

        const queryOrder = `
            INSERT INTO Orders (user_id, first_name, last_name, phone, email, country, city, comment, total_price, post_office, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Новий') -- Встановлення статусу "Новий"
        `;
        db.run(
            queryOrder,
            [
                userId,
                firstName,
                lastName,
                phone,
                email,
                country,
                city,
                comment,
                totalPrice,
                postOffice,
            ],
            function (err) {
                if (err) {
                    console.error("Помилка створення замовлення:", err);
                    return res
                        .status(500)
                        .json({ error: "Не вдалося створити замовлення." });
                }

                const orderId = this.lastID;

                const cartQuery = `
                    SELECT product_id, quantity, price 
                    FROM Cart 
                    JOIN Products ON Cart.product_id = Products.id
                `;
                db.all(cartQuery, [], (err, cartItems) => {
                    if (err || !cartItems.length) {
                        console.error(
                            "Помилка отримання товарів з кошика:",
                            err
                        );
                        return res.status(500).json({
                            error: "Не вдалося отримати товари з кошика.",
                        });
                    }

                    const orderItemsQuery = `
                        INSERT INTO OrderItems (order_id, product_id, quantity, price) 
                        VALUES (?, ?, ?, ?)
                    `;

                    cartItems.forEach((item) => {
                        db.run(orderItemsQuery, [
                            orderId,
                            item.product_id,
                            item.quantity,
                            item.price,
                        ]);

                        const updateStockQuery = `
                            UPDATE Stock 
                            SET quantity = quantity - ? 
                            WHERE product_id = ? AND quantity >= ?
                        `;
                        db.run(
                            updateStockQuery,
                            [item.quantity, item.product_id, item.quantity],
                            (err) => {
                                if (err) {
                                    console.error(
                                        `Помилка оновлення залишків для товару ${item.product_id}:`,
                                        err
                                    );
                                }
                            }
                        );
                    });

                    db.run("DELETE FROM Cart", [], (err) => {
                        if (err) {
                            console.error("Помилка очищення кошика:", err);
                            return res.status(500).json({
                                error: "Не вдалося очистити кошик.",
                            });
                        }
                        res.json({
                            message: "Замовлення успішно створено.",
                            orderId,
                        });
                    });
                });
            }
        );
    });
});

// API для отримання замовлень користувача
app.get("/api/orders/history/:userId", (req, res) => {
    const userId = req.params.userId;

    const query = `
        SELECT o.id AS order_id, o.created_at, o.total_price, o.status, o.post_office, 
            oi.product_id, oi.quantity, oi.price AS item_price, 
            p.name AS product_name
        FROM Orders o
        JOIN OrderItems oi ON o.id = oi.order_id
        JOIN Products p ON oi.product_id = p.id
        WHERE o.user_id = ?
        ORDER BY o.created_at DESC;
    `;
    db.all(query, [userId], (err, rows) => {
        if (err) {
            return res
                .status(500)
                .json({ error: "Не вдалося отримати історію замовлень." });
        }

        // Групуємо замовлення за order_id
        const orders = rows.reduce((acc, row) => {
            const order = acc.find((o) => o.order_id === row.order_id);
            if (!order) {
                acc.push({
                    order_id: row.order_id,
                    created_at: row.created_at,
                    total_price: row.total_price,
                    post_office: row.post_office,
                    status: row.status,
                    items: [
                        {
                            product_id: row.product_id,
                            product_name: row.product_name,
                            quantity: row.quantity,
                            price: row.item_price,
                        },
                    ],
                });
            } else {
                order.items.push({
                    product_id: row.product_id,
                    product_name: row.product_name,
                    quantity: row.quantity,
                    price: row.item_price,
                });
            }
            return acc;
        }, []);

        res.json(orders);
    });
});

app.post("/api/register", (req, res) => {
    const { firstName, lastName, email, phone, password } = req.body;

    if (!firstName || !lastName || !email || !phone || !password) {
        return res.status(400).json({ error: "Всі поля є обов'язковими." });
    }

    // Хешування пароля
    const saltRounds = 10;

    bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
        if (err) {
            return res.status(500).json({ error: "Помилка хешування пароля." });
        }

        const query = `
            INSERT INTO Users (first_name, last_name, email, phone, password)
            VALUES (?, ?, ?, ?, ?)
        `;
        db.run(
            query,
            [firstName, lastName, email, phone, hashedPassword],
            function (err) {
                if (err) {
                    if (err.message.includes("UNIQUE")) {
                        return res
                            .status(400)
                            .json({ error: "Email або телефон вже існує." });
                    }
                    return res.status(500).json({
                        error: "Не вдалося зареєструвати користувача.",
                    });
                }
                res.json({
                    message: "Реєстрація успішна.",
                    userId: this.lastID,
                });
            }
        );
    });
});

app.post("/api/login", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email і пароль обов'язкові." });
    }

    const query = `SELECT * FROM Users WHERE email = ?`;
    db.get(query, [email], (err, user) => {
        if (err) {
            return res
                .status(500)
                .json({ error: "Помилка доступу до бази даних." });
        }

        if (!user) {
            return res.status(404).json({ error: "Користувача не знайдено." });
        }

        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                return res
                    .status(500)
                    .json({ error: "Помилка перевірки пароля." });
            }

            if (!isMatch) {
                return res.status(401).json({ error: "Невірний пароль." });
            }

            res.json({
                message: "Авторизація успішна.",
                user: {
                    id: user.id,
                    firstName: user.first_name,
                    lastName: user.last_name,
                    email: user.email,
                    phone: user.phone,
                    role: user.role,
                },
            });
        });
    });
});

app.get("/api/user/:id", (req, res) => {
    const userId = req.params.id;

    const query = `SELECT id, first_name, last_name, email, phone FROM Users WHERE id = ?`;
    db.get(query, [userId], (err, user) => {
        if (err) {
            return res
                .status(500)
                .json({ error: "Не вдалося отримати дані користувача." });
        }

        if (!user) {
            return res.status(404).json({ error: "Користувача не знайдено." });
        }

        res.json(user);
    });
});

// Отримати всі улюблені товари користувача
app.get("/api/favorites/:userId", (req, res) => {
    const { userId } = req.params;
    const query = `SELECT product_id FROM Favorites WHERE user_id = ?`;

    db.all(query, [userId], (err, rows) => {
        if (err) {
            console.error("Error fetching favorites:", err.message);
            return res.status(500).json({ error: "Failed to fetch favorites" });
        }
        res.json(rows);
    });
});

// Додати товар до улюбленого
app.post("/api/favorites/add", (req, res) => {
    const { userId, productId } = req.body;
    if (!userId || !productId) {
        console.error("Invalid data for add favorite:", req.body);
        return res.status(400).json({ error: "Invalid data" });
    }

    const query = `INSERT INTO Favorites (user_id, product_id) VALUES (?, ?)`;
    db.run(query, [userId, productId], (err) => {
        if (err) {
            console.error("Error adding favorite:", err.message);
            return res.status(500).json({ error: "Failed to add favorite" });
        }
        res.json({ message: "Product added to favorites" });
    });
});

app.post("/api/favorites/remove", (req, res) => {
    const { userId, productId } = req.body;
    console.log("Remove Favorite Request:", { userId, productId });
    if (!userId || !productId) {
        console.error("Invalid data for remove favorite:", req.body);
        return res.status(400).json({ error: "Invalid data" });
    }

    const query = `DELETE FROM Favorites WHERE user_id = ? AND product_id = ?`;
    db.run(query, [userId, productId], (err) => {
        if (err) {
            console.error("Error removing favorite:", err.message);
            return res.status(500).json({ error: "Failed to remove favorite" });
        }
        res.json({ message: "Product removed from favorites" });
    });
});

app.get("/api/favorites/products/:userId", (req, res) => {
    const { userId } = req.params;
    const query = `
        SELECT p.id, p.name, p.photo_path
        FROM Favorites f
        JOIN Products p ON f.product_id = p.id
        WHERE f.user_id = ?
    `;

    db.all(query, [userId], (err, rows) => {
        if (err) {
            console.error("Помилка завантаження улюблених товарів:", err);
            return res
                .status(500)
                .json({ error: "Не вдалося завантажити улюблені товари." });
        }
        res.json(rows);
    });
});

app.post("/api/user/change-password", (req, res) => {
    const { userId, currentPassword, newPassword } = req.body;
    const query = `SELECT password FROM Users WHERE id = ?`;

    db.get(query, [userId], (err, user) => {
        if (err || !user) {
            return res.status(500).json({ error: "Користувача не знайдено." });
        }

        bcrypt.compare(currentPassword, user.password, (err, isMatch) => {
            if (!isMatch) {
                return res
                    .status(401)
                    .json({ error: "Невірний поточний пароль." });
            }

            bcrypt.hash(newPassword, 10, (err, hashedPassword) => {
                if (err)
                    return res
                        .status(500)
                        .json({ error: "Помилка хешування пароля." });

                const updateQuery = `UPDATE Users SET password = ? WHERE id = ?`;
                db.run(updateQuery, [hashedPassword, userId], (err) => {
                    if (err)
                        return res
                            .status(500)
                            .json({ error: "Помилка оновлення пароля." });
                    res.json({ message: "Пароль успішно змінено." });
                });
            });
        });
    });
});

app.post("/api/user/update", (req, res) => {
    const { userId, firstName, lastName, email, phone } = req.body;
    const query = `UPDATE Users SET first_name = ?, last_name = ?, email = ?, phone = ? WHERE id = ?`;

    db.run(query, [firstName, lastName, email, phone, userId], (err) => {
        if (err)
            return res
                .status(500)
                .json({ error: "Не вдалося оновити профіль." });
        res.json({ message: "Дані профілю успішно оновлено." });
    });
});

app.get("/api/products/special-offers", (req, res) => {
    const query = `
        SELECT p.id, p.name, p.description, p.price, p.photo_path
        FROM Products p
        WHERE p.id IN (
            SELECT product_id
            FROM Stock
            WHERE quantity > 0
            ORDER BY RANDOM()
            LIMIT 4
        )
    `;

    db.all(query, [], (err, rows) => {
        if (err) {
            console.error("Error fetching special offers:", err);
            return res
                .status(500)
                .json({ error: "Не вдалося отримати спеціальні пропозиції." });
        }
        res.json(rows);
    });
});

app.put("/api/products/:id", (req, res) => {
    const { id } = req.params;
    const { name, description, price, quantity, photo } = req.body;

    const query = `
        UPDATE Products 
        SET name = ?, description = ?, price = ?, photo_path = ? 
        WHERE id = ?
    `;

    const stockQuery = `
        UPDATE Stock 
        SET quantity = ? 
        WHERE product_id = ?
    `;

    db.run(query, [name, description, price, photo, id], (err) => {
        if (err) {
            return res
                .status(500)
                .json({ error: "Помилка оновлення продукту" });
        }

        db.run(stockQuery, [quantity, id], (err) => {
            if (err) {
                return res
                    .status(500)
                    .json({ error: "Помилка оновлення кількості товару" });
            }
            res.json({ message: "Товар успішно оновлено" });
        });
    });
});

// Маршрут для додавання нового товару
app.post("/api/products", (req, res) => {
    const { name, description, price, quantity, photo, subcategoryId } =
        req.body;

    if (
        !name ||
        !description ||
        !price ||
        !quantity ||
        !photo ||
        !subcategoryId
    ) {
        return res
            .status(400)
            .json({ error: "Будь ласка, заповніть всі обов'язкові поля." });
    }

    const insertProductQuery = `
        INSERT INTO Products (name, description, price, photo_path, subcategory_id)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.run(
        insertProductQuery,
        [name, description, price, photo, subcategoryId],
        function (err) {
            if (err) {
                console.error("Помилка додавання товару в Products:", err);
                return res
                    .status(500)
                    .json({ error: "Не вдалося додати товар." });
            }

            const productId = this.lastID;

            const insertStockQuery = `
                INSERT INTO Stock (product_id, quantity)
                VALUES (?, ?)
            `;

            db.run(insertStockQuery, [productId, quantity], (err) => {
                if (err) {
                    console.error("Помилка додавання кількості в Stock:", err);
                    return res
                        .status(500)
                        .json({ error: "Не вдалося додати кількість товару." });
                }

                res.json({ message: "Товар успішно додано.", productId });
            });
        }
    );
});

// API маршрут для видалення товару
app.delete("/api/products/:id", (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: "ID товару є обов'язковим." });
    }

    // Видалення товару з таблиці Stock
    const deleteStockQuery = `DELETE FROM Stock WHERE product_id = ?`;
    db.run(deleteStockQuery, [id], (err) => {
        if (err) {
            console.error("Помилка видалення товару з Stock:", err);
            return res
                .status(500)
                .json({ error: "Не вдалося видалити товар із складу." });
        }

        // Видалення товару з таблиці Products
        const deleteProductQuery = `DELETE FROM Products WHERE id = ?`;
        db.run(deleteProductQuery, [id], (err) => {
            if (err) {
                console.error("Помилка видалення товару з Products:", err);
                return res
                    .status(500)
                    .json({ error: "Не вдалося видалити товар." });
            }
        });
    });
});

app.get("/api/orders", (req, res) => {
    const query = `
        SELECT o.id AS order_id, o.created_at, o.total_price, o.first_name, o.last_name, 
            o.phone, o.email, o.country, o.city, o.post_office, o.comment, o.status,
            oi.product_id, oi.quantity, oi.price AS item_price, 
            p.name AS product_name
        FROM Orders o
        LEFT JOIN OrderItems oi ON o.id = oi.order_id
        LEFT JOIN Products p ON oi.product_id = p.id
        ORDER BY o.created_at DESC
    `;

    db.all(query, [], (err, rows) => {
        if (err) {
            console.error("Помилка отримання замовлень:", err);
            return res
                .status(500)
                .json({ error: "Не вдалося отримати замовлення." });
        }

        // Групуємо замовлення за order_id
        const orders = rows.reduce((acc, row) => {
            const order = acc.find((o) => o.order_id === row.order_id);
            if (!order) {
                acc.push({
                    order_id: row.order_id,
                    created_at: row.created_at,
                    total_price: row.total_price,
                    first_name: row.first_name,
                    last_name: row.last_name,
                    phone: row.phone,
                    email: row.email,
                    country: row.country,
                    city: row.city,
                    post_office: row.post_office,
                    comment: row.comment,
                    status: row.status,
                    items: [
                        {
                            product_id: row.product_id,
                            product_name: row.product_name,
                            quantity: row.quantity,
                            price: row.item_price,
                        },
                    ],
                });
            } else {
                order.items.push({
                    product_id: row.product_id,
                    product_name: row.product_name,
                    quantity: row.quantity,
                    price: row.item_price,
                });
            }
            return acc;
        }, []);

        res.json(orders);
    });
});

app.delete("/api/orders/:id", (req, res) => {
    const { id } = req.params;

    console.log("Отримано запит на видалення замовлення з ID:", id);

    const deleteOrderItemsQuery = "DELETE FROM OrderItems WHERE order_id = ?";
    const deleteOrderQuery = "DELETE FROM Orders WHERE id = ?";

    db.run(deleteOrderItemsQuery, [id], (err) => {
        if (err) {
            console.error("Помилка видалення товарів із замовлення:", err);
            return res
                .status(500)
                .json({ error: "Не вдалося видалити товари із замовлення." });
        }

        db.run(deleteOrderQuery, [id], (err) => {
            if (err) {
                console.error("Помилка видалення замовлення:", err);
                return res
                    .status(500)
                    .json({ error: "Не вдалося видалити замовлення." });
            }
            console.log("Замовлення успішно видалено:", id);
            res.json({ message: "Замовлення успішно видалено." });
        });
    });
});

app.put("/api/orders/:id", (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const query = `UPDATE Orders SET status = ? WHERE id = ?`;
    db.run(query, [status, id], function (err) {
        if (err) {
            console.error("Помилка оновлення статусу замовлення:", err);
            return res
                .status(500)
                .json({ error: "Не вдалося оновити статус замовлення." });
        }
        res.json({ message: "Статус замовлення оновлено успішно." });
    });
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер працює на порту ${PORT}`);
});
