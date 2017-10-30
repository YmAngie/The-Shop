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
            activate(element, true);
        } else {
            activate(element, false);
        }
    });
}

function activate(target, isActive) {
    if (isActive === true) {
        target.classList.add('js-product-details_active');
        target.classList.remove('js-product-details_inactive');
    } else {
        target.classList.add('js-product-details_inactive');
        target.classList.remove('js-product-details_active');
    }
}

document.querySelector('.js-product-details__buy').addEventListener('click', function() {
    const price = document.querySelector('.js-product-details__rubles').getAttribute('data-value');
    const active = document.querySelectorAll('.js-product-details_active');
    const parameters = { price: price };
    [].forEach.call(active, function (element) {
        if (element.classList.contains('js-product-size__item')) {
            parameters['size'] = element.getAttribute('data-value');
        } else {
            parameters['color'] = element.getAttribute('data-value');
        }
    });

    const form = document.getElementById('order');
    post(form, 'http://localhost:3000/', parameters);
});

document.querySelector('.js-search__submit').addEventListener('click', function() {
    const text = document.querySelector('.js-search__input').value;
    const parameters = { text: text };

    const form = document.getElementById('search');
    post(form, 'http://localhost:3000/', parameters);
});

function post(form, path, parameters) {
    form.setAttribute('action', path);
    form.setAttribute('method', 'post');
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
