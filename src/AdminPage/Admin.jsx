import React, { useState, useEffect } from "react";
import "./Admin.css";

const AdminPage = () => {
    const [activeSection, setActiveSection] = useState("view");
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [statusFilter, setStatusFilter] = useState("");
    const [currentOrdersPage, setCurrentOrdersPage] = useState(1);
    const ordersPerPage = 10; // Кількість замовлень на сторінку
    const productsPerPage = 10;
    const [newProduct, setNewProduct] = useState({
        name: "",
        description: "",
        price: "",
        quantity: "",
        photo: "",
    });

    const [editingProduct, setEditingProduct] = useState(null);

    const totalPages = Math.ceil(products.length / productsPerPage);

    // Функція для завантаження продуктів
    const fetchProducts = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/products");
            if (!response.ok) {
                throw new Error("Failed to fetch products");
            }
            const data = await response.json();
            setProducts(
                data.map((product) => ({
                    ...product,
                    stock_quantity: product.stock_quantity, // Додайте це, якщо в API є це поле
                }))
            );
            setFilteredProducts(data); // Оновлюємо фільтровані продукти
            setCurrentPage(1); // Повертаємося на першу сторінку
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };
    const fetchOrders = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/orders");
            if (!response.ok)
                throw new Error("Не вдалося завантажити замовлення.");
            const data = await response.json();
            setOrders(data); // Оновлення списку замовлень
        } catch (error) {
            console.error("Помилка завантаження замовлень:", error);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const filteredOrders = orders.filter((order) => {
        return statusFilter ? order.status === statusFilter : true;
    });

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
        setNewProduct((prev) => ({ ...prev, subcategoryId: "" }));
    };

    // Завантаження категорій
    const fetchCategories = async () => {
        try {
            const response = await fetch(
                "http://localhost:5000/api/categories"
            );
            if (!response.ok) throw new Error("Failed to fetch categories");
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const handleAddProductClick = () => {
        setActiveSection("add");
    };

    useEffect(() => {
        fetchCategories();
        fetchProducts();
    }, []);

    useEffect(() => {
        const pages = Math.ceil(filteredProducts.length / productsPerPage);
        setCurrentPage(1); // Переконайтеся, що повертаєтеся на першу сторінку після змін.
    }, [filteredProducts, productsPerPage]);

    useEffect(() => {
        const category = categories.find(
            (cat) => cat.id === parseInt(selectedCategory)
        );
        setSubcategories(category ? category.subcategories : []);
    }, [selectedCategory, categories]);

    const handleProductChange = (e) => {
        const { name, value } = e.target;
        setNewProduct((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        if (
            !newProduct.name ||
            !newProduct.description ||
            !newProduct.price ||
            !newProduct.quantity ||
            !newProduct.photo ||
            !newProduct.subcategoryId
        ) {
            alert("Будь ласка, заповніть всі поля.");
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/api/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newProduct),
            });

            if (!response.ok) throw new Error("Failed to add product");

            await fetchProducts();
            setNewProduct({
                name: "",
                description: "",
                price: "",
                quantity: "",
                photo: "",
                subcategoryId: "",
            });
            setSelectedCategory("");
            setSubcategories([]);
            setActiveSection("view");
        } catch (error) {
            console.error("Error saving product:", error);
        }
    };

    const getPaginatedProducts = () => {
        const startIndex = (currentPage - 1) * productsPerPage;
        const endIndex = startIndex + productsPerPage;
        return filteredProducts.slice(startIndex, endIndex);
    };

    const getPaginatedOrders = () => {
        const startIndex = (currentOrdersPage - 1) * ordersPerPage;
        const endIndex = startIndex + ordersPerPage;
        return filteredOrders.slice(startIndex, endIndex);
    };

    const getOrderPaginationButtons = () => {
        const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
        const buttons = [];
        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) {
                buttons.push(i);
            }
        } else {
            if (currentOrdersPage <= 3) {
                buttons.push(1, 2, 3, 4, "...", totalPages);
            } else if (currentOrdersPage > totalPages - 3) {
                buttons.push(
                    1,
                    "...",
                    totalPages - 3,
                    totalPages - 2,
                    totalPages - 1,
                    totalPages
                );
            } else {
                buttons.push(
                    1,
                    "...",
                    currentOrdersPage - 1,
                    currentOrdersPage,
                    currentOrdersPage + 1,
                    "...",
                    totalPages
                );
            }
        }
        return buttons;
    };

    const handleOrdersPageChange = (page) => {
        setCurrentOrdersPage(page);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Відображення кнопок пагінації
    const getPaginationButtons = () => {
        const totalPages = Math.ceil(filteredProducts.length / productsPerPage); // Використовуємо фільтровані продукти
        const buttons = [];
        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) {
                buttons.push(i);
            }
        } else {
            if (currentPage <= 3) {
                buttons.push(1, 2, 3, 4, "...", totalPages);
            } else if (currentPage > totalPages - 3) {
                buttons.push(
                    1,
                    "...",
                    totalPages - 3,
                    totalPages - 2,
                    totalPages - 1,
                    totalPages
                );
            } else {
                buttons.push(
                    1,
                    "...",
                    currentPage - 1,
                    currentPage,
                    currentPage + 1,
                    "...",
                    totalPages
                );
            }
        }
        return buttons;
    };

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        setFilteredProducts(
            products.filter(
                (product) =>
                    product.name.toLowerCase().includes(query) ||
                    product.description.toLowerCase().includes(query)
            )
        );
        setCurrentPage(1);
    };

    const handleEditProduct = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(
                `http://localhost:5000/api/products/${editingProduct.id}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(newProduct),
                }
            );

            if (!response.ok) {
                throw new Error("Не вдалося оновити товар");
            }

            await fetchProducts();
            setEditingProduct(null);
            setNewProduct({
                name: "",
                description: "",
                price: "",
                quantity: "",
                photo: "",
            });
            setActiveSection("view");
        } catch (error) {
            console.error("Помилка оновлення товару:", error);
        }
    };

    const handleEditButtonClick = (product) => {
        setEditingProduct(product);
        setNewProduct({
            name: product.name,
            description: product.description,
            price: product.price,
            quantity: product.stock_quantity,
            photo: product.photo_path,
        });
        setActiveSection("edit"); // Змінюємо активний розділ на "edit"
    };

    const handleDeleteProduct = async (id) => {
        if (!window.confirm("Ви впевнені, що хочете видалити цей товар?")) {
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:5000/api/products/${id}`,
                {
                    method: "DELETE",
                }
            );

            if (!response.ok) {
                throw new Error("Не вдалося видалити товар");
            }

            await fetchProducts(); // Оновлення списку товарів після видалення
            alert("Товар успішно видалено.");
        } catch (error) {
            console.error("Помилка видалення товару:", error);
            alert("Помилка видалення товару.");
        }
    };
    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            const response = await fetch(
                `http://localhost:5000/api/orders/${orderId}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ status: newStatus }),
                }
            );
            if (!response.ok) throw new Error("Failed to update order status.");
            await fetchOrders(); // Refresh orders
        } catch (error) {
            console.error("Error updating order status:", error);
        }
    };

    const handleDeleteOrder = async (orderId) => {
        if (window.confirm("Ви впевнені, що хочете видалити це замовлення?")) {
            try {
                const response = await fetch(
                    `http://localhost:5000/api/orders/${orderId}`,
                    {
                        method: "DELETE",
                    }
                );
                if (!response.ok)
                    throw new Error("Не вдалося видалити замовлення.");
                await fetchOrders();
                setSelectedOrder(null);
            } catch (error) {
                console.error("Помилка видалення замовлення:", error);
                alert("Сталася помилка при видаленні замовлення.");
            }
        }
    };

    const renderOrders = () => (
        <div className="admin-orders-list">
            {/* Вибір статусу для фільтрації */}
            <div className="admin-header">
                {activeSection === "orders" && (
                    <div className="admin-header-controls">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="status-filter"
                        >
                            <option value="">Усі статуси</option>
                            <option value="Новий">Новий</option>
                            <option value="В обробці">В обробці</option>
                            <option value="Відправлено">Відправлено</option>
                            <option value="Доставлено">Доставлено</option>
                            <option value="Скасовано">Скасовано</option>
                        </select>
                    </div>
                )}
            </div>

            {/* Відображення замовлень з урахуванням пагінації */}
            {getPaginatedOrders().map((order) => (
                <div className="admin-order-row" key={order.id}>
                    <div className="admin-order-info">
                        <div className="admin-order-header">
                            <div>
                                <p>
                                    <strong>
                                        Замовлення #{order.order_id}
                                    </strong>
                                </p>
                                <p>
                                    {new Date(
                                        order.created_at
                                    ).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="admin-order-status">
                                <select
                                    value={order.status}
                                    onChange={(e) =>
                                        updateOrderStatus(
                                            order.order_id,
                                            e.target.value
                                        )
                                    }
                                >
                                    <option value="Новий">Новий</option>
                                    <option value="В обробці">В обробці</option>
                                    <option value="Відправлено">
                                        Відправлено
                                    </option>
                                    <option value="Доставлено">
                                        Доставлено
                                    </option>
                                    <option value="Скасовано">Скасовано</option>
                                </select>
                            </div>
                        </div>
                        <div className="admin-order-details">
                            <p>
                                <strong>Ім'я та прізвище:</strong>{" "}
                                {order.first_name} {order.last_name}
                            </p>
                            <p>
                                <strong>Телефон:</strong> {order.phone}
                            </p>
                            <p>
                                <strong>Email:</strong> {order.email}
                            </p>
                            <p>
                                <strong>Місто:</strong> {order.city}
                            </p>
                            <p>
                                <strong>Відділення Нової пошти:</strong>{" "}
                                {order.post_office || "Не вказано"}
                            </p>
                            <p>
                                <strong>
                                    <a
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            const commentElement =
                                                document.getElementById(
                                                    `comment-${order.order_id}`
                                                );
                                            commentElement.style.display =
                                                commentElement.style.display ===
                                                "block"
                                                    ? "none"
                                                    : "block";
                                        }}
                                    >
                                        Коментар
                                    </a>
                                </strong>
                            </p>
                            <div
                                id={`comment-${order.order_id}`}
                                className="order-comment"
                                style={{ display: "none", marginTop: "10px" }}
                            >
                                <strong>Коментар:</strong>{" "}
                                {order.comment || "Немає коментарів"}
                            </div>
                        </div>
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
                                            <td>{item.product_name}</td>
                                            <td>{item.quantity}</td>
                                            <td>{item.price} ₴</td>
                                            <td>
                                                {(
                                                    item.price * item.quantity
                                                ).toFixed(2)}{" "}
                                                ₴
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="admin-order-actions">
                            <button
                                className="admin-delete-order-button"
                                onClick={() =>
                                    handleDeleteOrder(order.order_id)
                                }
                            >
                                Видалити
                            </button>
                        </div>
                    </div>
                </div>
            ))}

            {/* Пагінація для замовлень */}
            <div className="pagination">
                {getOrderPaginationButtons().map((button, index) =>
                    button === "..." ? (
                        <span key={index} className="pagination-dots">
                            {button}
                        </span>
                    ) : (
                        <button
                            key={index}
                            className={`pagination-button ${
                                currentOrdersPage === button ? "active" : ""
                            }`}
                            onClick={() => handleOrdersPageChange(button)}
                        >
                            {button}
                        </button>
                    )
                )}
            </div>
        </div>
    );

    return (
        <div className="admin-page">
            <aside className="admin-sidebar">
                <h1>Меню адміністратора</h1>
                <button
                    className={activeSection === "view" ? "active" : ""}
                    onClick={() => setActiveSection("view")}
                >
                    Управління товарами
                </button>
                <button
                    className={activeSection === "orders" ? "active" : ""}
                    onClick={() => setActiveSection("orders")}
                >
                    Управління замовленнями
                </button>
                <button
                    className="logout-button"
                    onClick={async () => {
                        localStorage.removeItem("userRole"); // Видалення ролі користувача зі сховища
                        localStorage.removeItem("isLoggedIn");
                        localStorage.removeItem("userId");
                        window.location.reload(); // Оновлення сторінки
                        navigate("/"); // Перенаправлення на головну сторінку
                    }}
                >
                    Вийти
                </button>
            </aside>
            <main className="admin-content">
                <div className="admin-header">
                    <h1>
                        {activeSection === "view"
                            ? "Управління товарами"
                            : "Управління замовленнями"}
                    </h1>
                    {activeSection === "view" && (
                        <div className="admin-header-controls">
                            <input
                                type="text"
                                placeholder="Пошук товарів..."
                                value={searchQuery}
                                onChange={handleSearch}
                                className="search-input"
                            />
                            <button
                                className="admin-add-product-button"
                                onClick={handleAddProductClick}
                            >
                                Додати товар
                            </button>
                        </div>
                    )}
                </div>
                {activeSection === "view" && (
                    <>
                        <div className="admin-product-grid">
                            {getPaginatedProducts().map((product) => (
                                <div
                                    className="admin-product-card"
                                    key={product.id}
                                >
                                    <img
                                        src={`http://localhost:5000${product.photo_path}`}
                                        alt={product.name}
                                    />
                                    <h3>{product.name}</h3>
                                    <p>{product.description}</p>
                                    <p className="admin-price">
                                        {product.price} грн
                                    </p>
                                    <p className="admin-stock">
                                        На складі: {product.stock_quantity} шт.
                                    </p>
                                    <button
                                        className="admin-edit-button"
                                        onClick={() =>
                                            handleEditButtonClick(product)
                                        }
                                    >
                                        ✏️
                                    </button>
                                    <button
                                        className="admin-delete-button"
                                        onClick={() =>
                                            handleDeleteProduct(product.id)
                                        }
                                    >
                                        Видалити
                                    </button>
                                </div>
                            ))}
                        </div>
                        {totalPages > 1 && (
                            <div className="pagination">
                                {getPaginationButtons().map((button, index) =>
                                    button === "..." ? (
                                        <span
                                            key={index}
                                            className="pagination-dots"
                                        >
                                            {button}
                                        </span>
                                    ) : (
                                        <button
                                            key={index}
                                            className={`pagination-button ${
                                                currentPage === button
                                                    ? "active"
                                                    : ""
                                            }`}
                                            onClick={() =>
                                                handlePageChange(button)
                                            }
                                        >
                                            {button}
                                        </button>
                                    )
                                )}
                            </div>
                        )}
                    </>
                )}
                {activeSection === "add" && (
                    <form className="product-form">
                        <label htmlFor="name">Назва товару</label>
                        <input
                            id="name"
                            type="text"
                            name="name"
                            placeholder="Назва товару"
                            value={newProduct.name}
                            onChange={handleProductChange}
                            required
                        />
                        <label htmlFor="description">Опис товару</label>
                        <textarea
                            id="description"
                            name="description"
                            placeholder="Опис товару"
                            value={newProduct.description}
                            onChange={handleProductChange}
                            required
                        />
                        <label htmlFor="price">Ціна</label>
                        <input
                            id="price"
                            type="number"
                            name="price"
                            placeholder="Ціна"
                            value={newProduct.price}
                            onChange={handleProductChange}
                            required
                        />
                        <label htmlFor="quantity">Кількість</label>
                        <input
                            id="quantity"
                            type="number"
                            name="quantity"
                            placeholder="Кількість"
                            value={newProduct.quantity}
                            onChange={handleProductChange}
                            required
                        />
                        <label htmlFor="category">Категорія</label>
                        <select
                            id="category"
                            value={selectedCategory}
                            onChange={handleCategoryChange}
                            required
                        >
                            <option value="" disabled>
                                Оберіть категорію
                            </option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                        <label htmlFor="subcategory">Підкатегорія</label>
                        <select
                            id="subcategory"
                            name="subcategoryId"
                            value={newProduct.subcategoryId}
                            onChange={handleProductChange}
                            required
                            disabled={!subcategories.length}
                        >
                            <option value="" disabled>
                                Оберіть підкатегорію
                            </option>
                            {subcategories.map((subcategory) => (
                                <option
                                    key={subcategory.id}
                                    value={subcategory.id}
                                >
                                    {subcategory.name}
                                </option>
                            ))}
                        </select>

                        <label htmlFor="photo">Шлях до фото</label>
                        <input
                            id="photo"
                            type="text"
                            name="photo"
                            placeholder="Шлях до фото"
                            value={newProduct.photo}
                            onChange={handleProductChange}
                            required
                        />
                        <button type="submit" onClick={handleAddProduct}>
                            Додати товар
                        </button>
                    </form>
                )}

                {activeSection === "edit" && editingProduct && (
                    <form className="product-form">
                        <h2>Редагувати товар</h2>
                        <label htmlFor="name">Назва товару</label>
                        <input
                            id="name"
                            type="text"
                            name="name"
                            placeholder="Назва товару"
                            value={newProduct.name}
                            onChange={handleProductChange}
                            required
                        />
                        <label htmlFor="description">Опис товару</label>
                        <textarea
                            id="description"
                            name="description"
                            placeholder="Опис товару"
                            value={newProduct.description}
                            onChange={handleProductChange}
                            required
                        />
                        <label htmlFor="price">Ціна</label>
                        <input
                            id="price"
                            type="number"
                            name="price"
                            placeholder="Ціна"
                            value={newProduct.price}
                            onChange={handleProductChange}
                            required
                        />
                        <label htmlFor="quantity">Кількість</label>
                        <input
                            id="quantity"
                            type="number"
                            name="quantity"
                            placeholder="Кількість"
                            value={newProduct.quantity}
                            onChange={handleProductChange}
                            required
                        />
                        <label htmlFor="photo">Шлях до фото</label>
                        <input
                            id="photo"
                            type="text"
                            name="photo"
                            placeholder="Шлях до фото"
                            value={newProduct.photo}
                            onChange={handleProductChange}
                            required
                        />
                        <button type="submit" onClick={handleEditProduct}>
                            Оновити товар
                        </button>
                    </form>
                )}
                {activeSection === "orders" && renderOrders()}
            </main>
        </div>
    );
};

export default AdminPage;
