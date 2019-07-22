import React, { Component } from "react";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/styles";
import lightBlue from "@material-ui/core/colors/lightBlue";
import { withRouter, Link } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import Delete from "@material-ui/icons/Delete";
import Create from "@material-ui/icons/Create";
import Launch from "@material-ui/icons/Launch";
import { connect } from "react-redux";
import {
  getListOfSupplier,
  setValue,
  deleteSupplier
} from "../actions/supplierAction";
const styles = theme => ({
  container: {
    height: "100vh",
    width: "100%",
    backgroundColor: lightBlue[300],
    textAlign: "center",
    padding: 0
  }
});
class SupplierList extends Component {
  componentDidMount = () => {
    this.props.getListOfSupplier();
  };
  handleEditClick = eve => {
    let transactionId = eve.currentTarget.getAttribute("data-transactionid"),
      { history, setValue } = this.props;
    setValue({ editMode: true, supplierToBeEdited: transactionId });
    history.push("/editsupplier");
  };

  // handleSupplierViewClick = eve => {
  //   let transactionId = eve.currentTarget.getAttribute("data-transactionid");
  //   setValue({ currentSupplier: transactionId });
  // };
  loopSupplier = () => {
    let { suppliers } = this.props,
      isDivider = "";
    if (!suppliers.length) {
      return (
        <ListItemText>
          <Typography variant="h6" style={{ textAlign: "center" }}>
            No suppliers available
          </Typography>
        </ListItemText>
      );
    }
    return suppliers.map((elem, index) => {
      isDivider = "";
      if (index + 1 !== suppliers.length) {
        isDivider = <Divider light />;
      }
      return (
        <React.Fragment>
          <ListItem key={elem.transactionId}>
            <ListItemText primary={elem.transactionId} />
            <Tooltip title="View supplier and product details">
              <IconButton
                component={Link}
                to={{
                  pathname: "/supplier",
                  state: { currentSupplier: elem.transactionId }
                }}
                data-transactionid={elem.transactionId}
              >
                <Launch />
              </IconButton>
            </Tooltip>
            <Tooltip title="Edit supplier">
              <IconButton
                data-transactionid={elem.transactionId}
                onClick={this.handleEditClick}
              >
                <Create />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete supplier">
              <IconButton
                data-transactionid={elem.transactionId}
                aria-label="delete"
                onClick={this.props.deleteSupplier.bind(
                  this,
                  elem.transactionId
                )}
              >
                <Delete />
              </IconButton>
            </Tooltip>
          </ListItem>
          {isDivider}
        </React.Fragment>
      );
    });
  };
  render() {
    const { classes } = this.props;
    return (
      <Grid container>
        <Grid item xs={12} sm={8} md={6} style={{ margin: "10px auto" }}>
          <Paper>
            <List component="nav" aria-label="Mailbox folders">
              <ListItemText>
                <Typography variant="h6" style={{ textAlign: "center" }}>
                  SUPPLIERS TRANSACTION IDS
                </Typography>
              </ListItemText>
              <Divider light />
              {this.loopSupplier()}
            </List>
          </Paper>
        </Grid>
      </Grid>
    );
  }
}
const mapStateToProps = state => ({
  suppliers: state.supplier.suppliers
});
const mapDispatchToProps = { getListOfSupplier, setValue, deleteSupplier };

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withStyles(styles)(SupplierList))
);
