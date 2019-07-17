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
    console.log(isEdit);
    let url = BASE_URL + "/product/";
    url += isEdit ? "edit" : "add";
    axios
      .post(url, {
        product: productData.data
      })
      .then(function(res) {
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
    axios
      .post(BASE_URL+"/product/delete", bodyData, {
        withCredentials: true
      })
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
      .post(BASE_URL+"/product/get", {
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
