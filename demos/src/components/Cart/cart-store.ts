import { signal, computed } from 'kasper-js';

export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  emoji: string;
}

export interface CartItem extends Product {
  qty: number;
}

export const cartItems = signal<CartItem[]>([]);

export const cartCount = computed(() =>
  cartItems.value.reduce((sum, item) => sum + item.qty, 0)
);

export const cartTotal = computed(() =>
  cartItems.value.reduce((sum, item) => sum + item.price * item.qty, 0)
);

export function addToCart(product: Product) {
  const existing = cartItems.value.find(i => i.id === product.id);
  if (existing) {
    cartItems.value = cartItems.value.map(i =>
      i.id === product.id ? { ...i, qty: i.qty + 1 } : i
    );
  } else {
    cartItems.value = [...cartItems.value, { ...product, qty: 1 }];
  }
}

export function removeFromCart(id: number) {
  cartItems.value = cartItems.value.filter(i => i.id !== id);
}

export function updateQty(id: number, qty: number) {
  if (qty <= 0) {
    removeFromCart(id);
    return;
  }
  cartItems.value = cartItems.value.map(i =>
    i.id === id ? { ...i, qty } : i
  );
}

export function clearCart() {
  cartItems.value = [];
}
