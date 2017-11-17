const Dispatcher = document.getElementById('doc');

class PropertySelector {
    constructor(el) {
        this.el = el;

        this.el.addEventListener('click', ev => {
            const type = ev.target.dataset['type'];
            const value = ev.target.dataset['value'];
            const target = ev.target;

            this.dispatchEvent(type, value, target);
        });
    }

    dispatchEvent(type, value, target) {
        const event = new CustomEvent('property-selected', {
            detail: {
                type: type,
                value: value,
                target: target
            }
        });
        
        Dispatcher.dispatchEvent(event);
    }
}

new PropertySelector(document.getElementById('colorList'));
new PropertySelector(document.getElementById('sizeList'));

Dispatcher.addEventListener('property-selected', ev => {
    const data = ev.detail;

    if (data.type === 'color') {
        changePicture(data.value);
        const colorElements = document.getElementsByClassName('js-product-color__item');
        updateBorders(colorElements, data.target);
    }

    if (data.type === 'size') {
        changePrice();
        const sizeElements = document.getElementsByClassName('js-product-size__item');
        updateBorders(sizeElements, data.target);
    }
});

function changePrice() {
    document.getElementById('priceValue').innerHTML = +randomInteger(500, 1500);
}

function changePicture(color) {
    document.getElementById('productPicture').src = 'img/tshirts/tshirt_' + color + '.jpg';
}

function updateBorders(elements, target) {
    [].forEach.call(elements, function (element) {
        if (element === target) {
            activate(element, true, 'product-details_active', 'product-details_inactive');
        } else {
            activate(element, false, 'product-details_active', 'product-details_inactive');
        }
    });
}

function activate(target, isActive, addClass, delClass) {
    if (isActive === true) {
        target.classList.add(addClass);
        target.classList.remove(delClass);
    } else {
        target.classList.add(delClass);
        target.classList.remove(addClass);
    }
}

function randomInteger(min, max) {
    let randomNum = min - 0.5 + Math.random() * (max - min + 1);
    randomNum = Math.round(randomNum);
    return randomNum;
}

document.querySelector('.js-product-form').addEventListener('submit', function() {
    const price = document.querySelector('.js-product-details__currency').innerHTML;
    const active = document.querySelectorAll('.product-details_active');
    const parameters = { price: price };
    [].forEach.call(active, function (element) {
        if (element.classList.contains('js-product-size__item')) {
            parameters['size'] = element.getAttribute('data-value');
        } else {
            parameters['color'] = element.getAttribute('data-value');
        }
    });

    const orderForm = document.getElementById('order');
    sendRequest(orderForm, 'http://localhost:3000/', parameters);
});

document.querySelector('.js-search').addEventListener('submit', function() {
    const text = document.querySelector('.js-search__input').value;
    const parameters = { text: text };

    const searchForm = document.getElementById('search');
    sendRequest(searchForm, 'http://localhost:3000/', parameters);
});

function sendRequest(form, path, parameters) {
    event.preventDefault();
    for (const key in parameters) {
        if (parameters.hasOwnProperty(key)) {
            const hiddenField = document.createElement('input');
            hiddenField.setAttribute('type', 'hidden');
            hiddenField.setAttribute('name', key);
            hiddenField.setAttribute('value', parameters[key]);
            form.appendChild(hiddenField);
        }
    }
    form.submit();
}
