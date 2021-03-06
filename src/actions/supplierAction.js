import {
  CLOSE_SNACKBAR,
  GET_SUPPLIER,
  FORM_SUBMITTED,
  SET_VALUE
} from "./actionTypes";
import { BASE_URL } from "../config.js";
import axios from "axios";
// clear notification
export function submitSupplierData(supplierData, isEdit) {
  return dispatch => {
    console.log(supplierData)
    let url = BASE_URL + "/supplier";
    url += isEdit ? "/" + supplierData.transactionId : "";
    axios[isEdit ? "put" : "post"](url, {
      supplier: supplierData
    }).then(res => {
      console.log(res);

      if (res.data.type === "SUCCESSFUL") {
        dispatch({
          type: FORM_SUBMITTED,
          payload: {
            formSubmitSuccess: true,
            reRoute: true
          }
        });
      }
    });
  };
}

// clear notification
export function setValue(valueToSetInRedux) {
  return dispatch => {
    dispatch({
      type: SET_VALUE,
      payload: valueToSetInRedux
    });
  };
}
// clear notification
export function getListOfSupplier() {
  return dispatch => {
    axios
      .get(BASE_URL + "/supplier")
      .then(res => {
        if (res.data.type === "SUCCESSFUL") {
          dispatch({
            type: GET_SUPPLIER,
            payload: { suppliers: res.data.response }
          });
        } else {
        }
      })
      .catch(function(err) {});
  };
}

// clear notification
export function closeSnackBar(closeBarState, bar) {
  return dispatch => {
    dispatch({
      type: CLOSE_SNACKBAR,
      payload: {
        formSubmitSuccess: closeBarState
      }
    });
  };
}

// clear notification
export function deleteSupplier(supplierId) {
  return dispatch => {
    axios
      .delete(BASE_URL + "/supplier/" + supplierId, { supplierId })
      .then(res => {
        if (res.data.type === "SUCCESSFUL") {
          console.log(res);
          getListOfSupplier()(dispatch);
        } else {
          console.log(res);
        }
      })
      .catch(function(err) {});
  };
}
