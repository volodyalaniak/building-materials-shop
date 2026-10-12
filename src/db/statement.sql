-- -- Створення таблиць
-- CREATE TABLE Categories (
--     id INTEGER PRIMARY KEY AUTOINCREMENT,
--     name TEXT NOT NULL
-- );

-- CREATE TABLE Subcategories (
--     id INTEGER PRIMARY KEY AUTOINCREMENT,
--     name TEXT NOT NULL,
--     category_id INTEGER NOT NULL,
--     FOREIGN KEY (category_id) REFERENCES Categories(id)
-- );

-- CREATE TABLE Products (
--     id INTEGER PRIMARY KEY AUTOINCREMENT,
--     name TEXT NOT NULL,
--     description TEXT,
--     price REAL NOT NULL,
--     is_favorite INTEGER DEFAULT 0,
--     photo_path TEXT NOT NULL,
--     subcategory_id INTEGER NOT NULL,
--     FOREIGN KEY (subcategory_id) REFERENCES Subcategories(id)
-- );

-- CREATE TABLE Attributes (
--     id INTEGER PRIMARY KEY AUTOINCREMENT,
--     name TEXT NOT NULL
-- );

-- CREATE TABLE ProductAttributes (
--     product_id INTEGER NOT NULL,
--     attribute_id INTEGER NOT NULL,
--     value TEXT NOT NULL,
--     FOREIGN KEY (product_id) REFERENCES Products(id),
--     FOREIGN KEY (attribute_id) REFERENCES Attributes(id),
--     PRIMARY KEY (product_id, attribute_id)
-- );

-- CREATE TABLE Stock (
--     product_id INTEGER PRIMARY KEY,
--     quantity INTEGER NOT NULL DEFAULT 0,
--     FOREIGN KEY (product_id) REFERENCES Products(id)
-- );

-- -- Заповнення категорій
-- INSERT INTO Categories (name) VALUES
-- ('Профілі та кріплення'),
-- ('Сухі суміші'),
-- ('Інструменти'),
-- ('Утеплювачі'),
-- ('Лакофарбові матеріали'),
-- ('Піни та герметики'),
-- ('Саморізи та дюбелі'),
-- ('Електроінструменти');

-- -- Заповнення підкатегорій
-- INSERT INTO Subcategories (name, category_id) VALUES
-- ('Профіль для гіпсокартону', 1),
-- ('З`єднувач для профілю CD', 1),
-- ('Рейки та кути', 1),
-- ('Клеї', 2),
-- ('Шпаклівки', 2),
-- ('Грунтовки', 2),
-- ('Ручний інструмент', 3),
-- ('Електроінструмент', 3),
-- ('Пінопласт', 4),
-- ('Мінеральна вата', 4),
-- ('Фарби', 5),
-- ('Лаки', 5),
-- ('Піни монтажні', 6),
-- ('Герметики', 6),
-- ('Саморізи', 7),
-- ('Дюбелі', 7),
-- ('Дрилі', 8),
-- ('Шуруповерти', 8);

-- -- Заповнення атрибутів
-- INSERT INTO Attributes (name) VALUES
-- ('Бренд'),
-- ('Вага'),
-- ('Колір'),
-- ('Об`єм');

-- -- Категорія "Профілі та кріплення"
-- INSERT INTO Products (name, description, price, is_favorite, photo_path, subcategory_id) VALUES
-- ('Профіль для гіпсокартону CD-60', 'Профіль для стельових конструкцій.', 85.00, 0, '/assets/cd60.jpg', 1),
-- ('Профіль для гіпсокартону UD-27', 'Профіль для монтажу стінових конструкцій.', 50.00, 0, '/assets/ud27.jpg', 1),
-- ('З`єднувач для профілю CD', 'Прямий з`єднувач для профілю.', 12.50, 0, '/assets/cd_connector.jpg', 2),
-- ('Підвіс для профілю прямий', 'Підвіс для кріплення до стелі.', 14.00, 0, '/assets/straight_hanger.jpg', 2),
-- ('Кутник алюмінієвий 25х25 мм', 'Кутник для обробки кутів.', 22.00, 0, '/assets/aluminum_corner.jpg', 3),
-- ('Рейка монтажна 2 м', 'Рейка для обшивки.', 35.00, 0, '/assets/mounting_reika.jpg', 3),
-- ('Профіль стельовий Т-подібний', 'Профіль для підвісних стель.', 45.00, 0, '/assets/t_profile.jpg', 1),
-- ('Анкерний підвіс для стелі', 'Підвіс для монтажу підвісних стель.', 30.00, 0, '/assets/anchor_hanger.jpg', 2);

-- -- Заповнення кількості для "Профілі та кріплення"
-- INSERT INTO Stock (product_id, quantity) VALUES
-- (1, 100),
-- (2, 200),
-- (3, 500),
-- (4, 300),
-- (5, 150),
-- (6, 120),
-- (7, 80),
-- (8, 250);

-- -- Категорія "Сухі суміші"
-- INSERT INTO Products (name, description, price, is_favorite, photo_path, subcategory_id) VALUES
-- ('Клей для плитки Ceresit CM 11', 'Клей для керамічної плитки.', 120.00, 0, '/assets/cm11.jpg', 4),
-- ('Штукатурка гіпсова Knauf Rotband', 'Універсальна штукатурка для стін.', 260.00, 0, '/assets/rotband.jpg', 4),
-- ('Грунтовка глибокопроникна Ceresit CT 17', 'Грунтовка для пористих основ.', 130.00, 0, '/assets/ct17.jpg', 5),
-- ('Шпаклівка гіпсова Knauf Fugen', 'Для заповнення швів.', 180.00, 0, '/assets/fugen.jpg', 4),
-- ('Штукатурка цементна Polimin', 'Міцна штукатурка для зовнішніх робіт.', 200.00, 0, '/assets/polimin.jpg', 4),
-- ('Клей для утеплювачів Anserglob BCX 31', 'Клей для монтажу теплоізоляційних плит.', 150.00, 0, '/assets/bcx31.jpg', 4),
-- ('Грунтовка антисептична Knauf', 'Грунтовка з антисептичним ефектом.', 110.00, 0, '/assets/knauf_ground.jpg', 5),
-- ('Клей для керамограніту Atlas', 'Надійний клей для важких плит.', 175.00, 0, '/assets/atlas_klei.jpg', 4);

-- -- Заповнення кількості для "Сухі суміші"
-- INSERT INTO Stock (product_id, quantity) VALUES
-- (9, 50),
-- (10, 40),
-- (11, 30),
-- (12, 60),
-- (13, 35),
-- (14, 100),
-- (15, 70),
-- (16, 45);

-- -- Категорія "Піни та герметики"
-- INSERT INTO Products (name, description, price, is_favorite, photo_path, subcategory_id) VALUES
-- ('Монтажна піна Ceresit TS 62', 'Високоякісна піна для будівельних робіт.', 195.00, 0, '/assets/ceresit_ts62.jpg', 13),
-- ('Монтажна піна SomaFix', 'Піна для професійного застосування.', 170.00, 0, '/assets/somafix.jpg', 13),
-- ('Герметик акриловий Ceresit CS 7', 'Для герметизації швів.', 120.00, 0, '/assets/ceresit_cs7.jpg', 14),
-- ('Силіконовий герметик Moment', 'Водостійкий герметик для швів.', 150.00, 0, '/assets/moment_silicone.jpg', 14),
-- ('Піна монтажна Penosil GoldGun 65', 'Професійна піна з високим виходом.', 210.00, 0, '/assets/penosil_gold.jpg', 13),
-- ('Акриловий герметик Soudal', 'Герметик для внутрішніх робіт.', 110.00, 0, '/assets/soudal_acrylic.jpg', 14);

-- -- Заповнення кількості для "Піни та герметики"
-- INSERT INTO Stock (product_id, quantity) VALUES
-- (17, 80),
-- (18, 100),
-- (19, 90),
-- (20, 60),
-- (21, 70),
-- (22, 50);

-- -- Категорія "Саморізи та дюбелі"
-- INSERT INTO Products (name, description, price, is_favorite, photo_path, subcategory_id) VALUES
-- ('Саморізи для гіпсокартону 3.5x25 мм', 'Саморізи для кріплення до металу.', 55.00, 0, '/assets/screws_drywall.jpg', 15),
-- ('Саморізи покрівельні 4.8x35 мм', 'Саморізи з ущільнювальною шайбою.', 75.00, 0, '/assets/screws_roof.jpg', 15),
-- ('Дюбелі універсальні 6x40 мм', 'Для кріплення до різних поверхонь.', 60.00, 0, '/assets/plugs_universal.jpg', 16),
-- ('Анкерні болти 10x80 мм', 'Надійне кріплення для важких конструкцій.', 180.00, 0, '/assets/anchor_bolt.jpg', 16),
-- ('Саморізи для деревини 3.5x40 мм', 'Для монтажу дерев`яних конструкцій.', 50.00, 0, '/assets/screws_wood.jpg', 15),
-- ('Дюбелі для ізоляції 10x100 мм', 'Кріплення для теплоізоляційних матеріалів.', 95.00, 0, '/assets/plugs_insulation.jpg', 16);

-- -- Заповнення кількості для "Саморізи та дюбелі"
-- INSERT INTO Stock (product_id, quantity) VALUES
-- (23, 200),
-- (24, 120),
-- (25, 100),
-- (26, 50),
-- (27, 150),
-- (28, 90);

-- -- Категорія "Електроінструменти"
-- INSERT INTO Products (name, description, price, is_favorite, photo_path, subcategory_id) VALUES
-- ('Шуруповерт акумуляторний Makita DF333DWAE', 'Потужний акумуляторний шуруповерт.', 3799.00, 0, '/assets/makita_screwdriver.jpg', 18),
-- ('Дриль ударний DeWalt DWD024', 'Компактний та легкий дриль.', 2100.00, 0, '/assets/dewalt_dril.jpg', 17),
-- ('Болгарка Bosch GWS 750-125', 'Кутова шліфмашина для професійних робіт.', 2550.00, 0, '/assets/bosch_grinder.jpg', 17),
-- ('Перфоратор Makita HR2470', 'Надійний перфоратор для будівельних робіт.', 4400.00, 0, '/assets/makita_hammer.jpg', 17),
-- ('Шуруповерт Hitachi DS18DJL', 'Ергономічний інструмент для монтажу.', 3300.00, 0, '/assets/hitachi_screwdriver.jpg', 18),
-- ('Дриль акумуляторний Bosch GSR 180-LI', 'Акумуляторний дриль з високою продуктивністю.', 3900.00, 0, '/assets/bosch_gsr180.jpg', 18);

-- -- Заповнення кількості для "Електроінструменти"
-- INSERT INTO Stock (product_id, quantity) VALUES
-- (29, 20),
-- (30, 25),
-- (31, 15),
-- (32, 10),
-- (33, 30),
-- (34, 12);

-- -- Категорія "Інструменти"
-- INSERT INTO Products (name, description, price, is_favorite, photo_path, subcategory_id) VALUES
-- ('Викрутка хрестова 150 мм', 'Інструмент для загвинчування.', 45.00, 0, '/assets/screwdriver.jpg', 7),
-- ('Молоток слюсарний 500 г', 'Інструмент для забивання цвяхів.', 90.00, 0, '/assets/hammer.jpg', 7),
-- ('Ножівка по дереву 450 мм', 'Для розпилювання деревини.', 150.00, 0, '/assets/saw.jpg', 7),
-- ('Рівень будівельний 120 см', 'Для перевірки рівності поверхонь.', 250.00, 0, '/assets/level_120cm.jpg', 7),
-- ('Плоскогубці універсальні 180 мм', 'Для захоплення та різання.', 80.00, 0, '/assets/pliers.jpg', 7),
-- ('Дриль ударний Bosch GSB 550', 'Ударний дриль для побутових потреб.', 1999.00, 0, '/assets/bosch_dril.jpg', 8),
-- ('Набір ключів 12 шт.', 'Набір універсальних гайкових ключів.', 350.00, 0, '/assets/wrench_set.jpg', 7),
-- ('Стамеска 20 мм', 'Для точних столярних робіт.', 60.00, 0, '/assets/chisel.jpg', 7);

-- INSERT INTO Stock (product_id, quantity) VALUES
-- (9, 120), -- Викрутка хрестова 150 мм
-- (10, 100), -- Молоток слюсарний 500 г
-- (11, 50), -- Ножівка по дереву 450 мм
-- (12, 75), -- Рівень будівельний 120 см
-- (13, 90), -- Плоскогубці універсальні 180 мм
-- (14, 30), -- Дриль ударний Bosch GSB 550
-- (15, 25), -- Набір ключів 12 шт.
-- (16, 40); -- Стамеска 20 мм

-- -- Категорія "Утеплювачі"
-- INSERT INTO Products (name, description, price, is_favorite, photo_path, subcategory_id) VALUES
-- ('Пінопласт 50 мм', 'Матеріал для теплоізоляції.', 450.00, 0, '/assets/polystyrene.jpg', 8),
-- ('Мінеральна вата Isover KT 40', 'Ефективна теплоізоляція.', 600.00, 0, '/assets/isover.jpg', 9),
-- ('Пінопласт 100 мм', 'Товстий шар для додаткового утеплення.', 900.00, 0, '/assets/polystyrene100.jpg', 8),
-- ('Мінеральна вата Rockwool', 'Матеріал для акустичної ізоляції.', 700.00, 0, '/assets/rockwool.jpg', 9),
-- ('Теплоізоляційні плити Knauf', 'Для утеплення фасадів.', 750.00, 0, '/assets/knauf_iso.jpg', 9),
-- ('Пінополіуретанова плита', 'Для утеплення складних конструкцій.', 850.00, 0, '/assets/poliuret.jpg', 8),
-- ('Фольгований утеплювач', 'Для відбиття тепла.', 500.00, 0, '/assets/foil_iso.jpg', 9);

-- INSERT INTO Stock (product_id, quantity) VALUES
-- (17, 60), -- Пінопласт 50 мм
-- (18, 30), -- Мінеральна вата Isover KT 40
-- (19, 20), -- Пінопласт 100 мм
-- (20, 35), -- Мінеральна вата Rockwool
-- (21, 40), -- Теплоізоляційні плити Knauf
-- (22, 25), -- Пінополіуретанова плита
-- (23, 50); -- Фольгований утеплювач

-- -- Категорія "Лакофарбові матеріали"
-- INSERT INTO Products (name, description, price, is_favorite, photo_path, subcategory_id) VALUES
-- ('Фарба інтер`єрна Dulux', 'Фарба для внутрішніх робіт.', 850.00, 0, '/assets/dulux.jpg', 10),
-- ('Лак акриловий Sadolin', 'Захисний лак для деревини.', 300.00, 0, '/assets/sadolin.jpg', 11),
-- ('Фарба фасадна Ceresit CT 42', 'Для зовнішнього використання.', 700.00, 0, '/assets/ceresit_ct42.jpg', 10),
-- ('Грунтовка для металу', 'Захисне покриття для металевих поверхонь.', 150.00, 0, '/assets/metal_ground.jpg', 11),
-- ('Антисептик для дерева', 'Захист від грибка та цвілі.', 400.00, 0, '/assets/antiseptic.jpg', 11),
-- ('Фарба емалева універсальна', 'Яскравий блиск для будь-яких поверхонь.', 180.00, 0, '/assets/enamel.jpg', 10),
-- ('Лак для паркету', 'Довговічний лак для дерев`яної підлоги.', 600.00, 0, '/assets/parket_lac.jpg', 11),
-- ('Фарба для даху', 'Стійке до погодних умов покриття.', 950.00, 0, '/assets/roof_paint.jpg', 10);

-- INSERT INTO Stock (product_id, quantity) VALUES
-- (24, 70), -- Фарба інтер`єрна Dulux
-- (25, 90), -- Лак акриловий Sadolin
-- (26, 50), -- Фарба фасадна Ceresit CT 42
-- (27, 80), -- Грунтовка для металу
-- (28, 60), -- Антисептик для дерева
-- (29, 120), -- Фарба емалева універсальна
-- (30, 40), -- Лак для паркету
-- (31, 30); -- Фарба для даху


-- -- Додавання товарів до підкатегорії "Витратні матеріали"
-- INSERT INTO Products (name, description, price, is_favorite, photo_path, subcategory_id) VALUES
-- ('Терка для штукатурки', 'Інструмент для вирівнювання штукатурки.', 45.00, 0, '/assets/terka.jpg', 19),
-- ('Щітка жорстка', 'Щітка для очищення поверхонь.', 30.00, 0, '/assets/hard_brush.jpg', 19),
-- ('Рукавички будівельні', 'Рукавички для захисту рук.', 20.00, 0, '/assets/gloves.jpg', 19),
-- ('Малярна стрічка', 'Стрічка для малярних робіт.', 15.00, 0, '/assets/tape.jpg', 19),
-- ('Губка будівельна', 'Для очищення та зволоження поверхонь.', 10.00, 0, '/assets/sponge.jpg', 19),
-- ('Зубило плоске', 'Для розбивання матеріалів.', 80.00, 0, '/assets/chisel.jpg', 19),
-- ('Кисть малярна 50 мм', 'Кисть для фарбування поверхонь.', 25.00, 0, '/assets/paint_brush.jpg', 19),
-- ('Валик малярний 250 мм', 'Валик для фарбування.', 50.00, 0, '/assets/paint_roller.jpg', 19),
-- ('Плівка захисна 10 м²', 'Для захисту поверхонь під час ремонту.', 40.00, 0, '/assets/protective_film.jpg', 19),
-- ('Лопатка малярна 100 мм', 'Для нанесення та вирівнювання шпаклівки.', 35.00, 0, '/assets/putty_knife.jpg', 19),
-- ('Тример для різання паперу', 'Інструмент для точного різання.', 60.00, 0, '/assets/cutter.jpg', 19),
-- ('Незлики гумові', 'Для виконання плиткових робіт.', 30.00, 0, '/assets/rubber_knees.jpg', 19),
-- ('Контейнер для фарби', 'Пластиковий лоток для фарбування.', 25.00, 0, '/assets/paint_tray.jpg', 19),
-- ('Рулетка вимірювальна 5 м', 'Інструмент для вимірювань.', 55.00, 0, '/assets/measuring_tape.jpg', 19),
-- ('Лазерний рівень', 'Прилад для точного вирівнювання.', 550.00, 0, '/assets/laser_level.jpg', 19);

-- -- Додавання записів у таблицю Stock
-- INSERT INTO Stock (product_id, quantity) VALUES
-- (35, 100), -- Терка для штукатурки
-- (36, 120), -- Щітка жорстка
-- (37, 300), -- Рукавички будівельні
-- (38, 150), -- Малярна стрічка
-- (39, 200), -- Губка будівельна
-- (40, 80), -- Зубило плоске
-- (41, 250), -- Кисть малярна 50 мм
-- (42, 180), -- Валик малярний 250 мм
-- (43, 75),  -- Плівка захисна 10 м²
-- (44, 130), -- Лопатка малярна 100 мм
-- (45, 90),  -- Тример для різання паперу
-- (46, 70),  -- Незлики гумові
-- (47, 140), -- Контейнер для фарби
-- (48, 60),  -- Рулетка вимірювальна 5 м
-- (49, 25);  -- Лазерний рівень

-- SELECT p.*, s.name as subcategory_name, c.name as category_name
-- FROM Products p
-- JOIN Subcategories s ON p.subcategory_id = s.id
-- JOIN Categories c ON s.category_id = c.id

-- DELETE FROM Products WHERE rowid NOT IN (SELECT MIN(rowid) FROM Products GROUP BY name);
-- DELETE FROM Stock WHERE rowid NOT IN (SELECT MIN(rowid) FROM Stock GROUP BY product_id);



-- -- Додавання фарб до підкатегорії "Фарби" (subcategory_id = 11)
-- INSERT INTO Products (name, description, price, is_favorite, photo_path, subcategory_id) VALUES
-- ('Фарба інтер`єрна Dulux', 'Фарба для внутрішніх робіт.', 850.00, 0, '/assets/dulux.jpg', 11),
-- ('Фарба фасадна Ceresit CT 42', 'Для зовнішнього використання.', 700.00, 0, '/assets/ceresit_ct42.jpg', 11),
-- ('Фарба емалева універсальна', 'Яскравий блиск для будь-яких поверхонь.', 180.00, 0, '/assets/enamel.jpg', 11),
-- ('Фарба для даху', 'Стійке до погодних умов покриття.', 950.00, 0, '/assets/roof_paint.jpg', 11);

-- -- Відповідні записи у таблицю Stock для фарб
-- INSERT INTO Stock (product_id, quantity) VALUES
-- ((SELECT id FROM Products WHERE name = 'Фарба інтер`єрна Dulux'), 70),
-- ((SELECT id FROM Products WHERE name = 'Фарба фасадна Ceresit CT 42'), 50),
-- ((SELECT id FROM Products WHERE name = 'Фарба емалева універсальна'), 120),
-- ((SELECT id FROM Products WHERE name = 'Фарба для даху'), 30);

-- -- Перевірка правильності додавання фарб
-- SELECT p.*, s.name AS subcategory_name, c.name AS category_name
-- FROM Products p
-- JOIN Subcategories s ON p.subcategory_id = s.id
-- JOIN Categories c ON s.category_id = c.id
-- WHERE s.name = 'Фарби';

-- -- Додавання лаків до підкатегорії "Лаки" (subcategory_id = 12)
-- INSERT INTO Products (name, description, price, is_favorite, photo_path, subcategory_id) VALUES
-- ('Лак акриловий Sadolin', 'Захисний лак для деревини.', 300.00, 0, '/assets/sadolin.jpg', 12),
-- ('Грунтовка для металу', 'Захисне покриття для металевих поверхонь.', 150.00, 0, '/assets/metal_ground.jpg', 12),
-- ('Антисептик для дерева', 'Захист від грибка та цвілі.', 400.00, 0, '/assets/antiseptic.jpg', 12),
-- ('Лак для паркету', 'Довговічний лак для дерев`яної підлоги.', 600.00, 0, '/assets/parket_lac.jpg', 12);

-- -- Відповідні записи у таблицю Stock для лаків
-- INSERT INTO Stock (product_id, quantity) VALUES
-- ((SELECT id FROM Products WHERE name = 'Лак акриловий Sadolin'), 90),
-- ((SELECT id FROM Products WHERE name = 'Грунтовка для металу'), 80),
-- ((SELECT id FROM Products WHERE name = 'Антисептик для дерева'), 60),
-- ((SELECT id FROM Products WHERE name = 'Лак для паркету'), 40);

-- -- Таблиця для зберігання кошика
-- CREATE TABLE Cart (
--     id INTEGER PRIMARY KEY AUTOINCREMENT, -- Унікальний ідентифікатор запису
--     product_id INTEGER NOT NULL,          -- ID товару з таблиці Products
--     quantity INTEGER NOT NULL,            -- Кількість товару в кошику
--     FOREIGN KEY (product_id) REFERENCES Products(id) -- Зв'язок з таблицею Products
-- );


-- SELECT * FROM Cart;

-- CREATE TABLE Orders (
--     id INTEGER PRIMARY KEY AUTOINCREMENT,
--     first_name TEXT NOT NULL,
--     last_name TEXT NOT NULL,
--     phone TEXT NOT NULL,
--     email TEXT NOT NULL,
--     country TEXT NOT NULL,
--     city TEXT NOT NULL,
--     comment TEXT,
--     total_price REAL NOT NULL,
--     created_at DATETIME DEFAULT CURRENT_TIMESTAMP
-- );

-- CREATE TABLE Favorites (
--     id INTEGER PRIMARY KEY AUTOINCREMENT,
--     user_id INTEGER NOT NULL,
--     product_id INTEGER NOT NULL,
--     FOREIGN KEY (user_id) REFERENCES Users(id),
--     FOREIGN KEY (product_id) REFERENCES Products(id)
-- );

-- CREATE TABLE Users (
--     id INTEGER PRIMARY KEY AUTOINCREMENT,
--     first_name TEXT NOT NULL,
--     last_name TEXT NOT NULL,
--     email TEXT UNIQUE NOT NULL,
--     phone TEXT UNIQUE NOT NULL,
--     password TEXT NOT NULL, -- Пароль у хешованому вигляді
--     created_at DATETIME DEFAULT CURRENT_TIMESTAMP
-- );

-- ALTER TABLE Orders ADD COLUMN user_id INTEGER;

-- CREATE TABLE OrderItems (
--     id INTEGER PRIMARY KEY AUTOINCREMENT,
--     order_id INTEGER NOT NULL,
--     product_id INTEGER NOT NULL,
--     quantity INTEGER NOT NULL,
--     price DECIMAL(10, 2) NOT NULL,
--     FOREIGN KEY (order_id) REFERENCES Orders(id),
--     FOREIGN KEY (product_id) REFERENCES Products(id)
-- );

-- INSERT INTO Stock (product_id, quantity) VALUES
-- (50, 100),
-- (51, 120),
-- (52, 150),
-- (53, 180),
-- (54, 200),
-- (55, 250),
-- (56, 300),
-- (57, 220),
-- (59, 140),
-- (61, 170),
-- (62, 200),
-- (64, 90),
-- (72, 110),
-- (73, 130),
-- (74, 160),
-- (76, 190),
-- (78, 210),
-- (79, 240),
-- (81, 100),
-- (87, 120),
-- (88, 140),
-- (89, 160),
-- (90, 180);