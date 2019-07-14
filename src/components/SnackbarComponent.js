import React from "react";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import { makeStyles } from "@material-ui/styles";
import red from "@material-ui/core/colors/red";
import clsx from "clsx";

const useStyles = makeStyles({
  success: {
    backgroundColor: "#43a047"
  },
  error: { backgroundColor: red[500] }
});
export default function SnackbarComponent(props) {
  const classes = useStyles(props);
  const { className, variant } = props;
  return (
    <Snackbar
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right"
      }}
      open={props.formSubmitSuccess}
    >
      <SnackbarContent
        message="Supplier successfuly added"
        className={clsx(classes[variant], className)}
        action={[
          <IconButton
            key="close"
            aria-label="Close"
            color="inherit"
            onClick={() => {
              props.closeSnackBar(false);
            }}
          >
            <CloseIcon />
          </IconButton>
        ]}
      />
    </Snackbar>
  );
}
