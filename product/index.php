<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Products</title>
    <link rel="stylesheet" href="../requirements/index.css">
    <link rel="stylesheet" href="../css/shop/index.css">
</head>

<body>
    <div class="main">
        <div class="main--body">
            <h1>Одежда на любой вкус</h1>
            <p>Результатов: </p>
        </div>
    </div>

    <div class="body">
        <div class="body--filters">
            <div class="filters--title">
                <p>Фильтры</p>
                <button id="filter">Показать</button>
            </div>

            <div class="filters--body" id="filter--body">
                <div class="filter--container">
                    <label>Сортировка</label>
                    <div class="filter--container--button">
                        <button data-sort="price_asc" id="sort_price_asc">
                            <span class="sort-icon"></span>
                            <span>Дешевле</span>
                        </button>
                        <button data-sort="price_desc" id="sort_price_desc">
                            <span class="sort-icon"></span>
                            <span>Дороже</span>
                        </button>
                        <button data-sort="rating_desc" id="sort_rating_desc">
                            <span class="sort-icon"></span>
                            <span>Популярные</span>
                        </button>
                        <button data-sort="date_desc" id="sort_date_desc">
                            <span class="sort-icon"></span>
                            <span>Новые</span>
                        </button>
                    </div>
                </div>

                <div class="filter--container">
                    <label>Цена</label>
                    <div class="filter--price-inputs">
                        <div class="price-input-group">
                            <span class="price-prefix">От</span>
                            <input type="text" class="price-input" id="min" placeholder="0">
                        </div>
                        <div class="price-input-group">
                            <span class="price-prefix">До</span>
                            <input type="text" class="price-input" id="max" placeholder="10000">
                        </div>
                    </div>
                </div>

                <div class="filter--container">
                    <label>Тип товара</label>
                    <div class="filter--container--type">
                        <input type="checkbox" name="type[]" id="type_shirts" value="shirts">
                        <label for="type_shirts">Футболки</label>
                    </div>
                    <div class="filter--container--type">
                        <input type="checkbox" name="type[]" id="type_pants" value="pants">
                        <label for="type_pants">Штаны</label>
                    </div>
                    <div class="filter--container--type">
                        <input type="checkbox" name="type[]" id="type_shorts" value="shorts">
                        <label for="type_shorts">Шорты</label>
                    </div>
                    <div class="filter--container--type">
                        <input type="checkbox" name="type[]" id="type_socks" value="socks">
                        <label for="type_socks">Носки</label>
                    </div>
                    <div class="filter--container--type">
                        <input type="checkbox" name="type[]" id="type_hats" value="hats">
                        <label for="type_hats">Головные уборы</label>
                    </div>
                    <div class="filter--container--type">
                        <input type="checkbox" name="type[]" id="type_shoes" value="shoes">
                        <label for="type_shoes">Обувь</label>
                    </div>
                </div>
            </div>

            <button id="filter--submit">Применить</button>
        </div>

        <div class="body--items">
            <div class="body--items--body">
                <div class="loading">
                    <div class="loading-spinner"></div>
                    <p>Загрузка товаров...</p>
                </div>
            </div>
        </div>
    </div>

    <script src="../js/shop/index.js"></script>
</body>

</html>