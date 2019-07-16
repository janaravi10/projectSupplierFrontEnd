import React, { Component } from "react";
import { connect } from "react-redux";
import {
  addData,
  getProduct,
  addInlineProduct
} from "../actions/addDetail";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Dialog from "@material-ui/core/Dialog";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import { withStyles } from "@material-ui/styles";
import { Typography } from "@material-ui/core";
import lightBlue from "@material-ui/core/colors/lightBlue";
import { Create, Delete, Done, Clear } from "@material-ui/icons";
import IconButton from "@material-ui/core/IconButton";
import MaterialTable from "material-table";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import { withRouter } from "react-router-dom";
import { setValue } from "../actions/supplierAction";
import Divider from "@material-ui/core/Divider";
import {
  setProductValue,
  deleteProduct,
  clearInlineProduct,
  checkInlineProduct
} from "../actions/addDetail";
const styles = theme => ({
  container: {
    height: "100vh",
    width: "100%",
    backgroundColor: lightBlue[300],
    textAlign: "center",
    padding: 0
  },
  btn: {
    marginRight: 10
  },
  gridMargin: {
    marginTop: 10
  }
});
const StyledDialog = withStyles({
  paper: {
    padding: 10
  }
})(Dialog);
const ValueTypography = withStyles({
  root: {
    color: "#bdbdbd"
  }
})(Typography);
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
    },
    addProduct: {
      productName: "",
      itemQty: "",
      uom: "KG",
      packSize: "",
      packUom: "KG",
      unitPrice: "",
      totalPrice: ""
    },
    addProductRequiredFields: [],
    requiredFields: [],
    showError: false
  };
  handleChange = (addNew, e) => {
    let elem = e.target,
      propName = addNew ? "addProduct" : "product";
    // simple condition if the addProduct is for inline
    propName =
      this.state.productId === "ADD_INLINE_PRODUCT" ? "product" : "product";
    // If the element input being changed
    // is itemqty or unitprice then change the total price
    if (elem.name === "itemQty" || elem.name === "unitPrice") {
      let anotherUnit = elem.name === "itemQty" ? "unitPrice" : "itemQty";
      let elemValue =
        elem.name === "unitPrice"||"itemQty" ? Number(elem.value).toFixed(2) : elem.value;
      this.setState({
        [propName]: {
          ...this.state[propName],
          [elem.name]: elemValue,
          totalPrice: (elem.value * this.state[propName][anotherUnit]).toFixed(
            2
          )
        }
      });
    } else {
      this.setState({
        [propName]: {
          ...this.state[propName],
          [e.target.name]: e.target.value
        }
      });
    }
  };
  // showpoup
  popupHide = addNew => {
    let propName = "product",
      { setProductValue, clearInlineProduct } = this.props;

    setProductValue({ editClicked: false });
    addNew && clearInlineProduct();
    this.setState({
      [propName]: {
        productName: "",
        itemQty: 0,
        uom: "KG",
        packSize: "",
        packUom: "KG",
        unitPrice: 0,
        totalPrice: 0
      }
    });
  };
  clearForm = propName => {
    this.setState({
      [propName]: {
        productName: "",
        itemQty: 0,
        uom: "KG",
        packSize: "",
        packUom: "KG",
        unitPrice: 0,
        totalPrice: 0
      }
    });
  };
  // save data into the redux store
  saveData = (addNew, eve) => {
    eve.preventDefault();
    let propName = "product",
      data = this.state[propName],
      { addData, supplierId } = this.props,
      requiredFields = [
        "productName",
        "itemQty",
        "uom",
        "packSize",
        "packUom",
        "unitPrice",
        "totalPrice"
      ];
    requiredFields = requiredFields.filter(elem => {
      if (
        elem === "unitPrice" ||
        elem === "packSize" ||
        elem === "totalPrice"
      ) {
        if (!Number(data[elem])) {
          return true;
        } else if (Number(data[elem]) <= 0) {
          return true;
        } else if (data[elem].toString().trim() === "") {
          return true;
        } else {
          return false;
        }
      } else {
        return !data[elem];
      }
    });
    if (requiredFields.length) {
      this.setState({
        [propName]: { ...this.state[propName] },
        ["requiredFields"]: requiredFields
      });
      // clearing the required fields
      setTimeout(() => {
        this.setState({
          [propName]: {
            ...this.state[propName]
          },
          ["requiredFields"]: []
        });
      }, 500);
    } else {
      addData(
        {
          data: {
            ...this.state[propName],
            supplierId: supplierId
          }
        },
        this.state.productId === "ADD_INLINE_PRODUCT" ? false : true
      );
      this.clearForm(propName);
    }
  };
  //================== RENDER ROW ==============//
  // renderDialog = () => {
  //   const {
  //       productName,
  //       itemQty,
  //       uom,
  //       packSize,
  //       packUom,
  //       unitPrice,
  //       totalPrice
  //     } = this.state.addProduct,
  //     classes = this.props.classes,
  //     boundedHandleChange = this.handleChange.bind(this, true),
  //     { addProductRequiredFields } = this.state;
  //   return (
  //     <StyledDialog
  //       fullWidth={true}
  //       maxWidth="sm"
  //       open={this.props.showPopupState}
  //     >
  //       <form onSubmit={this.saveData.bind(this, true)}>
  //         <Grid container>
  //           <Grid item xs={12} md={6}>
  //             <Typography variant="subtitle2">Item name</Typography>
  //             <TextField
  //               margin="dense"
  //               variant="outlined"
  //               name="productName"
  //               type="text"
  //               onChange={boundedHandleChange}
  //               value={productName}
  //               error={
  //                 addProductRequiredFields.indexOf("productName") === -1
  //                   ? false
  //                   : true
  //               }
  //             />
  //           </Grid>
  //           <Grid item xs={12} sm={6}>
  //             <Typography variant="subtitle2">Quantity</Typography>
  //             <TextField
  //               margin="dense"
  //               variant="outlined"
  //               name="itemQty"
  //               type="number"
  //               onChange={boundedHandleChange}
  //               value={itemQty}
  //               error={
  //                 addProductRequiredFields.indexOf("itemQty") === -1
  //                   ? false
  //                   : true
  //               }
  //             />
  //           </Grid>
  //           <Grid item xs={12} md={6}>
  //             <Typography variant="subtitle2">UOM</Typography>
  //             <FormControl variant="outlined">
  //               <Select
  //                 value={uom}
  //                 onChange={boundedHandleChange}
  //                 input={<OutlinedInput name="uom" />}
  //                 error={
  //                   addProductRequiredFields.indexOf("uom") === -1
  //                     ? false
  //                     : true
  //                 }
  //               >
  //                 <MenuItem value="KG">Kg</MenuItem>
  //                 <MenuItem value="LTR">Ltr</MenuItem>
  //                 <MenuItem value="LBS">lbs</MenuItem>
  //               </Select>
  //             </FormControl>
  //           </Grid>
  //           <Grid item xs={12} md={6}>
  //             <Typography variant="subtitle2">pack size</Typography>
  //             <TextField
  //               margin="dense"
  //               variant="outlined"
  //               name="packSize"
  //               type="number"
  //               onChange={boundedHandleChange}
  //               value={packSize}
  //               error={
  //                 addProductRequiredFields.indexOf("packSize") === -1
  //                   ? false
  //                   : true
  //               }
  //             />
  //           </Grid>
  //           <Grid item xs={12} md={6}>
  //             <Typography variant="subtitle2">Pack UOM</Typography>
  //             <FormControl variant="outlined">
  //               <Select
  //                 value={packUom}
  //                 onChange={boundedHandleChange}
  //                 input={<OutlinedInput name="packUom" />}
  //                 error={
  //                   addProductRequiredFields.indexOf("packUom") === -1
  //                     ? false
  //                     : true
  //                 }
  //               >
  //                 <MenuItem value="KG">Kg</MenuItem>
  //                 <MenuItem value="LTR">Ltr</MenuItem>
  //                 <MenuItem value="LBS">lbs</MenuItem>
  //               </Select>
  //             </FormControl>
  //           </Grid>
  //           <Grid item xs={12} md={6}>
  //             <Typography variant="subtitle2">unit price</Typography>
  //             <TextField
  //               margin="dense"
  //               variant="outlined"
  //               name="unitPrice"
  //               type="number"
  //               onChange={boundedHandleChange}
  //               value={
  //                 (unitPrice + "").indexOf(".") !== -1
  //                   ? unitPrice
  //                   : unitPrice + ".00"
  //               }
  //               error={
  //                 addProductRequiredFields.indexOf("unitPrice") === -1
  //                   ? false
  //                   : true
  //               }
  //             />
  //           </Grid>
  //           <Grid item xs={12} md={6}>
  //             <Typography variant="subtitle2">total price</Typography>
  //             <TextField
  //               margin="dense"
  //               variant="outlined"
  //               name="totalPrice"
  //               type="number"
  //               onChange={boundedHandleChange}
  //               // disabled
  //               value={
  //                 (itemQty * unitPrice + "").indexOf(".") === -1
  //                   ? itemQty * unitPrice + ".00"
  //                   : itemQty * unitPrice
  //               }
  //               error={
  //                 addProductRequiredFields.indexOf("totalPrice") === -1
  //                   ? false
  //                   : true
  //               }
  //             />
  //           </Grid>
  //           <Grid item xs={12} className={classes.gridMargin}>
  //             <Button
  //               type="submit"
  //               // onClick={this.saveData.bind(this, true)}
  //               variant="contained"
  //               color="primary"
  //               className={classes.btn}
  //             >
  //               save
  //             </Button>
  //             <Button
  //               onClick={this.popupHide.bind(this, true)}
  //               className={classes.btn}
  //             >
  //               cancel
  //             </Button>
  //           </Grid>
  //         </Grid>
  //       </form>
  //     </StyledDialog>
  //   );
  // };
  renderRow = rowData => {
    var data = rowData.data;
    if (this.props.editClicked === true && data._id === this.state.productId) {
      const {
        productName,
        itemQty,
        uom,
        packSize,
        packUom,
        unitPrice,
        totalPrice
      } = this.state.product;
      let requiredFields = this.state.requiredFields;
      return (
        <TableRow>
          <TableCell>{rowData.index + 1}</TableCell>
          <TableCell>
            <TextField
              margin="dense"
              value={productName}
              name="productName"
              onChange={this.handleChange.bind(this, false)}
              error={
                requiredFields.indexOf("productName") === -1 ? false : true
              }
            />
          </TableCell>
          <TableCell>
            <TextField
              margin="dense"
              value={itemQty}
              name="itemQty"
              type="number"
              onChange={this.handleChange.bind(this, false)}
              error={requiredFields.indexOf("itemQty") === -1 ? false : true}
            />
          </TableCell>
          <TableCell>
            <Select
              value={uom}
              name="uom"
              onChange={this.handleChange.bind(this, false)}
              error={requiredFields.indexOf("uom") === -1 ? false : true}
            >
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
              type="number"
              onChange={this.handleChange.bind(this, false)}
              error={requiredFields.indexOf("packSize") === -1 ? false : true}
            />
          </TableCell>
          <TableCell>
            <Select
              name="packUom"
              value={packUom}
              onChange={this.handleChange.bind(this, false)}
              error={requiredFields.indexOf("packUom") === -1 ? false : true}
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
              name="unitPrice"
              type="number"
              onChange={this.handleChange.bind(this, false)}
              error={requiredFields.indexOf("unitPrice") === -1 ? false : true}
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
              name="totalPrice"
              type="number"
              disabled
              onChange={this.handleChange.bind(this, false)}
              error={requiredFields.indexOf("totalPrice") === -1 ? false : true}
            />
          </TableCell>
          <TableCell
            style={{
              display: "flex",
              flexDirection: "row"
            }}
          >
            <IconButton
              onClick={this.saveData.bind(
                this,
                data._id === "ADD_INLINE_PRODUCT" ? true : false
              )}
            >
              <Done />
            </IconButton>
            <IconButton
              onClick={this.popupHide.bind(
                this,
                data._id === "ADD_INLINE_PRODUCT" ? true : false
              )}
            >
              <Clear />
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
          <TableCell>
            {(data.unitPrice + "").indexOf(".") !== -1
              ? data.unitPrice
              : data.unitPrice + ".00"}
          </TableCell>
          <TableCell>
            {(data.totalPrice + "").indexOf(".") !== -1
              ? data.totalPrice
              : data.totalPrice + ".00"}
          </TableCell>
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
                this.props.checkInlineProduct();
                this.props.setProductValue({ editClicked: true });
                this.setState({
                  productId: productId,
                  product: data
                });
              }}
            >
              <Create />
            </IconButton>
            <IconButton
              data-productid={data._id}
              onClick={eve => {
                let { supplierId, deleteProduct } = this.props;
                let productId = eve.currentTarget.getAttribute(
                  "data-productid"
                );
                deleteProduct({
                  supplierId,
                  productId
                });
              }}
            >
              <Delete />
            </IconButton>
          </TableCell>
        </TableRow>
      );
    }
  };
  parseDate = dateString => {
    function addZero(string) {
      if (string.length === 1) {
        return "0" + string;
      } else {
        return string;
      }
    }
    let date = new Date(dateString);

    if (typeof date === "string" && date.indexOf("invalid") !== -1) {
      return "-";
    } else {
      return (
        addZero(date.getDate().toString()) +
        "/" +
        addZero(date.getMonth().toString()) +
        "/" +
        date.getFullYear()
      );
    }
  };
  renderSupplier = () => {
    const gridMargin = this.props.classes.gridMargin,
      { supplierId, suppliers } = this.props,
      index = suppliers.map(e => e.transactionId).indexOf(supplierId);
    if (!suppliers.length) {
      return;
    }
    if (index === -1) {
      return;
    }
    let {
      transactionId,
      transactionDate,
      importCountry,
      billOfEntry,
      billOfEntryDate,
      countryOfOrigin,
      supplierInvoice,
      poReference
    } = suppliers[index];
    return (
      <Paper style={{ marginTop: 10 }}>
        <Grid container xs={12}>
          <Grid item xs={12} md={4} className={gridMargin}>
            <Typography variant="subtitle1">Transaction id #</Typography>
            <ValueTypography variant="body2">
              {transactionId || "-"}
            </ValueTypography>
            <Divider light />
          </Grid>
          <Grid item xs={12} md={4} className={gridMargin}>
            <Typography variant="subtitle1">Transaction date</Typography>
            <ValueTypography variant="body2">
              {(transactionDate && this.parseDate(transactionDate)) || "-"}
            </ValueTypography>
            <Divider light />
          </Grid>
          <Grid item xs={12} md={4} className={gridMargin}>
            <Typography variant="subtitle1">Importing countries</Typography>
            <ValueTypography variant="body2">
              {importCountry ? importCountry.value : "-"}
            </ValueTypography>
            <Divider light />
          </Grid>
          <Grid item xs={12} md={4} className={gridMargin}>
            <Typography variant="subtitle1">Country of origin</Typography>
            <ValueTypography variant="body2">
              {countryOfOrigin ? countryOfOrigin.value : "-"}
            </ValueTypography>
            <Divider light />
          </Grid>
          <Grid item xs={12} md={4} className={gridMargin}>
            <Typography variant="subtitle1">Supplier invoice</Typography>
            <ValueTypography variant="bo2y1">
              {supplierInvoice || "-"}
            </ValueTypography>
            <Divider light />
          </Grid>
          <Grid item xs={12} md={4} className={gridMargin}>
            <Typography variant="subtitle1">Bill of entry date</Typography>
            <ValueTypography variant="body2">
              {(billOfEntryDate && this.parseDate(billOfEntryDate)) || "-"}
            </ValueTypography>
            <Divider light />
          </Grid>
          <Grid item xs={12} md={4} className={gridMargin}>
            <Typography variant="subtitle1">Po reference</Typography>
            <ValueTypography variant="body2">
              {poReference || "-"}
            </ValueTypography>
            <Divider light />
          </Grid>
          <Grid item xs={12} md={4} className={gridMargin}>
            <Typography variant="subtitle1">Bill of entry</Typography>
            <ValueTypography variant="body2">
              {billOfEntry || "-"}
            </ValueTypography>
            <Divider light />
          </Grid>
        </Grid>
      </Paper>
    );
  };
  componentDidMount = () => {
    const { location, getProduct, setValue } = this.props;
    setValue({
      currentSupplier: location.state.currentSupplier
    });
    getProduct(location.state.currentSupplier);
  };
  render() {
    return (
      <Grid
        container
        xs={12}
        md={10}
        style={{ margin: "auto", textAlign: "center" }}
      >
        {/* {this.renderDialog()} */}
        <Grid item xs={12}>
          {this.renderSupplier()}
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
                          this.setState({
                            product: Object.assign({}, this.state.product),
                            productId: "ADD_INLINE_PRODUCT"
                          });
                          this.props.addInlineProduct();
                          this.props.setProductValue({
                            editClicked: true
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
  addData,
  getProduct,
  setValue,
  setProductValue,
  deleteProduct,
  addInlineProduct,
  clearInlineProduct,
  checkInlineProduct
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withStyles(styles)(ProductComponent))
);
