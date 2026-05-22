export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  imageUrl: string | null;
  price: number;
  currency: string;
  variantId: string;
  size: string;
  quantity: number;
};

const CART_KEY = "khatt_cart";

export function getCartItems(): CartItem[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(CART_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

export function saveCartItems(items: CartItem[]) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(CART_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("khatt-cart-updated"));
}

export function addCartItem(item: CartItem) {
  const items = getCartItems();

  const existingIndex = items.findIndex(
    (cartItem) =>
      cartItem.productId === item.productId &&
      cartItem.variantId === item.variantId
  );

  if (existingIndex >= 0) {
    items[existingIndex] = {
      ...items[existingIndex],
      quantity: items[existingIndex].quantity + item.quantity,
    };
  } else {
    items.push(item);
  }

  saveCartItems(items);
}

export function removeCartItem(productId: string, variantId: string) {
  const items = getCartItems().filter(
    (item) => !(item.productId === productId && item.variantId === variantId)
  );

  saveCartItems(items);
}

export function updateCartItemQuantity(
  productId: string,
  variantId: string,
  quantity: number
) {
  const items = getCartItems();

  const nextItems = items
    .map((item) =>
      item.productId === productId && item.variantId === variantId
        ? { ...item, quantity }
        : item
    )
    .filter((item) => item.quantity > 0);

  saveCartItems(nextItems);
}

export function clearCart() {
  saveCartItems([]);
}