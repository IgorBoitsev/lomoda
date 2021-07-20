const renderGoodsPage = () => {

  // Сохранение хэша и ссылки для определения категорий товаров
  let hash = location.hash.substring(1);

  // Функция смены заголовка страницы
  const changeTitle = () => {
    document.querySelectorAll('.navigation__link').forEach(item => {
      if (item.href == location.href)
        document.querySelector('.goods__title').textContent = item.textContent;
    });
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
  
  const getGoods = (callback, value) => {
    getData()
      .then(data => {
        if (value) {
          callback(data.filter(item => item.category === value))
        } else {
          callback(data);
        }
      })
      .catch(err => console.error(err));
  }
  
  // Проверка на какой странице находимся
  try {
    const goodsList = document.querySelector('.goods__list');
  
    if (!goodsList) throw 'Это не страница товаров.';

    // Создание карточки товара
    const createCard = ({ id, preview, cost, brand, name, sizes }) => {
  
      const li = document.createElement('li');
      li.classList.add('goods__item');
      li.innerHTML = `<article class="good">
                        <a class="good__link-img" href="card-good.html#${id}">
                          <img class="good__img" src="goods-image/${preview}" alt="">
                        </a>
                        <div class="good__description">
                          <p class="good__price">${cost} &#8381;</p>
                          <h3 class="good__title">${brand} <span class="good__title__grey">/ ${name}</span></h3>
                          
                          ${sizes ? `<p class="good__sizes">Размеры (RUS): <span class="good__sizes-list">${sizes.join(' ')}</span></p>`
                            : ''}
                          
                          <a class="good__link" href="card-good.html#${id}">Подробнее</a>
                        </div>
                      </article>`;
      return li;
    };
  
    // Функция отрисовки всех карточек с товарами на странице
    const renderGoodsList = data => {
      // Предварительная очистка всех карточек
      goodsList.textContent = '';
      // Заполнение стрнаицы карточками товаров
      data.forEach(item => {
        const card = createCard(item);
        goodsList.append(card);
      });
    };


    window.addEventListener('hashchange', () => {
      hash = location.hash.substring(1);
      getGoods(renderGoodsList, hash);
      changeTitle();
    })
  
    // Заголовок страницы в соответствии с категорией товаров
    changeTitle();
    // Получение данных с сервера и отрисовка всех карточек
    getGoods(renderGoodsList, hash);

  } catch (error) {
    console.warn(error);
  }
  
}

export { renderGoodsPage };