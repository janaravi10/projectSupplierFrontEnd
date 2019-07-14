import {
  ADD_DETAIL,
  SHOW_POPUP,
  SHOW_ALERT,
  DELETE_PRODUCT,
  GET_PRODUCT,
  FAILED_TO_FETCH,
  LOADING_DATA,
  SET_VALUE,
  CLEAR_NOTIFICATION,
  SHOW_NOTIFICATION
} from "./actionTypes";
import axios from "axios";
// remove question
export function addData(productData, isEdit) {
  return (dispatch, getState) => {
    console.log("comming");
    let url = "http://localhost:5000/product/";
    url += isEdit ? "edit" : "add";
    axios
      .post(url, {
        product: productData.data
      })
      .then(function(res) {
        if (res.data.type === "SUCCESSFUL") {
          getProduct(getState().supplier.currentSupplier)(dispatch);
          showPopup({ showPopup: false, beingEdited: false })(dispatch);
          setProductValue({ editClicked: false })(dispatch);
        } else {
          console.log(res);
          showNotification({
            show: true,
            className: "red",
            message: res.data.message
          })(dispatch);
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
export function showPopup(config) {
  return dispatch => {
    dispatch({ type: SHOW_POPUP, payload: config });
  };
}

export function showAlert(alertConfig) {
  return dispatch => {
    dispatch({ type: SHOW_ALERT, payload: alertConfig });
    // hiding popup after 1second
    setTimeout(() => {
      dispatch({ type: SHOW_ALERT, payload: { showAlert: false } });
    }, 1000);
  };
}

export function deleteProduct(productId) {
  return dispatch => {
    axios
      .post(
        "http://localhost:5000/product/delete",
        {
          productId: productId
        },
        { withCredentials: true }
      )
      .then(function(response) {
        console.log(response);
        if (response.data.type === "SUCCESS") {
          dispatch(getProduct);
        } else {
          dispatch({
            type: FAILED_TO_FETCH,
            payload: {
              notification: {
                show: true,
                className: "red",
                message: response.data.message
              }
            }
          });
        }
      });
    // dispatch({ type: DELETE_PRODUCT, payload: { productId: productId } });
  };
}

export function editProduct(productId) {
  return dispatch => {
    dispatch({
      type: SHOW_POPUP,
      payload: { productId: productId, showPopup: true, beingEdited: true }
    });
  };
}

// clear notification
export function clearNotification() {
  return dispatch => {
    dispatch({
      type: CLEAR_NOTIFICATION,
      payload: {
        notification: {}
      }
    });
  };
}

// clear notification
export function showNotification(notificationOption) {
  return dispatch => {
    dispatch({
      type: SHOW_NOTIFICATION,
      payload: {
        notification: notificationOption
      }
    });
  };
}
export function getProduct(supplierId) {
  return dispatch => {
    axios
      .post("http://localhost:5000/product/get", {
        supplierId
      })
      .then(res => {
        if (res.data.type === "SUCCESSFUL") {
          dispatch({
            type: GET_PRODUCT,
            payload: { product: res.data.response }
          });
        } else {
          showNotification({
            message: res.data.message,
            show: true,
            className: "red"
          })(dispatch);
          // clearing notification after some second
          setTimeout(() => {
            clearNotification()(dispatch);
          }, 1000);
        }
      })
      .catch(function(err) {
        showNotification({
          message: "Something went wrong!",
          show: true,
          className: "red"
        })(dispatch);

        // clearing notification after some second
        setTimeout(() => {
          clearNotification()(dispatch);
        }, 1000);
      });
  };
}
