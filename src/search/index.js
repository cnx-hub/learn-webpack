import React from "react";
import ReactDOM from "react-dom/client";
import logo from "../images/logo.png";
// import { common } from "../../common/index";
import "./search.less";

class Search extends React.Component {
  constructor() {
    super();
    this.state = {
      state: 1,
    };

    this.state = {
      Text: null,
    };

    // common();
  }

  loadComponent() {
    import("./text.js").then((Text) => {
      this.setState({
        Text: Text.default,
      });
    });
  }

  render() {
    const { Text } = this.state;

    return (
      <div className="search-text">
        搜索文字的内容
        {Text ? <Text /> : null}
        {/* {comp && React.createElement(Text)} */}
        <img src={logo} onClick={this.loadComponent.bind(this)} />
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
