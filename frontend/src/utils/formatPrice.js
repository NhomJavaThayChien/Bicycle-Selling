export const formatPrice = (value) => {
  if (typeof value !== 'number') {
    return '0 VND';
  }

  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(value);
};
