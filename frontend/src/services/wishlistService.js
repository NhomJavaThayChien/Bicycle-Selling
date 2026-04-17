import api from './api';

const WISHLIST_KEY = 'wishlist_items';

const readWishlist = () => {
  const raw = localStorage.getItem(WISHLIST_KEY);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeWishlist = (items) => {
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(items));
};

export const getWishlist = () => readWishlist();

export const isInWishlist = (listingId) => {
  const items = readWishlist();
  return items.some((item) => item.id === listingId);
};

export const addToWishlist = (listing) => {
  const items = readWishlist();
  if (items.some((item) => item.id === listing.id)) {
    return items;
  }

  const next = [listing, ...items];
  writeWishlist(next);
  return next;
};

export const removeFromWishlist = (listingId) => {
  const items = readWishlist();
  const next = items.filter((item) => item.id !== listingId);
  writeWishlist(next);
  return next;
};

export const clearWishlist = () => {
  writeWishlist([]);
};

export const fetchWishlist = async () => {
  try {
    const response = await api.get('/buyer/wishlist');
    const items = Array.isArray(response.data) ? response.data : [];
    writeWishlist(items);
    return items;
  } catch {
    return readWishlist();
  }
};

export const addToWishlistApi = async (listing) => {
  try {
    await api.post(`/buyer/wishlist/${listing.id}`);
    const items = await fetchWishlist();
    return items;
  } catch {
    return addToWishlist(listing);
  }
};

export const removeFromWishlistApi = async (listingId) => {
  try {
    await api.delete(`/buyer/wishlist/${listingId}`);
    const items = await fetchWishlist();
    return items;
  } catch {
    return removeFromWishlist(listingId);
  }
};
