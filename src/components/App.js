import React from "react";
import "../css/App.css";
import productComponent from "./ProductComponent";
import Supplier from "./Supplier";
import WelcomeComponent from "./WelcomeComponent";
import SupplierList from "./SupplierList";
import { BrowserRouter as Router, Route } from "react-router-dom";
function App() {
  return (
    <React.Fragment>
      <Router>
        <Route exact path="/" component={WelcomeComponent} />
        <Route exact path="/addsupplier" component={Supplier} />
        <Route exact path="/editsupplier" component={Supplier} />
        <Route exact path="/supplier" component={productComponent} />
        <Route exact path="/supplierlist" component={SupplierList} />
      </Router>
    </React.Fragment>
  );
}
export default App;
