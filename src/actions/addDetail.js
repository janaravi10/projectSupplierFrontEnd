import {
  GET_PRODUCT,
  SET_VALUE,
  ADD_INLINE_PRODUCT,
  CLEAR_INLINE_PRODUCT,
  CHECK_INLINE_PRODUCT
} from "./actionTypes";
import { BASE_URL } from "../config.js";
import axios from "axios";
// remove question
export function addData(productData, isEdit) {
  return (dispatch, getState) => {
    // console.log(isEdit);
    let url = BASE_URL + "/product";
    url += isEdit
      ? "/" + productData.data._id
      : "/" + productData.data.supplierId;
    console.log(productData.data, url);
    axios[isEdit ? "put" : "post"](url, {
      product: productData.data
    }).then(function(res) {
      console.log(res);
      if (res.data.type === "SUCCESSFUL") {
        getProduct(getState().supplier.currentSupplier)(dispatch);
        setProductValue({ editClicked: false })(dispatch);
      } else {
      }
    });
  };
}
// clear notification
export function setProductValue(valueToSetInRedux) {
  return dispatch => {
    dispatch({
      type: SET_VALUE,
      payload: valueToSetInRedux
    });
  };
}

export function deleteProduct(bodyData) {
  return (dispatch, getState) => {
    console.log(bodyData);
    axios
      .delete(BASE_URL + "/product/" + bodyData.productId)
      .then(function(response) {
        console.log(response);
        if (response.data.type === "SUCCESSFUL") {
          getProduct(getState().supplier.currentSupplier)(dispatch);
        } else {
        }
      });
  };
}

export function addInlineProduct() {
  return dispatch => dispatch({ type: ADD_INLINE_PRODUCT });
}
export function clearInlineProduct() {
  return dispatch => dispatch({ type: CLEAR_INLINE_PRODUCT });
}
export function checkInlineProduct() {
  return dispatch => dispatch({ type: CHECK_INLINE_PRODUCT });
}

export function getProduct(supplierId) {
  return dispatch => {
    axios
      .get(BASE_URL + "/product/" + supplierId, {
        supplierId
      })
      .then(res => {
        if (res.data.type === "SUCCESSFUL") {
          dispatch({
            type: GET_PRODUCT,
            payload: { product: res.data.response }
          });
        } else {
        }
      })
      .catch(function(err) {});
  };
}
