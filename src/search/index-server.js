import React from "react";
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
    console.log("click");

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
        <div>123123</div>
      </div>
    );
  }
}

// 服务端渲染只需导出组件，不需要渲染到 DOM
export default Search;
