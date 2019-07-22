import React from "react";
// import AutoSelectInline from "./AutoSelectInline";
import { withStyles } from "@material-ui/styles";
import { KeyboardDatePicker } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import AutoSelect from "./AutoSelect";
import Button from "@material-ui/core/Button";
import "../css/supplier.css";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { Typography } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import lightBlue from "@material-ui/core/colors/lightBlue";
import SnackbarComponent from "./SnackbarComponent";
import clsx from "clsx";
import {
  submitSupplierData,
  closeSnackBar,
  setValue
} from "../actions/supplierAction";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";
const styles = theme => {
  return {
    outerContainer: {
      backgroundColor: lightBlue[300],
      width: "100vw",
      height: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    },
    item: {
      marginTop: 10
    },
    form: {
      width: "80%",
      margin: "auto"
    },
    elemZIndex: {
      zIndex: 1
    },
    root: {
      width: "100%",
      margin: "10px auto",
      boxSizing: "border-box",
      padding: "20px",
      display: "flex",
      flexWrap: "wrap"
    },
    buttons: {
      margin: "10px 10px 0px 0px"
    },
    outline: {
      border: "1px solid red"
    },
    formControl: {
      margin: "10px",
      minWidth: 120
    },
    textField: {
      margin: 0,
      width: "269px"
    },
    lowZIndex: {
      zIndex: 0
    }
  };
};

const StyledGrid = withStyles({
  root: {
    marginBottom: 10
  }
})(Grid);

const StyledTypography = withStyles({
  root: {
    margin: 0,
    marginBottom: 10
  },
  label: {
    textTransform: "capitalize"
  }
})(Typography);
class Supplier extends React.Component {
  state = {
    supplierField: {
      importCountry: null,
      countryOfOrigin: null,
      transactionId: null,
      transactionDate: null,
      billOfEntry: "",
      billOfEntryDate: null,
      supplierInvoice: "",
      poReference: ""
    },
    dateError: { transactionDate: false, billOfEntryDate: false },
    errorFields: [],
    formSubmitSuccess: false
  };
  handleSelectValue = selectOption => {
    this.setState({
      supplierField: {
        ...this.state.supplierField,
        [selectOption.name]: selectOption.value
      }
    });
  };
  // handle TextField value
  handleTextField = eve => {
    this.setState({
      supplierField: {
        ...this.state.supplierField,
        [eve.target.name]: eve.target.value
      }
    });
  };

  // handle on submit event
  handleFormSubmit = eve => {
    eve.preventDefault();
    let stateVal = this.state.supplierField;
    let requiredFields = ["poReference", "transactionDate", "billOfEntryDate"];
    requiredFields = requiredFields.filter(elem => {
      let dayToDisable = [6];
      if (elem === "transactionDate" || elem === "billOfEntryDate") {
        let date = stateVal[elem] && new Date(stateVal[elem]);
        if (!date) return true;
        if (dayToDisable.indexOf(date.getDay()) !== -1) return true;
        if (date.toString().indexOf("Invalid") !== -1 || !stateVal[elem]) {
          return true;
        }
      } else {
        if (!stateVal[elem]) {
          return true;
        } else if (!stateVal[elem].toString().trim()) {
          return true;
        }
      }
    });
    this.setState({ errorFields: requiredFields });
    // setTimeout
    setTimeout(() => {
      this.setState({ errorFields: [] });
    }, 500);
    let dateError = this.state.dateError;
    if (
      !requiredFields.length &&
      !dateError.transactionDate &&
      !dateError.billOfEntryDate
    ) {
      this.props.submitSupplierData(stateVal, this.props.editMode);
    } else {
    }
  };
  handleDateChange = (e, name) => {
    let stateVal = this.state;
    this.setState({
      supplierField: {
        ...this.state.supplierField,
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

  componentDidMount = () => {
    let { editMode, supplierToBeEdited, suppliers } = this.props,
      supplierIndex,
      transactionIds;
    if (editMode) {
      transactionIds = suppliers.map(elem => elem.transactionId);
      supplierIndex = transactionIds.indexOf(supplierToBeEdited);
      this.setState({
        supplierField: Object.assign(
          {},
          this.state.supplierField,
          suppliers[supplierIndex]
        )
      });
    }
  };

  componentWillUnmount = () => {
    this.props.setValue({ editMode: false, supplierToBeEdited: "" });
  };
  changeRoute = () => {
    const { reRoute, history, setValue } = this.props;
    if (reRoute) {
      setTimeout(() => {
        history.push("/supplierlist");
        setValue({ formSubmitSuccess: false, reRoute: false });
      }, 2000);
    }
  };
  render() {
    const {
      transactionId,
      transactionDate,
      billOfEntryDate,
      billOfEntry,
      supplierInvoice,
      poReference
    } = this.state.supplierField;
    const { classes } = this.props;
    return (
      <form onSubmit={this.handleFormSubmit} className={classes.form}>
        {this.changeRoute()}
        <Paper className={classes.root}>
          <Grid container>
            <StyledGrid item xs={12} md={6}>
              <StyledTypography variant="body1">
                Transaction id #
              </StyledTypography>
              <span>{transactionId}</span>
            </StyledGrid>
            <StyledGrid item xs={12} md={6}>
              <StyledTypography variant="body1">
                Transaction date:
              </StyledTypography>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  autoOk
                  className={clsx(classes.textField, classes.lowZIndex)}
                  variant="dialog"
                  inputVariant="outlined"
                  format="dd/MM/yyyy"
                  shouldDisableDate={date => date.getDay() === 6}
                  value={transactionDate}
                  error={
                    this.state.errorFields.indexOf("transactionDate") !== -1 ||
                    this.state.dateError.transactionDate
                  }
                  placeholder="select date"
                  onChange={date =>
                    this.handleDateChange(date, "transactionDate")
                  }
                />
              </MuiPickersUtilsProvider>
            </StyledGrid>
            <StyledGrid item xs={12} md={6}>
              <StyledTypography variant="body1">
                Importing countries
              </StyledTypography>
              <AutoSelect
                name="importCountry"
                updateSelectValue={this.handleSelectValue}
                selectValue={this.state.supplierField["importCountry"]}
                suggestion={this.props.suggestion}
              />
            </StyledGrid>
            <StyledGrid item xs={12} md={6}>
              <StyledTypography variant="body1">
                Country of origin
              </StyledTypography>
              <AutoSelect
                name="countryOfOrigin"
                updateSelectValue={this.handleSelectValue}
                selectValue={this.state.supplierField["countryOfOrigin"]}
                suggestion={this.props.suggestion}
              />
            </StyledGrid>

            <StyledGrid item xs={12} md={6}>
              <StyledTypography variant="body1">
                Supplier invoice
              </StyledTypography>
              <TextField
                id="outlined-name"
                className={classes.textField}
                type="number"
                name="supplierInvoice"
                value={supplierInvoice}
                onChange={this.handleTextField}
                margin="normal"
                variant="outlined"
                placeholder="Supplier invoice"
              />
            </StyledGrid>
            <StyledGrid item xs={12} md={6}>
              <StyledTypography variant="body1">
                Bill of entry date
              </StyledTypography>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  autoOk
                  variant="dialog"
                  inputVariant="outlined"
                  format="dd/MM/yyyy"
                  value={billOfEntryDate}
                  error={
                    this.state.errorFields.indexOf("billOfEntryDate") !== -1 ||
                    this.state.dateError.billOfEntryDate
                  }
                  placeholder="select date"
                  className={clsx(classes.textField, classes.lowZIndex)}
                  onChange={date =>
                    this.handleDateChange(date, "billOfEntryDate")
                  }
                  shouldDisableDate={date => date.getDay() === 6}
                />
              </MuiPickersUtilsProvider>
            </StyledGrid>
            <StyledGrid item xs={12} md={6} direction="coloumn">
              <StyledTypography variant="body1">po reference</StyledTypography>
              <TextField
                error={this.state.errorFields.indexOf("poReference") !== -1}
                name="poReference"
                // required
                className={classes.textField}
                value={poReference}
                type="text"
                onChange={this.handleTextField}
                margin="normal"
                variant="outlined"
                placeholder="PO reference text"
              />
            </StyledGrid>
            <StyledGrid item xs={12} md={6}>
              <StyledTypography variant="body1">Bill of entry</StyledTypography>
              <TextField
                name="billOfEntry"
                type="text"
                value={billOfEntry}
                className={classes.textField}
                onChange={this.handleTextField}
                margin="normal"
                variant="outlined"
                placeholder="bill of entry text"
              />
            </StyledGrid>
            <StyledGrid container xs={12}>
              <Button
                variant="contained"
                color="primary"
                className={classes.buttons}
                type="submit"
              >
                {this.props.editMode ? "Submit Edit" : "Submit"}
              </Button>
              <Button
                variant="contained"
                className={classes.buttons}
                component={Link}
                to="/"
              >
                {this.props.editMode ? "Cancel Edit" : "Cancel"}
              </Button>
            </StyledGrid>
          </Grid>
          <SnackbarComponent
            formSubmitSuccess={this.props.formSubmitSuccess}
            closeSnackBar={this.props.closeSnackBar}
            variant="success"
          />
        </Paper>
      </form>
    );
  }
}

const mapStateToProps = state => ({
  formSubmitSuccess: state.supplier.formSubmitSuccess,
  reRoute: state.supplier.reRoute,
  editMode: state.supplier.editMode,
  supplierToBeEdited: state.supplier.supplierToBeEdited,
  suppliers: state.supplier.suppliers,
  suggestion: state.supplier.suggestion
});
const mapDispatchToProps = {
  submitSupplierData,
  closeSnackBar,
  setValue
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withStyles(styles)(Supplier))
);
