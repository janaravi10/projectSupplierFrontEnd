import React, { Component } from "react";
import { connect } from "react-redux";
import { addData, getProduct, addInlineProduct } from "../actions/addDetail";
import { KeyboardDatePicker } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Dialog from "@material-ui/core/Dialog";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/styles";
import { Typography } from "@material-ui/core";
import lightBlue from "@material-ui/core/colors/lightBlue";
import { Create, Delete, Done, Clear, FilterList } from "@material-ui/icons";
import IconButton from "@material-ui/core/IconButton";
import MaterialTable from "material-table";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import { withRouter } from "react-router-dom";
import { setValue } from "../actions/supplierAction";
import Divider from "@material-ui/core/Divider";
import AutoSelectInline from "./AutoSelectInline";
import Tooltip from "@material-ui/core/Tooltip";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import "../css/product.css";
import {
  setProductValue,
  deleteProduct,
  clearInlineProduct,
  checkInlineProduct
} from "../actions/addDetail";
import { func } from "prop-types";
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
  },
  dateInput: {
    width: 150
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
const StyledTextField = withStyles({
  root: {
    width: 100
  }
})(TextField);
class ProductComponent extends Component {
  state = {
    editClicked: false,
    productId: "",
    product: {
      productName: "",
      itemQty: "",
      uom: "KG",
      packSize: "",
      packUom: "KG",
      unitPrice: "",
      totalPrice: "",
      dateField: "",
      comment: "",
      harmfulProd: false
    },
    dateError: { dateField: false },
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
    if (elem.name === "harmfulProd") {
      this.setState({
        [propName]: {
          ...this.state[propName],
          [elem.name]: elem.checked
        }
      });
      return;
    }
    propName =
      this.state.productId === "ADD_INLINE_PRODUCT" ? "product" : "product";
    // If the element input being changed
    // is itemqty or unitprice then change the total price
    if (
      elem.name === "itemQty" ||
      elem.name === "unitPrice" ||
      elem.name === "packSize"
    ) {
      let anotherUnit = elem.name === "itemQty" ? "unitPrice" : "itemQty";
      let numberString = elem.value.toString(),
        numArr = numberString.split(".");
      console.log(numberString);
      if (numArr.length === 2) {
        numArr[1].length > 2 && (numArr[1] = numArr[1].slice(0, 2));
        numArr = numArr.join(".");
      } else if (numArr.length === 1) {
        numArr = numArr.join("");
      }

      let elemValue = Number(numArr) || "";
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
        itemQty: "",
        uom: "KG",
        packSize: "",
        packUom: "KG",
        unitPrice: "",
        totalPrice: "",
        dateField: "",
        comment: "",
        harmfulProd: false
      }
    });
  };
  clearForm = propName => {
    this.setState({
      [propName]: {
        productName: "",
        itemQty: "",
        uom: "KG",
        packSize: "",
        packUom: "KG",
        unitPrice: "",
        totalPrice: "",
        dateField: "",
        comment: "",
        harmfulProd: false
      }
    });
  };
  handleSelectValue = selectOption => {
    console.log(selectOption);
    this.setState({
      product: {
        ...this.state.product,
        [selectOption.name]: selectOption.value && selectOption.value.value
      }
    });
  };
  handleDateChange = (e, name) => {
    let stateVal = this.state;
    this.setState({
      product: {
        ...stateVal.product,
        [name]: e
      }
    });
    if (!e) {
      this.setState({ dateError: { ...stateVal.dateError, [name]: true } });
      return;
    } else {
      if (e.toString().indexOf("Invalid") === -1) {
        this.setState({ dateError: { ...stateVal.dateError, [name]: false } });
      } else {
        this.setState({ dateError: { ...stateVal.dateError, [name]: true } });
      }
    }
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
        "totalPrice",
        "dateField",
        "comment"
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
      //add ending zeros
      // let digitProps = ["unitPrice", "totalPrice", "itemQty", "packSize"];
      // digitProps.forEach(
      //   val => data[val].toString().indexOf(".") < 0 && (data[val] = data[val]+".00")
      // );
      console.log(data);
      addData(
        {
          data: {
            ...data,
            supplierId: supplierId
          }
        },
        this.state.productId === "ADD_INLINE_PRODUCT" ? false : true
      );
      this.clearForm(propName);
    }
  };

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
        totalPrice,
        dateField,
        comment,
        harmfulProd
      } = this.state.product;
      let requiredFields = this.state.requiredFields;
      return (
        <TableRow style={{ borderBottom: "1px solid rgba(224, 224, 224, 1)" }}>
          <TableCell>{rowData.index + 1}</TableCell>
          <TableCell>
            <StyledTextField
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
            <StyledTextField
              margin="dense"
              value={itemQty}
              name="itemQty"
              type="number"
              onChange={this.handleChange.bind(this, false)}
              error={requiredFields.indexOf("itemQty") === -1 ? false : true}
            />
          </TableCell>
          <TableCell>
            <AutoSelectInline
              name="uom"
              updateSelectValue={this.handleSelectValue}
              selectValue={{ label: uom, value: uom }}
              suggestion={this.props.unitSuggestion}
              error={requiredFields.indexOf("uom") === -1 ? false : true}
            />
          </TableCell>
          <TableCell>
            <StyledTextField
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
            <StyledTextField
              margin="dense"
              value={unitPrice}
              name="unitPrice"
              type="number"
              onChange={this.handleChange.bind(this, false)}
              error={requiredFields.indexOf("unitPrice") === -1 ? false : true}
            />
          </TableCell>
          <TableCell>
            <StyledTextField
              margin="dense"
              value={Number(itemQty * unitPrice).toFixed(2)}
              name="totalPrice"
              type="number"
              disabled
              onChange={this.handleChange.bind(this, false)}
              error={requiredFields.indexOf("totalPrice") === -1 ? false : true}
            />
          </TableCell>
          <TableCell>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                autoOk
                variant="dialog"
                format="dd/MM/yyyy"
                className={this.props.classes.dateInput}
                shouldDisableDate={date => date.getDay() === 6}
                value={dateField || null}
                error={
                  this.state.requiredFields.indexOf("dateField") !== -1 ||
                  this.state.dateError.dateField
                }
                placeholder="select date"
                onChange={date => this.handleDateChange(date, "dateField")}
              />
            </MuiPickersUtilsProvider>
          </TableCell>
          <TableCell>
            <StyledTextField
              id="outlined-multiline-flexible"
              multiline
              rowsMax="4"
              placeholder="comment.."
              name="comment"
              value={comment}
              onChange={this.handleChange.bind(this, false)}
              error={requiredFields.indexOf("comment") === -1 ? false : true}
            />
          </TableCell>
          <TableCell>
            <FormControlLabel
              control={
                <Checkbox
                  checked={harmfulProd}
                  onChange={this.handleChange.bind(this, false)}
                  name="harmfulProd"
                />
              }
              label={harmfulProd ? "Harmful" : "not harmful"}
            />
          </TableCell>
          <TableCell
            style={{
              display: "flex",
              flexDirection: "row"
            }}
          >
            <Tooltip title="Submit">
              <IconButton
                onClick={this.saveData.bind(
                  this,
                  data._id === "ADD_INLINE_PRODUCT" ? true : false
                )}
              >
                <Done />
              </IconButton>
            </Tooltip>
            <Tooltip title="cancel">
              <IconButton
                onClick={this.popupHide.bind(
                  this,
                  data._id === "ADD_INLINE_PRODUCT" ? true : false
                )}
              >
                <Clear />
              </IconButton>
            </Tooltip>
          </TableCell>
        </TableRow>
      );
    } else {
      console.log(data);
      return (
        <TableRow>
          <TableCell>{rowData.index + 1}</TableCell>
          <TableCell>{data.productName}</TableCell>
          <TableCell>{Number(data.itemQty).toFixed(2)}</TableCell>
          <TableCell>{data.uom}</TableCell>
          <TableCell>{Number(data.packSize).toFixed(2)}</TableCell>
          <TableCell>{data.packUom}</TableCell>
          <TableCell>{Number(data.unitPrice).toFixed(2)}</TableCell>
          <TableCell>{Number(data.totalPrice).toFixed(2)}</TableCell>
          <TableCell>
            {(data.dateField && this.parseDate(data.dateField)) || "-"}
          </TableCell>
          <TableCell>{data.comment || "-"}</TableCell>
          <TableCell>{data.harmfulProd.toString()}</TableCell>
          <TableCell
            style={{
              display: "flex",
              flexDirection: "row"
            }}
          >
            <Tooltip title="Edit">
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
            </Tooltip>
            <Tooltip title="Delete">
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
            </Tooltip>
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
            columns={[
              {
                title: "S.NO",
                field: "sno",
                sorting: false,
                filtering: false
              },
              {
                title: "Item",
                field: "productName",
                sorting: false,
                filtering: false
              },
              {
                title: "Quantity",
                field: "itemQty",
                sorting: false,
                type: "numeric"
              },
              {
                title: "UOM",
                field: "uom",
                sorting: false,
                filtering: false
              },
              {
                title: "Pack Size",
                field: "packSize",
                sorting: false,
                filtering: false
              },
              {
                title: "Pack UOM",
                field: "packUom",
                sorting: false,
                filtering: false
              },
              {
                title: "Unit price",
                field: "unitPrice",
                sorting: false,
                filtering: false
              },
              {
                title: "Total Price",
                field: "totalPrice",
                sorting: false,
                filtering: true,
                type: "numeric",
                filterPlaceholder: "search"
              },
              {
                title: "Date",
                field: "dateField",
                sorting: false,
                filtering: true,
                type: "date",
                filterPlaceholder: "by date"
              },
              {
                title: "Comment",
                field: "comment",
                sorting: false,
                filtering: true,
                type: "string"
              },
              {
                title: "is harmful?",
                field: "harmfulProd",
                sorting: false,
                filtering: true,
                type: "boolean"
              }
            ]}
            icons={{ Filter: FilterList }}
            data={this.props.product}
            options={{
              filtering: true,
              search: false,
              paging: false,
              actionsColumnIndex: -1,
              headerStyle: {
                whiteSpace: "nowrap"
              }
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
  editClicked: state.product.editClicked,
  unitSuggestion: state.product.unitSuggestion
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
