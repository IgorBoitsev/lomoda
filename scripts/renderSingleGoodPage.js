// Отрисовка страницы с конкретным товаром
const renderSingleGoodPage = () => {

  const cardGoodImage = document.querySelector('.card-good__image'),
        cardGoodBrand = document.querySelector('.card-good__brand'),
        cardGoodTitle = document.querySelector('.card-good__title'),
        cardGoodPrice = document.querySelector('.card-good__price'),
        cardGoodColor = document.querySelector('.card-good__color'),
        cardGoodColorList = document.querySelector('.card-good__color-list'),
        cardGoodSizes = document.querySelector('.card-good__sizes'),
        cardGoodSizesList = document.querySelector('.card-good__sizes-list'),
        cardGoodBuy = document.querySelector('.card-good__buy'),
        cardGoodSelectWrapper = document.querySelectorAll('.card-good__select__wrapper'),
        cartListGoods = document.querySelector('.cart__list-goods');
  
  // Сохранение хэша и ссылки для определения категорий товаров
  let hash = location.hash.substring(1);
  // Генерирование списка цветов и размеров
  const generateList = (data) => {
    let html = '';
    data.forEach((item, index) => {
      html = html + `<li class="card-good__select-item" data-id="${index}">${item}</li>`;
    })

    return html;
  }
  // 
  const getLocalStorage = () => JSON?.parse(localStorage.getItem('cart-lomoda')) || [];
  const setLocalStorage = (data) => localStorage.setItem('cart-lomoda', JSON.stringify(data));
  // Функция наполнения карточки товара данными
  const renderCardGood = ([{ id, color, photo, cost, brand, name, sizes }]) => {

    const data = { brand, name, cost, id };

    cardGoodImage.src = `goods-image/${photo}`;
    cardGoodImage.alt = `${brand} ${name}`;
    cardGoodBrand.textContent = brand;
    cardGoodTitle.textContent = name;
    cardGoodPrice.textContent = `${cost} ₽`;
    if (color) {
      cardGoodColor.textContent = color[0];
      cardGoodColor.dataset.id = 0;
      cardGoodColorList.innerHTML = generateList(color);
    }
      else cardGoodColor.style.display = 'none';

    if (sizes) {
      cardGoodSizes.textContent = sizes[0];
      cardGoodSizes.dataset.id = 0;
      cardGoodSizesList.innerHTML = generateList(sizes);
    }
      else cardGoodSizes.style.display = 'none';

    if (getLocalStorage().some(item => item.id === id)) {
      cardGoodBuy.classList.add('delete');
      cardGoodBuy.textContent = 'Удалить из корзины';
    }

    cardGoodBuy.addEventListener('click', () => {
      if (cardGoodBuy.classList.contains('delete')) {
        setLocalStorage(getLocalStorage().filter(item => item.id !== id));
        cardGoodBuy.classList.remove('delete');
        cardGoodBuy.textContent = 'Добавить в корзину';
        return;
      }
      if (color) data.color = cardGoodColor.textContent;
      if (sizes) data.size = cardGoodSizes.textContent;

      cardGoodBuy.classList.add('delete');
      cardGoodBuy.textContent = 'Удалить из корзины';

      // Добавление и обновление корзины
      const cardData = getLocalStorage();
      cardData.push(data);
      setLocalStorage(cardData);
    })
  }
  // Получение данных с сервера
  const getData = async () => {
    const data = await fetch('db.json');
  
    if (data.ok) {
      return data.json();
    } else {
      throw new Error(`Данные не были получены. Ошибка ${data.status} ${data.statusText}`)
    }
  }
  // Получение товаров
  const getGoods = (callback, value) => {
    getData()
      .then(data => {
        if (value) {
          // id совпадает с hash
          callback(data.filter(item => item.id === value))
        } else {
          callback(data);
        }
      })
      .catch(err => console.error(err));
  }

  try {

    // Проверка нахождения на странице с конкретным товаром
    if (!document.querySelector('.card-good')) throw 'Это не страница с товаром.';

    getGoods(renderCardGood, hash);

    // Выпадающий список для цвета и размеров
    cardGoodSelectWrapper.forEach(item => {
      item.addEventListener('click', e => {
        if (e.target.closest('.card-good__select')) {
          e.target.classList.toggle('card-good__select__open');
        }

        if (e.target.closest('.card-good__select-item')) {
          item.querySelector('.card-good__select').textContent = e.target.textContent;
          item.querySelector('.card-good__select').dataset.id = e.target.id;
          item.querySelector('.card-good__select').classList.toggle('card-good__select__open');
        }
      })
    })

  } catch (error) {
    console.warn(error);
  }

}

export { renderSingleGoodPage };