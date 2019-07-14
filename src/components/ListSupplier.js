import React, { Component } from "react";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/styles";
import Container from "@material-ui/core/Container";
import lightBlue from "@material-ui/core/colors/lightBlue";
import { Link } from "react-router-dom";
const styles = theme => ({
  container: {
    height: "100vh",
    width: "100%",
    backgroundColor: lightBlue[300],
    textAlign: "center"
  },
  textContainer: { position: "relative", top: "30%", height: "auto" },
  typography: {
    color: "#fff"
  },
  primaryBtn: {
    backgroundColor: "#fff"
  }
});
class ListSupplier extends Component {
  render() {
    const { classes } = this.props;
    return (
      <Container className={classes.container} maxWidth="xl">
        <Container className={classes.textContainer}>
          <Typography variant="h2" className={classes.typography}>
            Welcome to our app
          </Typography>
          <Button
            component={Link}
            to="/addsupplier"
            variant="contained"
            className={classes.primaryBtn}
          >
            Add Supplier
          </Button>
        </Container>
      </Container>
    );
  }
}

export default withStyles(styles)(WelcomeComponent);
