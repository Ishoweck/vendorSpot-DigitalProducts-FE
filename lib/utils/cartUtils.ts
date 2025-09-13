// Helper function to safely extract cart items from various cart data structures NB:DNT
export const getCartItems = (cartData: any) => {
  if (!cartData?.data?.data) return [];
  const cart = cartData.data.data;

  // Handle different possible cart structures
  if (cart.items) return cart.items;
  if (cart.cart?.items) return cart.cart.items;
  if (Array.isArray(cart)) return cart;

  return [];
};

// Helper function to find a cart item by product ID NB:DNT
export const findCartItem = (cartItems: any[], productId: string) => {
  return cartItems.find(
    (item: any) =>
      item.productId === productId ||
      item.productId?._id === productId ||
      item._id === productId
  );
};

// Helper function to normalize cart item structure NB:DNT
export const normalizeCartItem = (cartItem: any) => {
  if (!cartItem) return null;
  
  return {
    productId: cartItem.productId?._id || cartItem.productId || cartItem._id,
    quantity: cartItem.quantity || 0,
  };
};
