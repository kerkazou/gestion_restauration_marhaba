const INIT_STATE = {
  carts: [],
};

export const cartreducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case "ADD_CART": {
      const idx = state.carts.findIndex((it) => it._id === action.payload._id);
      if (idx >= 0) {
        // Item already in cart -> increase its quantity
        const carts = state.carts.map((it, i) =>
          i === idx ? { ...it, quantity: it.quantity + 1 } : it
        );
        return { ...state, carts };
      }
      // New item -> add it with quantity 1
      return {
        ...state,
        carts: [...state.carts, { ...action.payload, quantity: 1 }],
      };
    }

    case "RMV_CART": {
      // Remove the whole line by _id
      const carts = state.carts.filter((el) => el._id !== action.payload);
      return { ...state, carts };
    }

    case "RMV_ONE": {
      const idx = state.carts.findIndex((it) => it._id === action.payload);
      if (idx < 0) return state;
      if (state.carts[idx].quantity > 1) {
        // Decrease quantity by 1
        const carts = state.carts.map((it, i) =>
          i === idx ? { ...it, quantity: it.quantity - 1 } : it
        );
        return { ...state, carts };
      }
      // Quantity was 1 -> remove the line
      const carts = state.carts.filter((el) => el._id !== action.payload);
      return { ...state, carts };
    }

    default:
      return state;
  }
};