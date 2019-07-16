import {
  ADD_DETAIL,
  DELETE_PRODUCT,
  GET_PRODUCT,
  SET_VALUE,
  ADD_INLINE_PRODUCT,
  CLEAR_INLINE_PRODUCT,
  CHECK_INLINE_PRODUCT
} from "../actions/actionTypes";
export function productReducer(
  initialState = {
    product: []
  },
  action
) {
  switch (action.type) {
    case ADD_DETAIL:
      let product = initialState.product;
      if (initialState.beingEdited === true) {
        product[initialState.productId] = action.payload.product;
      } else {
        product.push(action.payload.product);
      }
      return Object.assign(
        {},
        initialState,
        { product: product },
        { beingEdited: false }
      );
    case SET_VALUE:
      return Object.assign({}, initialState, action.payload);
    case DELETE_PRODUCT:
      let prevProduct = initialState.product,
        id = action.payload.productId;
      prevProduct = prevProduct.filter((val, index) => index !== +id);
      return Object.assign({}, initialState, { product: prevProduct });
    case GET_PRODUCT:
      return Object.assign({}, initialState, action.payload);
    case ADD_INLINE_PRODUCT:
      if (
        initialState.product[initialState.product.length - 1] &&
        initialState.product[initialState.product.length - 1]._id ===
          "ADD_INLINE_PRODUCT"
      )
        return initialState;
      return Object.assign({}, initialState, {
        product: [
          ...initialState.product,
          {
            productName: "",
            itemQty: 0,
            uom: "KG",
            packSize: "",
            packUom: "KG",
            unitPrice: 0,
            totalPrice: 0,
            _id: "ADD_INLINE_PRODUCT"
          }
        ]
      });
    case CLEAR_INLINE_PRODUCT:
      return Object.assign({}, initialState, {
        product: [...initialState.product].splice(
          0,
          initialState.product.length - 1
        )
      });
    case CHECK_INLINE_PRODUCT:
      if (
        initialState.product[initialState.product.length - 1] &&
        initialState.product[initialState.product.length - 1]._id ===
          "ADD_INLINE_PRODUCT"
      )
        return Object.assign({}, initialState, {
          product: [...initialState.product].splice(
            0,
            initialState.product.length - 1
          )
        });
    default:
      return initialState;
  }
}
