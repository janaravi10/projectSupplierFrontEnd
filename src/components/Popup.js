import React, { Component } from "react";
import "../css/popup.css";
import { connect } from "react-redux";
import { showPopup, addData, showAlert } from "../actions/addDetail";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Dialog from "@material-ui/core/Dialog";

class Popup extends Component {
  state = {
    productName: "",
    itemQty: 0,
    uom: "KG",
    packSize: "",
    packUom: "KG",
    unitPrice: 0,
    totalPrice: 0
  };
  // check if this action is performed by edited button
  componentDidMount = () => {
    let productToBeEdited = this.props.product[this.props.productId];
    if (this.props.beingEdited && productToBeEdited) {
      this.setState(productToBeEdited);
    }
  };
  handleChange = e => {
    const elem = e.target;
    // If the element input being changed
    // is itemqty or unitprice then change the total price
    if (elem.name === "itemQty" || elem.name === "unitPrice") {
      let anotherUnit = elem.name === "itemQty" ? "unitPrice" : "itemQty";
      this.setState({
        [elem.name]: elem.value,
        totalPrice: elem.value * this.state[anotherUnit]
      });
    } else {
      this.setState({
        [e.target.name]: e.target.value
      });
    }
  };
  // showpoup
  popupHide = () => {
    this.props.showPopup({ showPopup: false, beingEdited: false });
  };
  // save data into the redux store
  saveData = () => {
    let data = this.state;
    let successful = true,
      propFailed = [];
    // looping through the property and checking if it is empty or
    // not filled by the user
    for (var prop in data) {
      if (!data[prop]) {
        successful = false;
        propFailed.push(prop);
      }
    }
    if (!successful) {
      this.props.showAlert({ showAlert: true, msg: propFailed });
    } else {
      this.props.addData({ data: this.state });
    }
  };
  // show span elment with the error message
  showAlertElem = () => {
    return this.props.showAlertState ? (
      <span className="alert">
        {this.props.alertMsg.join(" ") + " Missing "}
      </span>
    ) : null;
  };
  render() {
    return (
  <div>hello</div>
    );
  }
}

const mapStateToProps = state => {
  return {
    showPopupState: state.product.showPopup,
    showAlertState: state.product.showAlert,
    alertMsg: state.product.msg,
    beingEdited: state.product.beingEdited,
    productId: state.product.productId,
    product: state.product.product
  };
};
const mapDispatchToProps = {
  showPopup,
  addData,
  showAlert
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Popup);
