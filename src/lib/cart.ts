import { IProduct } from "../../types";

export const getCartItems = (): IProduct[] => {
  if (typeof window === 'undefined') return [];
  const storedCart = localStorage.getItem('cart');
  return storedCart ? JSON.parse(storedCart) : [];
};

export const addToCart = (product: IProduct): void => {
  const cartItems = getCartItems();
  const updatedCart = [...cartItems, product];
  localStorage.setItem('cart', JSON.stringify(updatedCart));
};

export const removeFromCart = (productId: string): void => {
  const cartItems = getCartItems();
  const updatedCart = cartItems.filter(item => item.id !== productId);
  localStorage.setItem('cart', JSON.stringify(updatedCart));
};

export const clearCart = (): void => {
  localStorage.removeItem('cart');
};
