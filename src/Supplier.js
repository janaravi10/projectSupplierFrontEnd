import React, { Component } from "react";

export default class Supplier extends Component {
  render() {
    return (
      <div className="App">
        <form className="supplier-form">
          <div className="transaction">
            <label>Transaction id</label>
            <input />
            <span className="seperator">|</span>
            <label>Transaction date</label> <input type="date" />
          </div>
          <div className="supplier">
            <label>Import from supplier</label>
            <input list="browsers" id="myBrowser" name="myBrowser" />
            <datalist id="browsers">
              <option value="CHINA">china</option>
              <option value="SAUDI">saudi</option>
              <option value="AMERICA">america</option>
              <option value="AFRICA">africa</option>
            </datalist>
            <span className="seperator">|</span>
            <label>Country of origin</label>
            <select>
              <option value="CHINA">china</option>
              <option value="SAUDI">saudi</option>
              <option value="AMERICA">america</option>
              <option value="AFRICA">africa</option>
            </select>
            <label>Currency & rate</label>
            <input type="number" />
            <span className="currency-rate">75</span>
            <select>
              <option value="INR">inr</option>
              <option value="DOLLAR">dollar</option>
            </select>
          </div>
          <div className="invoice">
            <label>Supplier invoice number</label>
            <input name="INVOICE_NUMBER" />
            <span className="seperator">|</span>
            <label>invoice date</label>{" "}
            <input type="date" name="INVOICE_DATE" />
          </div>
        </form>
      </div>
    );
  }
}
