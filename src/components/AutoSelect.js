import React from "react";
import Select from "react-select";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import NoSsr from "@material-ui/core/NoSsr";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import MenuItem from "@material-ui/core/MenuItem";
import PropTypes from "prop-types";
// redux
import { connect } from "react-redux";
const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    zIndex: 99999
  },
  input: {
    display: "flex",
    padding: 0,
    height: "60px",
    zIndex: 0,
    width: "269px"
  },
  valueContainer: {
    display: "flex",
    flexWrap: "wrap",
    flex: 1,
    alignItems: "center",
    overflow: "hidden",
    zIndex: 99999
  },
  noOptionsMessage: {
    padding: theme.spacing(1, 2)
  },
  singleValue: {
    fontSize: 16,
    position: "relative",
    left: "10px"
  },
  // placeholder: {
  //   position: "relative",
  //   left: "10px",
  //   fontSize: 16,
  //   zIndex: 0
  // },
  paper: {
    position: "absolute",
    zIndex: 1,
    marginTop: theme.spacing(1),
    left: 0,
    right: 0,
    width: "269px"
  },
  divider: {
    height: theme.spacing(2)
  },
  menu: {
    width: "100%",
    zIndex: 99999999
  }
}));

function NoOptionsMessage(props) {
  return (
    <Typography
      color="textSecondary"
      className={props.selectProps.classes.noOptionsMessage}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
}

NoOptionsMessage.propTypes = {
  children: PropTypes.node,
  innerProps: PropTypes.object,
  selectProps: PropTypes.object.isRequired
};

function inputComponent({ inputRef, ...props }) {
  return <div ref={inputRef} {...props} />;
}

inputComponent.propTypes = {
  inputRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object])
};

function Control(props) {
  const {
    children,
    innerProps,
    innerRef,
    selectProps: { classes, TextFieldProps }
  } = props;

  return (
    <TextField
      variant="outlined"
      InputProps={{
        inputComponent,
        inputProps: {
          className: classes.input,
          ref: innerRef,
          children,
          ...innerProps
        }
      }}
      {...TextFieldProps}
    />
  );
}

Control.propTypes = {
  children: PropTypes.node,
  innerProps: PropTypes.object,
  innerRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  selectProps: PropTypes.object.isRequired
};

function Option(props) {
  return (
    <MenuItem
      ref={props.innerRef}
      selected={props.isFocused}
      component="div"
      className={props.selectProps.classes.menu}
      style={{
        fontWeight: props.isSelected ? 500 : 400
      }}
      {...props.innerProps}
    >
      {props.children}
    </MenuItem>
  );
}

Option.propTypes = {
  children: PropTypes.node,
  innerProps: PropTypes.object,
  innerRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  isFocused: PropTypes.bool,
  isSelected: PropTypes.bool
};

function SingleValue(props) {
  return (
    <Typography
      className={props.selectProps.classes.singleValue}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
}

SingleValue.propTypes = {
  children: PropTypes.node,
  innerProps: PropTypes.object,
  selectProps: PropTypes.object.isRequired
};

function ValueContainer(props) {
  return (
    <div className={props.selectProps.classes.valueContainer}>
      {props.children}
    </div>
  );
}

ValueContainer.propTypes = {
  children: PropTypes.node,
  selectProps: PropTypes.object.isRequired
};

function Menu(props) {
  return (
    <Paper
      square
      className={props.selectProps.classes.paper}
      {...props.innerProps}
    >
      {props.children}
    </Paper>
  );
}

Menu.propTypes = {
  children: PropTypes.node,
  innerProps: PropTypes.object,
  selectProps: PropTypes.object
};

const components = {
  Control,
  Menu,
  NoOptionsMessage,
  Option,
  SingleValue,
  ValueContainer,
  DropdownIndicator: () => null,
  IndicatorSeparator: () => null
};

function AutoSelect(props) {
  const classes = useStyles();
  const theme = useTheme();
  // update the select value
  function handleChangeSingle(value) {
    props.updateSelectValue({ name: props.name, value: value });
  }

  const selectStyles = {
    input: base => ({
      color: theme.palette.text.primary,
      "& input": {
        font: "inherit"
      }
    })
  };
  const handleBlurCountryChange = e => {
    let target = e.target,
      inputVal = target.value;
    console.log(props.name, props.suggestion);
    let countryArr = props.suggestion[props.name].map(function(val) {
        return val.label;
      }),
      match = false;
    countryArr.forEach(element => {
      if (element.indexOf(inputVal) !== -1) {
        match = true;
      }
    });
    if (!match) {
      props.updateSelectValue({ name: props.name, value: null });
    }
  };
  return (
    <div className={classes.root}>
      <NoSsr>
        <Select
          classes={classes}
          styles={selectStyles}
          inputId="react-select-single"
          // TextFieldProps={{
          //   placeholder: "search country"
          // }}
          placeholder="search country.."
          styles={{
            placeholder: base => ({
              fontSize: "16px",
              color: "#adadad",
              paddingLeft: 10
            })
          }}
          onBlur={handleBlurCountryChange}
          isClearable={true}
          name={props.name}
          options={props.suggestion[props.name]}
          components={components}
          value={props.selectValue}
          onChange={handleChangeSingle}
        />
      </NoSsr>
    </div>
  );
}
export default AutoSelect;
