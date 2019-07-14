import React, { Component } from "react";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/styles";
import Container from "@material-ui/core/Container";
import lightBlue from "@material-ui/core/colors/lightBlue";
import { withRouter, Link } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import Delete from "@material-ui/icons/Delete";
import Create from "@material-ui/icons/Create";
import { connect } from "react-redux";
import { getListOfSupplier, setValue } from "../actions/supplierAction";
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
          <Typography variant="h6">No suppliers available</Typography>
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
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to={{pathname: "/supplier",state: {currentSupplier: elem.transactionId}}}
              data-transactionid={elem.transactionId}
              // onClick={this.handleSupplierViewClick}
            >
              view supplier
            </Button>
            <IconButton
              data-transactionid={elem.transactionId}
              aria-label="delete"
            >
              <Delete />
            </IconButton>
            <IconButton
              data-transactionid={elem.transactionId}
              onClick={this.handleEditClick}
              label="Comments"
            >
              <Create />
            </IconButton>
          </ListItem>
          {isDivider}
        </React.Fragment>
      );
    });
  };
  render() {
    const { classes } = this.props;
    return (
      <Container className={classes.container} maxWidth="xl">
        <Grid container>
          <Grid item xs={12} sm={8} md={6} style={{ margin: "10px auto" }}>
            <Paper>
              <List component="nav" aria-label="Mailbox folders">
                <ListItemText>
                  <Typography variant="h6">
                    SUPPLIERS TRANSACTION IDS
                  </Typography>
                </ListItemText>
                <Divider light />
                {this.loopSupplier()}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    );
  }
}
const mapStateToProps = state => ({
  suppliers: state.supplier.suppliers
});
const mapDispatchToProps = { getListOfSupplier, setValue };

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withStyles(styles)(SupplierList))
);
