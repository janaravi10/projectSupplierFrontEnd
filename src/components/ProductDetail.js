import React, { Component } from "react";
import { connect } from "react-redux";
import {
  showPopup,
  deleteProduct,
  editProduct,
  getProduct
} from "../actions/addDetail.js";
import Popup from "./Popup";
import "../css/productDetail.css";
// importing tables and their components
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";

class ProductDetail extends Component {
  // componentDidMount
  componentDidMount = () => {
    this.props.getProduct();
  };
  // show popup when add Row button clicked
  showPopupFun = () => {
    this.props.showPopup({ showPopup: true, beingEdited: false });
  };
  // deleting the product
  handleDelete = e => {
    this.props.deleteProduct(
      e.target.getAttribute("data-row") ||
        e.target.parentElement.getAttribute("data-row")
    );
  };
  // Edit the value
  handleEdit = e => {
    console.log(e.target.getAttribute("data-row"));
    this.props.editProduct(
      e.target.getAttribute("data-row") ||
        e.target.parentElement.getAttribute("data-row")
    );
  };
  loadTable = () => {
    if (!this.props.products.length) {
      return (
        <TableRow>
          <TableCell>No product available</TableCell>
        </TableRow>
      );
    }

    return this.props.products.map((element, index) => {
      return (
        <TableRow key={index}>
          <TableCell>{index + 1}</TableCell>
          <TableCell>{element.productName}</TableCell>
          <TableCell>{element.itemQty}</TableCell>
          <TableCell>{element.uom}</TableCell>
          <TableCell>{element.packSize}</TableCell>
          <TableCell>{element.packUom}</TableCell>
          <TableCell>{element.unitPrice}</TableCell>
          <TableCell>{element.totalPrice}</TableCell>
          <TableCell>
            <Button
              className=""
              data-row={element._id}
              onClick={this.handleDelete}
              variant="contained"
              color="secondary"
            >
              delete
            </Button>
          </TableCell>
          <TableCell>
            <Button
              data-row={element._id}
              variant="contained"
              color="primary"
              onClick={this.handleEdit}
            >
              Edit
            </Button>
          </TableCell>
        </TableRow>
      );
    });
  };
  // function to show notification messages
  notify = () => {
    const { notification } = this.props;
    if (notification.show) {
      return (
        <span className={notification.className}>{notification.message}</span>
      );
    } else {
      return null;
    }
  };
  render() {
    return (
      <React.Fragment>
        <div style={{ margin: "10px auto", width: "80%" }}>
          <Button
            onClick={this.showPopupFun}
            style={{ margin: "10px 0" }}
            variant="contained"
            color="primary"
          >
            +Add row
          </Button>
          {/* show message here */}
          {this.notify()}
          <Paper>
            <Table>
              <TableHead color="primary">
                <TableRow>
                  <TableCell>S.NO</TableCell>
                  <TableCell>Item</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>UOM</TableCell>
                  <TableCell>Pack size</TableCell>
                  <TableCell>UOM</TableCell>
                  <TableCell>Unit price</TableCell>
                  <TableCell>Total price</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>{this.loadTable()}</TableBody>
            </Table>
            {this.props.showPopupState ? <Popup /> : null}
          </Paper>
        </div>
      </React.Fragment>
    );
  }
}
const mapStateToProps = state => {
  return {
    showPopupState: state.product.showPopup,
    products: state.product.product,
    notification: state.product.notification
  };
};
const mapDispatchToProps = {
  showPopup,
  deleteProduct,
  editProduct,
  getProduct
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProductDetail);
