document.querySelector('.js-product-form').addEventListener('click', event => {
    if (!event.target.matches('.js-product-details')) {
        return;
    }

    const target = event.target;

    const color = target.getAttribute('data-value');
    if (target.classList.contains('js-product-color__item')) {
        document.getElementById('tShirt').src = 'img/tshirts/tshirt_' + color + '.jpg';
    }

    const colorElements = document.getElementsByClassName('js-product-color__item');
    if (target.classList.contains('js-product-color__item')) {
        updateBorders(colorElements, target);
    }

    const sizeElements = document.getElementsByClassName('js-product-size__item');
    if (target.classList.contains('js-product-size__item')) {
        updateBorders(sizeElements, target);
    }
});

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

document.querySelector('.js-product-form').addEventListener('submit', function() {
    const price = document.querySelector('.js-product-details__currency').getAttribute('data-value');
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
