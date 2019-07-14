import React, { Component } from "react";
import "../css/popup.css";
import { connect } from "react-redux";
import {
  showPopup,
  addData,
  showAlert,
  getProduct
} from "../actions/addDetail";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Dialog from "@material-ui/core/Dialog";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/styles";
import { Container, Typography } from "@material-ui/core";
import lightBlue from "@material-ui/core/colors/lightBlue";
import { Create, Delete, Done, Clear } from "@material-ui/icons";
import IconButton from "@material-ui/core/IconButton";
import MaterialTable from "material-table";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import { withRouter } from "react-router-dom";
import { setValue } from "../actions/supplierAction";
import { setProductValue } from "../actions/addDetail";
const styles = theme => ({
  container: {
    height: "100vh",
    width: "100%",
    backgroundColor: lightBlue[300],
    textAlign: "center",
    padding: 0
  }
});
class ProductComponent extends Component {
  state = {
    editClicked: false,
    productId: "",
    product: {
      productName: "",
      itemQty: 0,
      uom: "KG",
      packSize: "",
      packUom: "KG",
      unitPrice: 0,
      totalPrice: 0
    }
  };
  handleChange = e => {
    const elem = e.target;
    // If the element input being changed
    // is itemqty or unitprice then change the total price
    if (elem.name === "itemQty" || elem.name === "unitPrice") {
      let anotherUnit = elem.name === "itemQty" ? "unitPrice" : "itemQty";
      this.setState({
        product: {
          ...this.state.product,
          [elem.name]: elem.value,
          totalPrice: elem.value * this.state.product[anotherUnit]
        }
      });
    } else {
      this.setState({
        product: { ...this.state.product, [e.target.name]: e.target.value }
      });
    }
  };
  // showpoup
  popupHide = () => {
    this.props.showPopup({ showPopup: false, beingEdited: false });
    this.setState({
      product: {
        productName: "",
        itemQty: 0,
        uom: "KG",
        packSize: "",
        packUom: "KG",
        unitPrice: 0,
        totalPrice: 0
      },
      editClicked: false
    });
  };
  // save data into the redux store
  saveData = () => {
    let data = this.state.product;
    delete data.__v;
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
      this.props.addData(
        {
          data: { ...this.state.product, supplierId: this.props.supplierId }
        },
        this.props.editClicked
      );
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
  //================== RENDER ROW ==============//
  renderDialog = () => {
    const {
      productName,
      itemQty,
      uom,
      packSize,
      packUom,
      unitPrice,
      totalPrice
    } = this.state.product;
    return (
      <Dialog open={this.props.showPopupState}>
        <Paper className="popup-holder">
          <div className="input-holder">
            <div className="input-childs">
              <label>Item name</label>
              <TextField
                margin="dense"
                variant="filled"
                name="productName"
                type="text"
                onChange={this.handleChange}
                value={productName}
              />
            </div>
          </div>
          <div className="input-holder">
            <div className="input-childs">
              <label>Qty</label>{" "}
              <TextField
                margin="dense"
                variant="filled"
                name="itemQty"
                type="number"
                value={itemQty}
                onChange={this.handleChange}
              />
            </div>
            <div className="input-childs">
              <label>UOM</label>{" "}
              <FormControl>
                <Select
                  value={uom}
                  onChange={this.handleChange}
                  inputProps={{
                    name: "uom"
                  }}
                >
                  <MenuItem value="KG">Kg</MenuItem>
                  <MenuItem value="LTR">Ltr</MenuItem>
                  <MenuItem value="LBS">lbs</MenuItem>
                </Select>
              </FormControl>
            </div>
          </div>
          <div className="input-holder">
            <div className="input-childs">
              <label>pack size</label>
              <TextField
                margin="dense"
                variant="filled"
                name="packSize"
                type="number"
                value={packSize}
                onChange={this.handleChange}
              />
            </div>
            <div className="input-childs">
              <label>Pack UOM</label>{" "}
              <FormControl>
                <Select
                  value={packUom}
                  onChange={this.handleChange}
                  inputProps={{
                    name: "packUom"
                  }}
                >
                  <MenuItem value="KG">Kg</MenuItem>
                  <MenuItem value="LTR">Ltr</MenuItem>
                  <MenuItem value="LBS">lbs</MenuItem>
                </Select>
              </FormControl>
              {/* <input name="UOM2" type="text" /> */}
            </div>
          </div>
          <div className="input-holder">
            <div className="input-childs">
              <label>unit price</label>{" "}
              <TextField
                margin="dense"
                variant="filled"
                name="unitPrice"
                type="number"
                value={
                  (unitPrice + "").indexOf(".") !== -1
                    ? unitPrice
                    : unitPrice + ".00"
                }
                onChange={this.handleChange}
              />
            </div>
            <div className="input-childs">
              <label>Total price</label>{" "}
              <TextField
                margin="dense"
                variant="filled"
                name="totalPrice"
                type="text"
                value={
                  (itemQty * unitPrice + "").indexOf(".") === -1
                    ? itemQty * unitPrice + ".00"
                    : itemQty * unitPrice
                }
              />
            </div>
          </div>
          <div className="button-group">
            <Button onClick={this.saveData} variant="contained" color="primary">
              save
            </Button>
            <Button onClick={this.popupHide}>cancel</Button>
          </div>
        </Paper>
      </Dialog>
    );
  };
  renderRow = rowData => {
    var cells = [],
      product = this.state.product,
      data = rowData.data;

    if (this.props.editClicked === true && data._id === this.state.productId) {
      console.log(data);
      const {
        productName,
        itemQty,
        uom,
        packSize,
        packUom,
        unitPrice,
        totalPrice
      } = this.state.product;
      return (
        <TableRow>
          <TableCell>{rowData.index + 1}</TableCell>
          <TableCell>
            <TextField
              margin="dense"
              value={productName}
              //   value={product.productName}
              name="productName"
              onChange={this.handleChange}
            />
          </TableCell>
          <TableCell>
            <TextField
              margin="dense"
              value={itemQty}
              //   value={product.itemQty}
              name="itemQty"
              onChange={this.handleChange}
            />
          </TableCell>
          <TableCell>
            <Select value={uom} name="uom" onChange={this.handleChange}>
              <MenuItem value="KG">Kg</MenuItem>
              <MenuItem value="LTR">Ltr</MenuItem>
              <MenuItem value="LBS">lbs</MenuItem>
            </Select>
          </TableCell>
          <TableCell>
            <TextField
              margin="dense"
              value={packSize}
              name="packSize"
              onChange={this.handleChange}
            />
          </TableCell>
          <TableCell>
            <Select
              //   value={product.packUom}
              name="packUom"
              value={packUom}
              onChange={this.handleChange}
            >
              <MenuItem value="KG">Kg</MenuItem>
              <MenuItem value="LTR">Ltr</MenuItem>
              <MenuItem value="LBS">lbs</MenuItem>
            </Select>
          </TableCell>
          <TableCell>
            <TextField
              margin="dense"
              value={
                (unitPrice + "").indexOf(".") !== -1
                  ? unitPrice
                  : unitPrice + ".00"
              }
              //   value={product.unitPrice}
              name="unitPrice"
              onChange={this.handleChange}
            />
          </TableCell>
          <TableCell>
            <TextField
              margin="dense"
              value={
                (itemQty * unitPrice + "").indexOf(".") === -1
                  ? itemQty * unitPrice + ".00"
                  : itemQty * unitPrice
              }
              //   value={product.totalPrice}
              name="totalPrice"
              onChange={this.handleChange}
            />
          </TableCell>
          <TableCell
            style={{
              display: "flex",
              flexDirection: "row"
            }}
          >
            <IconButton>
              <Done onClick={this.saveData} />
            </IconButton>
            <IconButton>
              <Clear onClick={this.popupHide} />
            </IconButton>
          </TableCell>
        </TableRow>
      );
    } else {
      return (
        <TableRow>
          <TableCell>{rowData.index + 1}</TableCell>
          <TableCell>{data.productName}</TableCell>
          <TableCell>{data.itemQty}</TableCell>
          <TableCell>{data.uom}</TableCell>
          <TableCell>{data.packSize}</TableCell>
          <TableCell>{data.packUom}</TableCell>
          <TableCell>{data.unitPrice}</TableCell>
          <TableCell>{data.totalPrice}</TableCell>
          <TableCell
            style={{
              display: "flex",
              flexDirection: "row"
            }}
          >
            <IconButton
              data-productid={data._id}
              onClick={eve => {
                let productId = eve.currentTarget.getAttribute(
                  "data-productid"
                );
                this.props.setProductValue({editClicked: true})
                this.setState({
                  productId: productId,
                  product: data
                });
              }}
            >
              <Create />
            </IconButton>
            <IconButton>
              <Delete data-attribute={data._id} />
            </IconButton>
          </TableCell>
        </TableRow>
      );
    }
  };
  componentDidMount = () => {
    const { location, getProduct, setValue } = this.props;
    setValue({
      currentSupplier: location.state.currentSupplier
    });
    getProduct(location.state.currentSupplier);
  };
  render() {
    const { classes } = this.props;
    return (
      <Container className={classes.container} maxWidth="xl">
        {this.renderDialog()}
        <Grid container xs={12} md={10} style={{ margin: "auto" }}>
          <Grid item xs={12}>
            <Paper style={{ height: 200, margin: "auto" }} />
          </Grid>
          <Grid item xs={12} style={{ marginTop: "10px" }}>
            <MaterialTable
              title="Supplier products"
              columns={[
                { title: "S.NO", field: "sno" },
                { title: "Item", field: "productName" },
                { title: "Quantity", field: "itemQty" },
                { title: "UOM", field: "uom" },
                { title: "Pack Size", field: "packSize" },
                { title: "Pack UOM", field: "packUom" },
                { title: "Unit price", field: "unitPrice" },
                {
                  title: "Total Price",
                  field: "totalPrice"
                }
              ]}
              data={this.props.product}
              actions={[
                {
                  icon: Create,
                  tooltip: "edit product"
                },
                {
                  icon: Delete,
                  tooltip: "edit product"
                }
              ]}
              options={{
                search: false,
                paging: false,
                actionsColumnIndex: -1
              }}
              components={{
                Row: this.renderRow,
                Toolbar: () => {
                  return (
                    <Grid container xs={12}>
                      <Grid xs={6}>
                        <Typography
                          variant="h5"
                          style={{ textAlign: "left", margin: 10 }}
                        >
                          Supplier product
                        </Typography>
                      </Grid>
                      <Grid xs={6}>
                        <Button
                          variant="contained"
                          color="primary"
                          style={{
                            float: "right",
                            margin: 10
                          }}
                          onClick={() => {
                            this.props.showPopup({
                              showPopup: true,
                              beingEdited: false
                            });
                          }}
                        >
                          Add new
                        </Button>
                      </Grid>
                    </Grid>
                  );
                }
              }}
            />
          </Grid>
        </Grid>
      </Container>
    );
  }
}
const mapStateToProps = state => ({
  showPopupState: state.product.showPopup,
  beingEdited: state.product.beingEdited,
  productId: state.product.productId,
  product: state.product.product,
  suppliers: state.supplier.suppliers,
  supplierId: state.supplier.currentSupplier,
  editClicked: state.product.editClicked
});
const mapDispatchToProps = {
  showPopup,
  addData,
  showAlert,
  getProduct,
  setValue,
  setProductValue
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withStyles(styles)(ProductComponent))
);
