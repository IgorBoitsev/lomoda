import { renderGoodsPage } from "./renderGoodsPage.js";
import { cityInputModal } from "./cityInputModal.js";
import { renderSingleGoodPage } from "./renderSingleGoodPage.js";
// import { cartFilling } from "./cartFilling.js";

renderGoodsPage();
renderSingleGoodPage();
// cartFilling();


const headerCityButton = document.querySelector('.header__city-button'),
      subheaderCart = document.querySelector('.subheader__cart'),
      cartOverlay = document.querySelector('.cart-overlay'),
      cartTableWrapper = document.querySelector('.cart__table-wrapper'),
      cartListGoods = document.querySelector('.cart__list-goods'),
      cartTotalCost = document.querySelector('.cart__total-cost');

// Подгрузка города, если он был сохранен в LocalStorage
headerCityButton.textContent = localStorage.getItem('lomoda-location') || 'Ваш город?';
const getLocalStorage = () => JSON?.parse(localStorage.getItem('cart-lomoda')) || [];
const setLocalStorage = (data) => localStorage.setItem('cart-lomoda', JSON.stringify(data));
// Предварительная очистка корзины
const renderCart = () => {
  const cartItems = getLocalStorage();

  let totalPrice = 0;

  if (cartItems.length === 0) cartTableWrapper.textContent = 'В корзине пока пусто...'
    else {
      cartListGoods.textContent = '';

      cartItems.forEach((item, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${index + 1}</td>
                        <td>${item.brand} ${item.name}</td>
                        ${item.color ? `<td>${item.color}</td>` : '<td>--</td>'}
                        ${item.size ? `<td>${item.size}</td>` : '<td>--</td>'}
                        <td>${item.cost} &#8381;</td>
                        <td><button class="btn-delete" data-id="${item.id}">&times;</button></td>`;
        
        totalPrice += item.cost;
        cartListGoods.append(tr);
      });

      cartTotalCost.textContent = totalPrice + ' ₽';
    }
}
// Функция удаления товара из корзины
const deleteItemCart = id => {
  const cartItems = getLocalStorage();
  const newCartItems = cartItems.filter(item => item.id !== id);
  setLocalStorage(newCartItems);
}

// Функция открытия модального окна с корзиной
const cartModalOpen = () => {
  renderCart();
  cartOverlay.classList.add('cart-overlay-open');
  disableScroll();
}
// Функция закрытия модального окна с корзиной по клику мыши или по нажатию клавиши Escape
const cartModalClose = (e) => {
  switch (e.type) {
    case 'click':
      if (e.target.classList.contains('cart__btn-close') || e.target.classList.contains('cart-overlay')) {
        cartOverlay.classList.remove('cart-overlay-open');
      }
      break;
    case 'keydown':
      if (e.code == 'Escape') {
        cartOverlay.classList.remove('cart-overlay-open');
      }
      break;
    default:
      break;
  }
  enableScroll();
}
// Функция блокировки скролла
const disableScroll = () => {
  // Ширина полосы прокрутки (скролла)
  const scrollWidth = window.innerWidth - document.body.offsetWidth;
  // 
  document.body.dbScrollY = window.scrollY;
  // Смещение видимой части контента влево на ширину полосы прокрутки
  document.body.style.cssText = `position: fixed;
                                 top: ${-window.scrollY}px;
                                 width: 100%;
                                 height: 100vh;
                                 overflow: hidden;
                                 padding-right: ${scrollWidth}px;`;
}
// Функция разблокировки скролла
const enableScroll = () => {
  // Сброс настроек для блокировки скролла
  document.body.style.cssText = '';
  window.scroll({
    top: document.body.dbScrollY
  });
}


// Ввод названия города
headerCityButton.addEventListener('click', cityInputModal);

subheaderCart.addEventListener('click', cartModalOpen);
cartOverlay.addEventListener('click', (event) => cartModalClose(event));
document.addEventListener('keydown', (event) => cartModalClose(event));
cartListGoods.addEventListener('click', e => {
  if (e.target.classList.contains('btn-delete')) {
    deleteItemCart(e.target.dataset.id);
    renderCart();
  }
})