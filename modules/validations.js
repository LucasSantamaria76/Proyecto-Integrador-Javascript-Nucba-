export const formData = {
  id: '',
  description: '',
  stock: '',
  price: '',
  unit: '',
  volume: '',
};

export const notValid = (field) => {
  const fields = {
    id: () => {
      if (!formData.id.trim().length)
        return {
          id: 'El código de barra es requerido',
        };
      return !/^[0-9]{13,13}$/.test(formData.id) ? { id: 'Formato no válido: El código es de 13 dígitos' } : null;
    },
    description: () =>
      !formData.description.trim().length
        ? {
            description: 'La descripción no puede estar vacía',
          }
        : null,
    stock: () => {
      if (!formData.stock.trim().length)
        return {
          stock: 'El stock es requerido',
        };
      return !/^\d*$/.test(Number(formData.stock)) ? { stock: 'Formato no válido' } : null;
    },
    price: () => {
      if (!formData.price.trim().length)
        return {
          price: 'El precio es requerido',
        };
      return !/^\d*\.?\d{0,2}$/.test(Number(formData.price)) ? { price: 'Formato no válido' } : null;
    },
    unit: () => {
      if (formData.unit === '') return { unit: 'Seleccione una unidad de medida' };
    },
    volume: () => {
      if (!formData.volume.trim().length)
        return {
          volume: 'El volumen es requerido',
        };
      return !/^\d*\.?\d{0,2}$/.test(Number(formData.volume)) ? { volume: 'Formato no válido' } : null;
    },
  };
  return fields[field]();
};
