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
            <p>Результатов: </p> <!-- todo -->
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
                    <label>Цена</label>

                    <div class="filter--container--button">
                        <button class="selected__button" id="filter__price__top">По возрастанию</button>
                        <button id="filter__price__down">По убыванию</button>
                    </div>

                    <div class="filter--price-inputs">
                        <div class="price-input-group">
                            <span class="price-prefix">От</span>
                            <input type="text" class="price-input" data-type="min" inputmode="numeric" id="min">
                        </div>

                        <div class="price-input-group">
                            <span class="price-prefix">До</span>
                            <input type="text" class="price-input" data-type="max" inputmode="numeric" id="max">
                        </div>
                    </div>
                </div>

                <div class="filter--container">
                    <label>Популярность</label>

                    <div class="filter--container--button">
                        <button id="filter__popular__top">По возрастанию</button>
                        <button id="filter__popular__down">По убыванию</button>
                    </div>
                </div>

                <div class="filter--container">
                    <label>Дата создания</label>

                    <div class="filter--container--button">
                        <button id="filter__data__last">Сначало старые</button>
                        <button class="selected__button" id="filter__data__new">Сначало новые</button>
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
                <div class="container">
                    <div class="container--image popular">
                        <img src="../css/images/photo-1.jpg" alt="ops...">
                    </div>

                    <div class="container--info">
                        <div class="container--info--body">
                            <p>Футболки разноцветные</p>
                            <span class="cb76848">1200</span>
                        </div>

                        <div class="container--info--buy">
                            <button>Купить</button>
                        </div>
                    </div>
                </div>

                <div class="container">
                    <div class="container--image">
                        <img src="../css/images/photo-1.jpg" alt="ops...">
                    </div>

                    <div class="container--info">
                        <div class="container--info--body">
                            <p>Футболки разноцветные</p>
                            <span class="cb76848">1200</span>
                        </div>

                        <div class="container--info--buy">
                            <button>Купить</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="../js/shop/ajax.js"></script>
    <script src="../js/shop/index.js"></script>
</body>

</html>