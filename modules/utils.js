export const parseCurrency = (value) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
  }).format(value);

export const getProducts = async () => {
  const res = await fetch('./data/products.json');
  return res.json();
};
