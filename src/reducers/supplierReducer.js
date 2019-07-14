import {
  SUBMIT_SUPPLIER_DATA,
  CLOSE_SNACKBAR,
  FORM_SUBMITTED,
  SET_VALUE,
  GET_SUPPLIER
} from "../actions/actionTypes";
// import country suggestion
const suggestions = [
  { label: "Afghanistan" },
  { label: "Aland Islands" },
  { label: "Albania" },
  { label: "Algeria" },
  { label: "American Samoa" },
  { label: "Andorra" },
  { label: "Angola" },
  { label: "Anguilla" },
  { label: "Antarctica" },
  { label: "Antigua and Barbuda" },
  { label: "Argentina" },
  { label: "Armenia" },
  { label: "Aruba" },
  { label: "Australia" },
  { label: "Austria" },
  { label: "Azerbaijan" },
  { label: "Bahamas" },
  { label: "Bahrain" },
  { label: "Bangladesh" },
  { label: "Barbados" },
  { label: "Belarus" },
  { label: "Belgium" },
  { label: "Belize" },
  { label: "Benin" },
  { label: "Bermuda" },
  { label: "Bhutan" },
  { label: "Bolivia, Plurinational State of" },
  { label: "Bonaire, Sint Eustatius and Saba" },
  { label: "Bosnia and Herzegovina" },
  { label: "Botswana" },
  { label: "Bouvet Island" },
  { label: "Brazil" },
  { label: "British Indian Ocean Territory" },
  { label: "Brunei Darussalam" }
].map(suggestion => ({
  value: suggestion.label,
  label: suggestion.label
}));

export function supplierReducer(
  initialState = {
    selectValue: { importCountry: null },
    suggestion: {
      importCountry: suggestions,
      countryOfOrigin: suggestions
    },
    suppliers: [],
    formSubmitSuccess: false,
    reRoute: false,
    editMode: false,
    supplierToBeEdited: "",
    currentSupplier: null
  },
  action
) {
  switch (action.type) {
    case SUBMIT_SUPPLIER_DATA:
      return Object.assign(
        {},
        initialState,
        {
          suppliers: [...initialState.suppliers, action.payload.supplier]
        },
        { formSubmitSuccess: true }
      );
    case CLOSE_SNACKBAR:
      return Object.assign({}, initialState, action.payload);
    case FORM_SUBMITTED:
      return Object.assign({}, initialState, action.payload);
    case SET_VALUE:
      return Object.assign({}, initialState, action.payload);
    case GET_SUPPLIER:
      let suppliers = action.payload.suppliers;
      suppliers = suppliers.map(elem => {
        let obj = elem;
        if (obj.importCountry) {
          obj.importCountry = {
            label: obj.importCountry,
            value: obj.importCountry
          };
        }
        if (obj.countryOfOrigin) {
          obj.countryOfOrigin = {
            label: obj.countryOfOrigin,
            value: obj.countryOfOrigin
          };
        }

        obj.transactionId = obj._id;
        delete obj._id;
        delete obj.__v;
        return obj;
      });
      return Object.assign({}, initialState, { suppliers: suppliers });
    default:
      return initialState;
  }
}
