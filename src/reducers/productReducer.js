import {
  ADD_DETAIL,
  SHOW_POPUP,
  SHOW_ALERT,
  DELETE_PRODUCT,
  GET_PRODUCT,
  FAILED_TO_FETCH,
  LOADING_DATA,
  CLEAR_NOTIFICATION,
  SHOW_NOTIFICATION,
  SET_VALUE
} from "../actions/actionTypes";
export function productReducer(
  initialState = {
    showPopup: false,
    product: [],
    beingEdited: false,
    notification: {},editClicked: false
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
    case SHOW_POPUP:
      return Object.assign({}, initialState, action.payload);
    case SET_VALUE:
      return Object.assign({}, initialState, action.payload);
    case SHOW_ALERT:
      return Object.assign({}, initialState, action.payload);
    case DELETE_PRODUCT:
      let prevProduct = initialState.product,
        id = action.payload.productId;
      prevProduct = prevProduct.filter((val, index) => index !== +id);
      return Object.assign({}, initialState, { product: prevProduct });
    case GET_PRODUCT:
      return Object.assign({}, initialState, action.payload);
    case FAILED_TO_FETCH:
      return Object.assign({}, initialState, action.payload);
    case LOADING_DATA:
      return Object.assign({}, initialState, action.payload);
    case CLEAR_NOTIFICATION:
      return Object.assign({}, initialState, action.payload);
    case SHOW_NOTIFICATION:
      return Object.assign({}, initialState, action.payload);
    default:
      return initialState;
  }
}
