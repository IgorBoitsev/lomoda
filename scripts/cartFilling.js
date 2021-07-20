const cartFilling = () => {

  const getLocalStorage = () => JSON?.parse(localStorage.getItem('cart-lomoda')) || [];
  const setLocalStorage = (data) => localStorage.setItem('cart-lomoda', JSON.stringify(data));

}

export { cartFilling };