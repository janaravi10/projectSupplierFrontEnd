import {
  CLOSE_SNACKBAR,
  GET_SUPPLIER,
  FORM_SUBMITTED,
  SET_VALUE
} from "./actionTypes";
import axios from "axios";
// clear notification
export function submitSupplierData(supplierData, isEdit) {
  return dispatch => {
    let url = "http://localhost:5000/supplier/";
    url += isEdit ? "edit" : "add";
    console.log(url)
    axios
      .post(url, {
        supplier: supplierData
      })
      .then(res => {
        console.log(res)
        
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
      .get("http://localhost:5000/supplier/get")
      .then(res => {
        if (res.data.type === "SUCCESS") {
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
