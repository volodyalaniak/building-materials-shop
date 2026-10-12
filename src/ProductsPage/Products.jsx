import React, { useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import Slider from "react-slider";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./Products.css";
import "../CartPage/Cart.css";

const ProductsPage = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedSubcategory, setSelectedSubcategory] = useState(null);
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortOption, setSortOption] = useState("default");
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(0);
    const [priceRange, setPriceRange] = useState([0, 0]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [favoriteProducts, setFavoriteProducts] = useState([]);
    const productsPerPage = 8;
    const location = useLocation();
    const navigate = useNavigate();
    const [manualQuantities, setManualQuantities] = useState({});

    useEffect(() => {
        // Перевіряємо, чи є параметр `openCart`
        const params = new URLSearchParams(location.search);
        if (params.get("openCart") === "true") {
            setIsCartOpen(true);
        }
    }, [location]);

    useEffect(() => {
        const fetchCategories = async () => {
            const res = await fetch("http://localhost:5000/api/categories");
            const data = await res.json();
            setCategories([
                { id: "all", name: "Усі товари", subcategories: [] },
                ...data,
            ]);
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            const queryParams = new URLSearchParams();
            if (selectedCategory && selectedCategory !== "all")
                queryParams.append("category", selectedCategory);
            if (selectedSubcategory)
                queryParams.append("subcategory", selectedSubcategory);

            const res = await fetch(
                `http://localhost:5000/api/products?${queryParams.toString()}`
            );
            const data = await res.json();
            setProducts(
                data.map((product) => ({
                    ...product,
                    stock_quantity: product.stock_quantity, // Додайте це, якщо в API є це поле
                }))
            );
            setFilteredProducts(data);
            if (data.length > 0) {
                const prices = data.map((product) => product.price);
                const min = Math.min(...prices);
                const max = Math.max(...prices);
                setMinPrice(min);
                setMaxPrice(max);
                setPriceRange([min, max]);
            } else {
                setMinPrice(0);
                setMaxPrice(0);
                setPriceRange([0, 0]);
            }
            setCurrentPage(1);
        };
        fetchProducts();
    }, [selectedCategory, selectedSubcategory]);

    useEffect(() => {
        const clearCartOnUserChange = async () => {
            try {
                const isLoggedIn = localStorage.getItem("isLoggedIn");
                if (!isLoggedIn) {
                    // Викликаємо API для очищення кошика
                    await fetch("http://localhost:5000/api/cart/clear", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });
                    setCartItems([]); // Очищаємо локальний стан кошика
                }
            } catch (error) {
                console.error("Помилка очищення кошика:", error);
            }
        };

        clearCartOnUserChange();
    }, []); // Викликається на зміну користувача

    // Завантаження улюблених товарів користувача
    useEffect(() => {
        const userId = localStorage.getItem("userId");
        if (userId) {
            const url = `http://localhost:5000/api/favorites/${userId}`; // Додаємо базовий URL сервера
            fetch(url)
                .then((res) => {
                    if (!res.ok) {
                        throw new Error(
                            "Не вдалося завантажити улюблені товари."
                        );
                    }
                    return res.json();
                })
                .then((data) => {
                    console.log("Отримано улюблені товари:", data);
                    setFavoriteProducts(data.map((item) => item.product_id));
                })
                .catch((err) =>
                    console.error(
                        "Не вдалося завантажити улюблені товари:",
                        err
                    )
                );
        }
    }, []);

    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/cart");
                if (!response.ok) {
                    throw new Error("Не вдалося завантажити дані кошика.");
                }
                const data = await response.json();

                // Оновлюємо локальний стан кошика
                setCartItems(
                    data.map((item) => ({
                        ...item,
                        quantity: item.quantity,
                        stock_quantity: item.stock_quantity,
                    }))
                );

                // 🔽 Ініціалізуємо manualQuantities одразу після завантаження
                const initialQuantities = {};
                data.forEach((item) => {
                    initialQuantities[item.id] = item.quantity;
                });
                setManualQuantities(initialQuantities);
            } catch (error) {
                console.error("Помилка завантаження кошика:", error);
            }
        };

        fetchCartItems();
    }, []);

    const handleCategorySelect = (categoryId) => {
        if (selectedCategory === categoryId && selectedSubcategory === null) {
            setSelectedCategory(null); // Якщо натиснута категорія вже обрана, скидаємо вибір
        } else {
            setSelectedCategory(categoryId); // Встановлюємо нову категорію
            setSelectedSubcategory(null); // Очищаємо підкатегорію
        }
    };

    const handleSubcategorySelect = (subcategoryId) => {
        setSelectedSubcategory(subcategoryId);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleSortChange = (option) => {
        setSortOption(option);
    };

    const handleSliderChange = (value) => {
        setPriceRange(value);
    };

    const handleSearch = (event) => {
        setSearchQuery(event.target.value.toLowerCase());
    };

    useEffect(() => {
        const filtered = products.filter(
            (product) =>
                product.price >= priceRange[0] &&
                product.price <= priceRange[1] &&
                (product.name.toLowerCase().includes(searchQuery) ||
                    product.description.toLowerCase().includes(searchQuery))
        );
        setFilteredProducts(filtered);
        setCurrentPage(1);
    }, [priceRange, searchQuery, products]);

    useEffect(() => {
        const filtered = products.filter(
            (product) =>
                product.price >= priceRange[0] && product.price <= priceRange[1]
        );
        setFilteredProducts(filtered);
        setCurrentPage(1);
    }, [priceRange]);

    useEffect(() => {
        if (isCartOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
        // Очистка стилю при розмонтуванні компонента
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isCartOpen]);

    const sortedProducts = [...filteredProducts].sort((a, b) => {
        switch (sortOption) {
            case "price-asc":
                return a.price - b.price;
            case "price-desc":
                return b.price - a.price;
            case "name-asc":
                return a.name.localeCompare(b.name);
            case "name-desc":
                return b.name.localeCompare(a.name);
            default:
                return 0;
        }
    });

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = sortedProducts.slice(
        indexOfFirstProduct,
        indexOfLastProduct
    );

    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    const getPaginationButtons = () => {
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
    const addProductToCartServer = async (productId, quantity = 1) => {
        try {
            const response = await fetch("http://localhost:5000/api/cart", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ product_id: productId, quantity }),
            });

            if (!response.ok) {
                throw new Error(
                    "Помилка додавання товару до кошика на сервері."
                );
            }
        } catch (error) {
            console.error("Помилка додавання товару:", error);
        }
    };

    const handleAddToCart = (product) => {
        const existingProduct = cartItems.find(
            (item) => item.id === product.id
        );

        if (existingProduct) {
            // Перевіряємо, чи нова кількість не перевищує наявну на складі
            if (existingProduct.quantity + 1 > product.stock_quantity) {
                alert(
                    `На складі є лише ${product.stock_quantity} шт. "${product.name}".`
                );
                return;
            }
            setCartItems(
                cartItems.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
            );
            addProductToCartServer(product.id, 1);
        } else {
            if (1 > product.stock_quantity) {
                alert(`Товару "${product.name}" наразі немає в наявності.`);
                return;
            }
            setCartItems([...cartItems, { ...product, quantity: 1 }]);
            addProductToCartServer(product.id, 1);
        }
        setIsCartOpen(true);
    };

    const handleCloseCart = () => {
        setIsCartOpen(false);
    };

    const handleCartQuantityChange = async (id, delta) => {
        const updatedCart = cartItems.map((item) => {
            if (item.id === id) {
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

        const updatedItem = updatedCart.find((item) => item.id === id);

        // 🔄 Оновлюємо і cartItems, і manualQuantities
        setCartItems(updatedCart);
        setManualQuantities((prev) => ({
            ...prev,
            [id]: updatedItem.quantity,
        }));

        try {
            await fetch("http://localhost:5000/api/cart/update", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    product_id: updatedItem.id,
                    quantity: updatedItem.quantity,
                }),
            });
        } catch (error) {
            console.error("Помилка оновлення кількості:", error);
        }
    };

    const handleManualQuantityChange = async (id, value) => {
        const updatedCart = cartItems.map((item) =>
            item.id === id ? { ...item, quantity: value } : item
        );
        setCartItems(updatedCart);

        try {
            await fetch("http://localhost:5000/api/cart/update", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ product_id: id, quantity: value }),
            });
        } catch (error) {
            console.error("Помилка ручного оновлення кількості:", error);
        }
    };

    const handleRemoveFromCart = async (id) => {
        const updatedCart = cartItems.filter((item) => item.id !== id);
        setCartItems(updatedCart);

        // Видалення з сервера
        try {
            await fetch("http://localhost:5000/api/cart/remove", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ product_id: id }),
            });
        } catch (error) {
            console.error(
                "Помилка видалення товару з кошика на сервері:",
                error
            );
        }
    };

    const handleCheckout = () => {
        if (cartItems.length === 0) {
            alert(
                "Ваш кошик порожній. Додайте товари перед оформленням замовлення."
            );
        } else {
            navigate("/order"); // Програмний перехід
        }
    };

    // Обробник додавання/видалення улюбленого товару
    const toggleFavorite = (productId) => {
        const userId = localStorage.getItem("userId"); // Отримуємо id користувача
        const isLoggedIn = localStorage.getItem("isLoggedIn");

        if (!isLoggedIn || !userId) {
            navigate("/login"); // Якщо не авторизований, перенаправляємо на сторінку авторизації
            return;
        }

        const isFavorite = favoriteProducts.includes(productId);
        const url = `http://localhost:5000/api/favorites/${
            isFavorite ? "remove" : "add"
        }`; // Додаємо базовий URL сервера
        const method = "POST";
        const body = JSON.stringify({ userId, productId });

        console.log("Запит до сервера:", { url, method, body }); // Логування

        fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body,
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Помилка при запиті до сервера.");
                }
                return res.json();
            })
            .then(() => {
                console.log(`Товар ${productId} оновлено.`);
                setFavoriteProducts((prev) =>
                    isFavorite
                        ? prev.filter((id) => id !== productId)
                        : [...prev, productId]
                );
            })
            .catch((err) => {
                console.error("Помилка оновлення улюблених товарів:", err);
            });
    };

    const uniqueCartItemsCount = cartItems.length;

    return (
        <div>
            <Header
                uniqueCartItemsCount={uniqueCartItemsCount}
                onCartClick={() => setIsCartOpen(true)}
            />
            <div
                className={`overlay ${isCartOpen ? "visible" : ""}`}
                onClick={handleCloseCart}
            ></div>

            <div className="products-page">
                <aside className="filters">
                    <h3>Каталог</h3>
                    <ul className="categories-list">
                        {categories.map((category) => (
                            <li key={category.id} className="category-item">
                                <button
                                    className={`category-button ${
                                        selectedCategory === category.id
                                            ? "active"
                                            : ""
                                    }`}
                                    onClick={() =>
                                        handleCategorySelect(category.id)
                                    }
                                >
                                    {category.name}
                                </button>
                                {selectedCategory === category.id &&
                                    category.subcategories.length > 0 && (
                                        <ul className="subcategories-list">
                                            {category.subcategories.map(
                                                (subcategory) => (
                                                    <li key={subcategory.id}>
                                                        <button
                                                            className={`subcategory-button ${
                                                                selectedSubcategory ===
                                                                subcategory.id
                                                                    ? "active"
                                                                    : ""
                                                            }`}
                                                            onClick={() =>
                                                                handleSubcategorySelect(
                                                                    subcategory.id
                                                                )
                                                            }
                                                        >
                                                            {subcategory.name}
                                                        </button>
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    )}
                            </li>
                        ))}
                    </ul>
                    <div className="price-filter">
                        <h4>Ціна</h4>
                        <Slider
                            className="price-slider"
                            value={priceRange}
                            onChange={handleSliderChange}
                            min={minPrice}
                            max={maxPrice}
                            step={1}
                        />
                        <div className="price-values">
                            <span>Від: {priceRange[0]} грн</span>
                            <span>До: {priceRange[1]} грн</span>
                        </div>
                    </div>
                </aside>

                <main className="products">
                    <div className="products-header">
                        <h2>
                            {selectedSubcategory
                                ? `${
                                      categories
                                          .find(
                                              (cat) =>
                                                  cat.id === selectedCategory
                                          )
                                          ?.subcategories.find(
                                              (sub) =>
                                                  sub.id === selectedSubcategory
                                          )?.name || "Товари"
                                  } (${filteredProducts.length})`
                                : selectedCategory && selectedCategory !== "all"
                                ? `${
                                      categories.find(
                                          (cat) => cat.id === selectedCategory
                                      )?.name || "Товари"
                                  } (${filteredProducts.length})`
                                : `Усі товари (${filteredProducts.length})`}
                        </h2>
                        <div className="search-bar">
                            <input
                                type="text"
                                placeholder="Пошук"
                                value={searchQuery}
                                onChange={handleSearch}
                            />
                        </div>
                        <div className="sort-options">
                            <label htmlFor="sort">Сортування:</label>
                            <select
                                id="sort"
                                value={sortOption}
                                onChange={(e) =>
                                    handleSortChange(e.target.value)
                                }
                            >
                                <option value="default">
                                    За замовчуванням
                                </option>
                                <option value="price-asc">
                                    Від дешевих до дорогих
                                </option>
                                <option value="price-desc">
                                    Від дорогих до дешевих
                                </option>
                                <option value="name-asc">
                                    За назвою (А-Я)
                                </option>
                                <option value="name-desc">
                                    За назвою (Я-А)
                                </option>
                            </select>
                        </div>
                    </div>

                    {currentProducts.length > 0 ? (
                        <div className="product-grid">
                            {currentProducts.map((product) => (
                                <div className="product-card" key={product.id}>
                                    <div className="product-actions">
                                        <span
                                            className={`product-heart ${
                                                favoriteProducts.includes(
                                                    product.id
                                                )
                                                    ? "active"
                                                    : ""
                                            }`}
                                            onClick={() =>
                                                toggleFavorite(product.id)
                                            }
                                        >
                                            ❤
                                        </span>
                                    </div>
                                    <img
                                        src={`http://localhost:5000${product.photo_path}`}
                                        alt={product.name}
                                    />
                                    <h3>{product.name}</h3>
                                    <p>{product.description}</p>
                                    <p className="price">
                                        {product.price} грн / шт
                                    </p>
                                    <p className="stock">
                                        {product.stock_quantity > 0
                                            ? `На складі: ${product.stock_quantity} шт.`
                                            : "Немає в наявності"}
                                    </p>
                                    <button
                                        className="buy-button"
                                        onClick={() => handleAddToCart(product)}
                                        disabled={product.stock_quantity === 0}
                                    >
                                        {product.stock_quantity > 0
                                            ? "Придбати"
                                            : "Недоступно"}
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>Товарів не знайдено.</p>
                    )}

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
                                        onClick={() => handlePageChange(button)}
                                    >
                                        {button}
                                    </button>
                                )
                            )}
                        </div>
                    )}
                </main>
            </div>
            {/* КОШИК */}
            <div className={`cart-drawer ${isCartOpen ? "visible" : ""}`}>
                <div className="cart-header">
                    <h2>Кошик</h2>
                    <button
                        className="close-button"
                        onClick={() => setIsCartOpen(false)}
                    >
                        ✖
                    </button>
                </div>
                <div className="cart-items-wrapper">
                    {cartItems.length > 0 ? (
                        cartItems.map((item) => (
                            <div className="cart-item" key={item.id}>
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
                                                    item.id,
                                                    -1
                                                )
                                            }
                                        >
                                            -
                                        </button>
                                        <input
                                            type="number"
                                            min="1"
                                            max={item.stock_quantity}
                                            value={
                                                manualQuantities[item.id] ??
                                                item.quantity
                                            }
                                            onChange={(e) => {
                                                const rawValue = e.target.value;
                                                const parsed = parseInt(
                                                    rawValue,
                                                    10
                                                );
                                                if (!isNaN(parsed)) {
                                                    setManualQuantities({
                                                        ...manualQuantities,
                                                        [item.id]: parsed,
                                                    });
                                                } else if (rawValue === "") {
                                                    setManualQuantities({
                                                        ...manualQuantities,
                                                        [item.id]: "",
                                                    });
                                                }
                                            }}
                                            onBlur={() => {
                                                const value =
                                                    manualQuantities[item.id];
                                                const validValue = Math.min(
                                                    Math.max(value || 1, 1),
                                                    item.stock_quantity
                                                );

                                                // 🔔 Якщо введено більше, ніж є на складі — показати попередження
                                                if (
                                                    value > item.stock_quantity
                                                ) {
                                                    alert(
                                                        `На складі лише ${item.stock_quantity} шт.`
                                                    );
                                                }

                                                handleManualQuantityChange(
                                                    item.id,
                                                    validValue
                                                );
                                                setManualQuantities({
                                                    ...manualQuantities,
                                                    [item.id]: validValue,
                                                });
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
                                                    item.id,
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
                                        handleRemoveFromCart(item.id)
                                    }
                                >
                                    ✖
                                </button>
                            </div>
                        ))
                    ) : (
                        <p>Ваш кошик порожній.</p>
                    )}
                </div>
                <div className="cart-summary">
                    <p>
                        <span>Загалом: </span>
                        {cartItems
                            .reduce(
                                (sum, item) => sum + item.price * item.quantity,
                                0
                            )
                            .toFixed(2)}{" "}
                        грн
                    </p>
                    <div className="cart-actions">
                        <button
                            className="checkout-button"
                            onClick={handleCheckout}
                        >
                            Оформити
                        </button>
                        <button
                            className="continue-shopping-button"
                            onClick={() => setIsCartOpen(false)}
                        >
                            Продовжити покупки
                        </button>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default ProductsPage;
