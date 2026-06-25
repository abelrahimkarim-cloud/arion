export type CartItem = {
  productId?: number;
  variantId: number;
  productName: string;
  color: string;
  size: string;
  price: number;
  imageUrl?: string;
  quantity: number;
};

const CART_KEY = 'streetwearCart';
const CART_UPDATED_EVENT = 'cart-updated';

const isClient = () => typeof window !== 'undefined';

const parseCart = (raw: string | null): CartItem[] => {
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item) => {
      return (
        item &&
        typeof item.variantId === 'number' &&
        typeof item.productName === 'string' &&
        typeof item.color === 'string' &&
        typeof item.size === 'string' &&
        typeof item.price === 'number' &&
        typeof item.quantity === 'number'
      );
    });
  } catch {
    return [];
  }
};

const dispatchCartUpdate = () => {
  if (!isClient()) return;
  window.dispatchEvent(new Event(CART_UPDATED_EVENT));
};

export function getCart(): CartItem[] {
  if (!isClient()) return [];
  return parseCart(window.localStorage.getItem(CART_KEY));
}

export function saveCart(cart: CartItem[]): CartItem[] {
  if (!isClient()) return cart;
  window.localStorage.setItem(CART_KEY, JSON.stringify(cart));
  dispatchCartUpdate();
  return cart;
}

export function addCartItem(item: CartItem): CartItem[] {
  const cart = getCart();
  const existingIndex = cart.findIndex((cartItem) => cartItem.variantId === item.variantId);

  if (existingIndex >= 0) {
    cart[existingIndex].quantity += item.quantity;
  } else {
    cart.push(item);
  }

  return saveCart(cart);
}

export function updateCartItemQuantity(variantId: number, quantity: number): CartItem[] {
  const cart = getCart();
  const existingIndex = cart.findIndex((item) => item.variantId === variantId);

  if (existingIndex === -1) {
    return cart;
  }

  if (quantity <= 0) {
    return removeCartItem(variantId);
  }

  cart[existingIndex].quantity = quantity;
  return saveCart(cart);
}

export function removeCartItem(variantId: number): CartItem[] {
  const cart = getCart().filter((item) => item.variantId !== variantId);
  return saveCart(cart);
}

export function clearCart(): CartItem[] {
  if (!isClient()) return [];
  window.localStorage.removeItem(CART_KEY);
  dispatchCartUpdate();
  return [];
}

export function getCartCount(): number {
  return getCart().reduce((sum, item) => sum + item.quantity, 0);
}

export function onCartUpdated(callback: () => void) {
  if (!isClient()) return () => undefined;
  window.addEventListener(CART_UPDATED_EVENT, callback);
  return () => window.removeEventListener(CART_UPDATED_EVENT, callback);
}
