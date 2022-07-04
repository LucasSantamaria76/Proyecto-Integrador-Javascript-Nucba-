let products;
const fragment = document.createDocumentFragment();
const templateCard = document.getElementById('template-card').content;
const templateTableTr = document.getElementById('template-table-tr').content;
const gridContainer = document.getElementById('grid-container');
const search = document.getElementById('search');
const form = document.getElementById('form');
const badgeCartNav = document.getElementById('badgeCartNav');
const btnCart = document.getElementById('btnCart');
const imgUser = document.getElementById('imgUser');
const userData = document.getElementById('user');
const tableBody = document.getElementById('tableBody');

const urlBase = 'https://imagenes.preciosclaros.gob.ar/productos/';

let currentUser;
const users = JSON.parse(localStorage.getItem('users')) || [];

const getProducts = async () => {
  const res = await fetch('./data/products.json');
  return res.json();
};

const parseCurrency = (value) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
  }).format(value);

const renderProducts = (listProducts) => {
  listProducts.forEach((item) => {
    while (gridContainer.firstChild) gridContainer.removeChild(gridContainer.firstChild);
    templateCard.querySelector('img').src = `${urlBase}${item.id}.jpg`;
    templateCard.querySelector('img').alt = item.category;
    templateCard.getElementById('title').textContent = item.description;
    templateCard.getElementById('price').textContent = `Precio ${parseCurrency(item.price)}`;
    templateCard.getElementById('info').textContent = `Precio por ${item.unit} ${parseCurrency(
      item.price * (1 / item.volume)
    )}`;
    templateCard.querySelector('p.card-text').textContent = `Stock ${item.stock}`;
    templateCard.querySelector('p.card-text').id = `stock-${item.id}`;
    const btnCartProduct = templateCard.querySelector('#btnCart');
    btnCartProduct.firstElementChild.id = `product-${item.id}`;
    btnCartProduct.dataset.id = item.id;
    if (currentUser) {
      const user = users.find((user) => user.email === currentUser);
      const productInCart = user.cart.find((el) => el.id === item.id);
      if (productInCart?.quantity) {
        btnCartProduct.firstElementChild.textContent = productInCart.quantity;
        btnCartProduct.firstElementChild.classList.remove('d-none');
      } else btnCartProduct.firstElementChild.classList.add('d-none');
    }

    const clone = templateCard.cloneNode(true);
    fragment.appendChild(clone);
  });

  gridContainer.appendChild(fragment);
};

document.addEventListener('DOMContentLoaded', async () => {
  currentUser = localStorage.getItem('currentUser') || null;
  userData.textContent = currentUser || 'Invitado';
  products = JSON.parse(localStorage.getItem('products')) || (await getProducts());
  localStorage.setItem('products', JSON.stringify(products));
  if (currentUser) {
    const user = users.find((user) => user.email === currentUser);
    const numberOfProductsInCart = user.cart.reduce((acc, el) => (acc += el.quantity), 0);
    badgeCartNav.textContent = numberOfProductsInCart;
  }
  renderProducts(products);
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const filterList = products.filter((el) =>
    el.description.toLowerCase().includes(search.value.toLowerCase())
  );
  renderProducts(filterList);
});

const logout = () => {
  currentUser &&
    Swal.fire({
      text: '¿ Desea cerrar la sesión ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'No',
      confirmButtonText: 'Si',
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('currentUser');
        currentUser = null;
        userData.textContent = 'Invitado';
        renderProducts(products);
        badgeCartNav.textContent = 0;
      }
    });
};

const renderCart = (user) => {
  while (tableBody.firstChild) tableBody.removeChild(tableBody.firstChild);
  let totalCart = 0;
  if (user.cart.length) {
    user.cart.forEach((el) => {
      const product = products.find((prod) => prod.id === el.id);

      templateTableTr.getElementById('cartX').dataset.id = el.id;
      templateTableTr.getElementById('imgProd').src = `${urlBase}${product.id}.jpg`;
      templateTableTr.getElementById('description').textContent = product.description;
      templateTableTr.getElementById('price').textContent = parseCurrency(product.price);
      templateTableTr.querySelector('.btn-danger').id = `cart-${el.id}`;
      templateTableTr.querySelector('.btn-danger').textContent = el.quantity;
      templateTableTr.getElementById('btnReduceQuantity').dataset.id = el.id;
      templateTableTr.getElementById('btnAddQuantity').dataset.id = el.id;
      templateTableTr.getElementById('subtotal').textContent = parseCurrency(
        product.price * el.quantity
      );
      totalCart += product.price * el.quantity;
      const clone = templateTableTr.cloneNode(true);
      document.querySelector('.footer-cart').classList.remove('d-none');
      document.getElementById('totalCart').textContent = parseCurrency(totalCart);
      fragment.appendChild(clone);
    });
  } else {
    const msg = document.createElement('h2');
    msg.setAttribute('style', 'margin:50px;width:100%;color:red;');
    msg.textContent = 'No hay productos en el carrito';
    document.querySelector('.footer-cart').classList.add('d-none');
    fragment.appendChild(msg);
  }
  tableBody.appendChild(fragment);
}; // End renderCart

const reduceProductToCart = (id, user, all) => {
  const idxUser = users.indexOf(user);
  const productInCart = user.cart.find((el) => el.id === id);
  const reduceQuantity = all ? productInCart.quantity : 1;

  user.cart[user.cart.indexOf(productInCart)].quantity -= reduceQuantity;

  const cart = user.cart.filter((el) => el.quantity > 0);

  users[idxUser] = { ...user, cart };
  localStorage.setItem('users', JSON.stringify(users));
  document.getElementById(`product-${id}`).classList.remove('d-none');

  const quantity = user.cart.find((el) => el.id === id).quantity;

  quantity
    ? (document.getElementById(`product-${id}`).textContent = quantity)
    : document.getElementById(`product-${id}`).classList.add('d-none');
  document.getElementById(`cart-${id}`).textContent = quantity;

  const product = products.find((el) => el.id === id);
  const newStock = products[products.indexOf(product)].stock + reduceQuantity;

  products[products.indexOf(product)].stock = newStock;
  document.getElementById(`stock-${id}`).textContent = `Stock ${newStock}`;
  localStorage.setItem('products', JSON.stringify(products));

  const numberOfProductsInCart = user.cart.reduce((acc, el) => (acc += el.quantity), 0);

  badgeCartNav.textContent = numberOfProductsInCart;
  renderCart(users[idxUser]);
}; // End reduceProductToCart

const addProductToCart = (id, user) => {
  const idxUser = users.indexOf(user);
  inStock = products.find((el) => el.id === id);

  if (inStock.stock) {
    const productInCart = user.cart.find((el) => el.id === id);
    productInCart
      ? (user.cart[user.cart.indexOf(productInCart)].quantity += 1)
      : user.cart.push({ id, quantity: 1 });
    users[idxUser] = user;
    localStorage.setItem('users', JSON.stringify(users));
    document.getElementById(`product-${id}`).classList.remove('d-none');
    document.getElementById(`product-${id}`).textContent = user.cart.find(
      (el) => el.id === id
    ).quantity;
    document.getElementById(`cart-${id}`) &&
      (document.getElementById(`cart-${id}`).textContent = user.cart.find(
        (el) => el.id === id
      ).quantity);
    products[products.indexOf(inStock)].stock -= 1;
    document.getElementById(`stock-${id}`).textContent = `Stock ${
      products[products.indexOf(inStock)].stock
    }`;
    localStorage.setItem('products', JSON.stringify(products));
    const numberOfProductsInCart = user.cart.reduce((acc, el) => (acc += el.quantity), 0);
    badgeCartNav.textContent = numberOfProductsInCart;
    renderCart(users[idxUser]);
  } else {
  }
}; // End addProductToCart

const emptyCart = (user) => {
  Swal.fire({
    text: '¿ Está seguro que desea vaciar el carrito ?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    cancelButtonText: 'No',
    confirmButtonText: 'Si',
  }).then((result) => {
    if (result.isConfirmed) {
      user.cart.forEach((el) => {
        reduceProductToCart(el.id, user, true);
      });
      user.cart = [];
    }
  });
};

document.onclick = (e) => {
  const user = users.find((user) => user.email === currentUser);

  if (!currentUser && e.target.id.toLowerCase.includes('cart')) {
    Swal.fire({
      text: 'Debes iniciar sesión para agregar al carrito',
      icon: 'info',
      confirmButtonText: 'Aceptar',
    });
    return;
  }

  switch (e.target.id) {
    case 'btnCartNav':
      renderCart(user);
      break;
    case 'btnCart':
    case 'btnAddQuantity':
      addProductToCart(e.target.dataset.id, user);
      break;
    case 'btnReduceQuantity':
      reduceProductToCart(e.target.dataset.id, user, false);
      break;
    case 'cartX':
      reduceProductToCart(e.target.dataset.id, user, true);
      break;
    case 'imgUser':
      logout();
      break;
    case 'emptyCart':
      emptyCart(user);
      break;
  }
}; // End document.onclick
