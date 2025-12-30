const filter__price__top = document.getElementById("filter__price__top");
const filter__price__down = document.getElementById("filter__price__down");
const filter__popular__top = document.getElementById("filter__popular__top");
const filter__popular__down = document.getElementById("filter__popular__down");
const filter__data__new = document.getElementById("filter__data__new");
const filter__data__last = document.getElementById("filter__data__last");
const filter = document.getElementById("filter");
const filter__body = document.getElementById("filter--body");
const filter__submit = document.getElementById("filter--submit");
const minPriceInput = document.querySelector('.price-input[data-type="min"]');
const maxPriceInput = document.querySelector('.price-input[data-type="max"]');
const typeCheckboxes = document.querySelectorAll('input[name="type[]"]');

const PRODUCT_TYPES = ['shirts', 'pants', 'shorts', 'socks', 'hats', 'shoes'];

let isHide = true;

document.addEventListener('DOMContentLoaded', function () {
    if (localStorage.getItem("menu--open") === "true") {
        setTimeout(() => {
            filter.click();
        }, 1);
    }
    
    restoreFiltersFromURL(params);
    
    setupPriceInputs();
});

function restoreFiltersFromURL(params) {
    if (params.has('price')) {
        if (params.get('price') === 'top') {
            filter__price__top.classList.add('selected__button');
            filter__price__down.classList.remove('selected__button');
        } else if (params.get('price') === 'down') {
            filter__price__top.classList.remove('selected__button');
            filter__price__down.classList.add('selected__button');
        }
    }

    if (params.has('popular')) {
        if (params.get('popular') === 'top') {
            filter__popular__top.classList.add('selected__button');
            filter__popular__down.classList.remove('selected__button');
        } else if (params.get('popular') === 'down') {
            filter__popular__top.classList.remove('selected__button');
            filter__popular__down.classList.add('selected__button');
        }
    }

    if (params.has('data')) {
        if (params.get('data') === 'new') {
            filter__data__new.classList.add('selected__button');
            filter__data__last.classList.remove('selected__button');
        } else if (params.get('data') === 'last') {
            filter__data__new.classList.remove('selected__button');
            filter__data__last.classList.add('selected__button');
        }
    }

    if (params.has('min')) {
        const minValue = params.get('min');
        minPriceInput.value = parseInt(minValue).toLocaleString('ru-RU');
    }

    if (params.has('max')) {
        const maxValue = params.get('max');
        maxPriceInput.value = parseInt(maxValue).toLocaleString('ru-RU');
    }

    if (params.has('type')) {
        const selectedTypes = params.getAll('type');
        
        typeCheckboxes.forEach(checkbox => {
            if (selectedTypes.includes(checkbox.value)) {
                checkbox.checked = true;
            }
        });
    }
}

function setupPriceInputs() {
    [minPriceInput, maxPriceInput].forEach(input => {
        if (!input) return;
        
        input.addEventListener('input', function (e) {
            this.value = this.value.replace(/[^\d]/g, '');
        });

        input.addEventListener('blur', function () {
            if (this.value) {
                const num = parseInt(this.value);
                if (!isNaN(num)) {
                    this.value = num.toLocaleString('ru-RU');
                }
            }
        });

        input.addEventListener('focus', function () {
            this.value = this.value.replace(/\s/g, '');
        });

        input.addEventListener('keydown', function (e) {
            if (!/[\d]|Backspace|Delete|Tab|ArrowLeft|ArrowRight/.test(e.key)) {
                e.preventDefault();
            }
        });
    });

    maxPriceInput.addEventListener('blur', function () {
        const minValue = parseInt(minPriceInput.value.replace(/\s/g, '')) || 0;
        const maxValue = parseInt(this.value.replace(/\s/g, '')) || 0;

        if (maxValue > 0 && minValue > maxValue) {
            this.value = (minValue + 100).toLocaleString('ru-RU');
        }
    });
}

filter.addEventListener('click', function () {
    if (isHide) {
        isHide = false;
        filter__body.style.display = "flex";
        filter__submit.style.display = "block";
    } else {
        localStorage.removeItem("menu--open");
        localStorage.setItem("menu--open", false);
        isHide = true;
        filter__body.style.display = "none";
        filter__submit.style.display = "none";
    }
});

function handleSortClick(button, paramName, value) {
    const buttonGroup = button.closest('.filter--container--button');
    buttonGroup.querySelectorAll('button').forEach(btn => {
        btn.classList.remove('selected__button');
    });
    
    button.classList.add('selected__button');
    
    updateURL(paramName, value);
}

filter__price__top.addEventListener('click', function() {
    handleSortClick(this, 'price', 'top');
});

filter__price__down.addEventListener('click', function() {
    handleSortClick(this, 'price', 'down');
});

filter__popular__top.addEventListener('click', function() {
    handleSortClick(this, 'popular', 'top');
});

filter__popular__down.addEventListener('click', function() {
    handleSortClick(this, 'popular', 'down');
});

filter__data__new.addEventListener('click', function() {
    handleSortClick(this, 'data', 'new');
});

filter__data__last.addEventListener('click', function() {
    handleSortClick(this, 'data', 'last');
});

filter__submit.addEventListener('click', function() {
    applyAllFilters();
});
function updateURL(paramName, paramValue) {
    const params = new URLSearchParams(window.location.search);
    params.set(paramName, paramValue);
    window.location.search = params.toString();
    localStorage.setItem("menu--open", true);
}

function applyAllFilters() {
    const params = new URLSearchParams();
    
    if (filter__price__top.classList.contains('selected__button')) {
        params.set('price', 'top');
    } else if (filter__price__down.classList.contains('selected__button')) {
        params.set('price', 'down');
    }
    
    if (filter__popular__top.classList.contains('selected__button')) {
        params.set('popular', 'top');
    } else if (filter__popular__down.classList.contains('selected__button')) {
        params.set('popular', 'down');
    }
    
    if (filter__data__new.classList.contains('selected__button')) {
        params.set('data', 'new');
    } else if (filter__data__last.classList.contains('selected__button')) {
        params.set('data', 'last');
    }
    
    const minValue = minPriceInput.value.replace(/\s/g, '');
    if (minValue) {
        params.set('min', minValue);
    }
    
    const maxValue = maxPriceInput.value.replace(/\s/g, '');
    if (maxValue) {
        params.set('max', maxValue);
    }
    
    typeCheckboxes.forEach(checkbox => {
        if (checkbox.checked) {
            params.append('type', checkbox.value);
        }
    });
    
    window.location.search = params.toString();
    localStorage.setItem("menu--open", true);
}