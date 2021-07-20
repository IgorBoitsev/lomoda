// Функция открытия и закрытия модального окна с вводом названия города
const cityInputModal = () => {

  const headerCityButton = document.querySelector('.header__city-button'),
        cityInputOverlay = document.querySelector('.cart-overlay.city-input-overlay'),
        cityInput = document.querySelector('.city-input'), 
        modalBtnCity = document.querySelector('.cart__btn-buy.modal__btn-city');

  cityInputOverlay.classList.add('cart-overlay-open');

  // Сохранение названия города
  modalBtnCity.addEventListener('click', () => {
    // Сохранение названия города в LocalStorage
    localStorage.setItem('lomoda-location', cityInput.value);

    if (cityInput.value.trim() === '') {
      headerCityButton.textContent = 'Ваш город?';
    } else {
      headerCityButton.textContent = cityInput.value;
    }

    cityInputOverlay.classList.remove('cart-overlay-open');
  })
  // Закрытие модального окна с вводом названия города
  cityInputOverlay.addEventListener('click', (event) => {
    if (event.target.classList.contains('cart__btn-close') || event.target.classList.contains('city-input-overlay')) {
      cityInputOverlay.classList.remove('cart-overlay-open');
    }
  })

}

export {cityInputModal};