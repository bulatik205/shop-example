document.addEventListener('DOMContentLoaded', function() {
    const filterBtn = document.getElementById('filter');
    const filterBody = document.getElementById('filter--body');
    const filterSubmit = document.getElementById('filter--submit');
    const minInput = document.getElementById('min');
    const maxInput = document.getElementById('max');
    const typeCheckboxes = document.querySelectorAll('input[name="type[]"]');
    const sortButtons = document.querySelectorAll('[data-sort]');
    
    let isFilterVisible = false;
    let currentSort = 'date_desc'; 

    const params = new URLSearchParams(window.location.search);
    
    if (params.has('sort')) {
        currentSort = params.get('sort');
        setActiveSortButton(currentSort);
    }
    
    restoreFiltersFromURL(params);
    
    loadItems();
    
    filterBtn.addEventListener('click', function() {
        isFilterVisible = !isFilterVisible;
        filterBody.style.display = isFilterVisible ? 'flex' : 'none';
        filterSubmit.style.display = isFilterVisible ? 'block' : 'none';
        
        if (isFilterVisible) {
            localStorage.setItem('filter_visible', 'true');
        } else {
            localStorage.removeItem('filter_visible');
        }
    });
    
    sortButtons.forEach(button => {
        button.addEventListener('click', function() {
            currentSort = this.getAttribute('data-sort');
            setActiveSortButton(currentSort);
            updateURLParam('sort', currentSort);
            loadItems();
        });
    });
    
    filterSubmit.addEventListener('click', function() {
        applyFilters();
    });
    
    [minInput, maxInput].forEach(input => {
        input.addEventListener('input', function(e) {
            this.value = this.value.replace(/[^\d]/g, '');
        });
        
        input.addEventListener('blur', function() {
            if (this.value) {
                const num = parseInt(this.value);
                if (!isNaN(num)) {
                    this.value = num.toLocaleString('ru-RU');
                }
            }
        });
        
        input.addEventListener('focus', function() {
            this.value = this.value.replace(/\s/g, '');
        });
    });
    
    if (localStorage.getItem('filter_visible') === 'true') {
        setTimeout(() => {
            filterBtn.click();
        }, 100);
    }
    
    window.addEventListener('popstate', function() {
        const newParams = new URLSearchParams(window.location.search);
        if (newParams.has('sort')) {
            currentSort = newParams.get('sort');
            setActiveSortButton(currentSort);
        }
        restoreFiltersFromURL(newParams);
        loadItems();
    });
    
    function setActiveSortButton(sortValue) {
        sortButtons.forEach(button => {
            button.classList.remove('selected__button');
            if (button.getAttribute('data-sort') === sortValue) {
                button.classList.add('selected__button');
            }
        });
    }
    
    function restoreFiltersFromURL(params) {
        if (params.has('min')) {
            const minValue = params.get('min');
            minInput.value = parseInt(minValue).toLocaleString('ru-RU');
        }
        
        if (params.has('max')) {
            const maxValue = params.get('max');
            maxInput.value = parseInt(maxValue).toLocaleString('ru-RU');
        }
        
        if (params.has('type')) {
            const selectedTypes = params.getAll('type');
            typeCheckboxes.forEach(checkbox => {
                checkbox.checked = selectedTypes.includes(checkbox.value);
            });
        }
    }
    
    function applyFilters() {
        const params = new URLSearchParams();
        
        params.set('sort', currentSort);
        
        const minValue = minInput.value.replace(/\s/g, '');
        if (minValue) {
            params.set('min', minValue);
        }
        
        const maxValue = maxInput.value.replace(/\s/g, '');
        if (maxValue) {
            params.set('max', maxValue);
        }
        
        typeCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                params.append('type', checkbox.value);
            }
        });
        
        const newUrl = window.location.pathname + '?' + params.toString();
        window.history.pushState({}, '', newUrl);
        
        loadItems();
    }
    
    function updateURLParam(key, value) {
        const params = new URLSearchParams(window.location.search);
        params.set(key, value);
        const newUrl = window.location.pathname + '?' + params.toString();
        window.history.pushState({}, '', newUrl);
    }
});

function loadItems() {
    const params = getFilterParams();
    const apiUrl = '/shop/api/get/items/index.php';
    
    showLoading();
    
    console.log('Отправка параметров:', params);
    
    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(params)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Ошибка сети: ' + response.status);
        }
        return response.json();
    })
    .then(data => {
        console.log('Получено товаров:', data.length);
        
        if (data.status === "401" || data.status === "500") {
            showError(data.message);
            return;
        }
        
        updateResultsCount(data.length);
        displayItems(data);
    })
    .catch(error => {
        console.error('Ошибка:', error);
        showError('Ошибка при загрузке данных: ' + error.message);
    });
}

function getFilterParams() {
    const params = new URLSearchParams(window.location.search);
    const filterParams = {};
    
    if (params.has('sort')) {
        const sort = params.get('sort');
        switch(sort) {
            case 'price_asc':
                filterParams.price = 'asc';
                break;
            case 'price_desc':
                filterParams.price = 'desc';
                break;
            case 'rating_desc':
                filterParams.popular = 'desc';
                break;
            case 'date_desc':
                filterParams.data = 'desc';
                break;
        }
    }
    
    if (params.has('min')) {
        const minValue = params.get('min').replace(/\s/g, '');
        if (minValue) filterParams.min = minValue;
    }
    
    if (params.has('max')) {
        const maxValue = params.get('max').replace(/\s/g, '');
        if (maxValue) filterParams.max = maxValue;
    }
    
    const types = params.getAll('type');
    if (types.length > 0) {
        filterParams.type = types;
    }
    
    return filterParams;
}

function displayItems(items) {
    const itemsContainer = document.querySelector('.body--items--body');
    
    itemsContainer.innerHTML = '';
    
    if (items.length === 0) {
        itemsContainer.innerHTML = `
            <div class="no-items">
                <p>Товары не найдены</p>
                <p>Попробуйте изменить параметры фильтрации</p>
            </div>
        `;
        return;
    }
    
    items.forEach(item => {
        const itemElement = createItemElement(item);
        itemsContainer.appendChild(itemElement);
    });
}

function createItemElement(item) {
    const container = document.createElement('div');
    container.className = 'container';
    
    const formattedPrice = formatPrice(item.price);
    const formattedLastPrice = item.last_price ? formatPrice(item.last_price) : null;
    const rating = parseFloat(item.rating || 0);
    const isPopular = rating > 4;
    
    container.innerHTML = `
        <div class="container--image ${isPopular ? 'popular' : ''}">
            <img src="${item.image || '../css/images/photo-1.jpg'}" alt="${item.name}" onerror="this.src='../css/images/photo-1.jpg'">
        </div>
        
        <div class="container--info">
            <div class="container--info--body">
                <p class="item-name">${escapeHtml(item.name)}</p>
                ${item.description ? `<p class="item-description">${escapeHtml(item.description)}</p>` : ''}
                
                <div class="price-container">
                    ${formattedLastPrice ? `
                        <span class="old-price">${formattedLastPrice} ₽</span>
                        <span class="current-price">${formattedPrice} ₽</span>
                    ` : `
                        <span class="current-price single">${formattedPrice} ₽</span>
                    `}
                </div>
                
                <div class="item-stats">
                    <span class="rating">
                        ⭐ ${rating.toFixed(1)}
                    </span>
                    <span class="buys">
                        🛒 ${item.buys || 0} покупок
                    </span>
                </div>
            </div>
            
            <div class="container--info--buy">
                <button class="buy-button" data-id="${item.id}">Купить</button>
            </div>
        </div>
    `;
    
    const buyButton = container.querySelector('.buy-button');
    buyButton.addEventListener('click', function() {
        addToCart(item.id, item.name);
    });
    
    return container;
}

function showLoading() {
    const itemsContainer = document.querySelector('.body--items--body');
    itemsContainer.innerHTML = `
        <div class="loading">
            <div class="loading-spinner"></div>
            <p>Загрузка товаров...</p>
        </div>
    `;
}

function showError(message) {
    const itemsContainer = document.querySelector('.body--items--body');
    itemsContainer.innerHTML = `
        <div class="error">
            <p>❌ ${message}</p>
            <button onclick="loadItems()">Попробовать снова</button>
        </div>
    `;
}

function updateResultsCount(count) {
    const resultsElement = document.querySelector('.main--body p');
    if (resultsElement) {
        resultsElement.textContent = `Результатов: ${count}`;
    }
}

function formatPrice(price) {
    const num = parseFloat(price);
    if (isNaN(num)) return '0';
    return num.toLocaleString('ru-RU');
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function addToCart(productId, productName) {
    console.log(`Добавлен товар ${productId}: ${productName}`);
    
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.textContent = `Товар "${productName}" добавлен в корзину`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

window.loadItems = loadItems;