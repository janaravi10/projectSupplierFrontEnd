import { createStore, applyMiddleware, combineReducers, compose } from "redux";
import thunk from "redux-thunk";
import { productReducer } from "./reducers/productReducer";
import { supplierReducer } from "./reducers/supplierReducer";
const rootReducer = combineReducers({
  product: productReducer,
  supplier: supplierReducer
});
const store = createStore(
  rootReducer,
  {},
  compose(
    applyMiddleware(thunk),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
);
export default store;
