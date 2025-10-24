import React from "react";
import ReactDOM from "react-dom/client";
import logo from "../images/logo.png";
import "./search.less";

class Search extends React.Component {


  constructor() {
    super();
    this.state = {
      state: 1,
    };
  }

  render() {
    return (
      <div className="search-text">
        搜索文字的内容
        <img src={logo} />

        <div></div>
      </div>
    );
  }
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Search />
  </React.StrictMode>
);
