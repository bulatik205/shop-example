document.addEventListener('DOMContentLoaded', function() {
    loadItems();
    
    window.addEventListener('popstate', function() {
        loadItems();
    });
});

function loadItems() {
    const params = getFilterParams();
    const apiUrl = '/shop/api/get/items/index.php';
    
    showLoading();
    
    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(params)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (data.status === "401" || data.status === "500") {
            showError(data.message);
            return;
        }
        
        updateResultsCount(data.length);
        
        displayItems(data);
    })
    .catch(error => {
        console.error('Error:', error);
        showError('Ошибка при загрузке данных');
    });
}

function getFilterParams() {
    const params = new URLSearchParams(window.location.search);
    const filterParams = {};
    
    if (params.has('price')) {
        filterParams.price = params.get('price');
    }
    
    if (params.has('popular')) {
        filterParams.popular = params.get('popular');
    }
    
    if (params.has('data')) {
        filterParams.data = params.get('data');
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
    
    const isPopular = parseFloat(item.rating) > 4;
    const popularClass = isPopular ? 'popular' : '';
    
    container.innerHTML = `
        <div class="container--image ${popularClass}">
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
                        ⭐ ${parseFloat(item.rating).toFixed(1)}
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
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
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