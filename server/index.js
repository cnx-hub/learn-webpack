// 确保 global 在作用域中可用（用于 UMD 包装器）
if (typeof global === "undefined") {
  var global = globalThis || this || {};
}

const fs = require("fs");
const path = require("path");
const express = require("express");
const React = require("react");
const { renderToString } = require("react-dom/server");
const SSR = require("../dist/search-server.js");
const data = require("./data.json");
const template = fs.readFileSync(
  path.join(__dirname, "../dist/search.html"),
  "utf-8"
);

const renderMarkup = (htmlStr, initialData = null) => {
  let html = template.replace("<!--HTML_PLACEHOLDER-->", htmlStr);
  
  // 可选：注入初始数据到客户端
  if (initialData) {
    const dataStr = JSON.stringify(initialData);
    html = html.replace(
      "<!--INITIAL_DATA_PLACEHOLDER-->",
      `<script>window.__INITIAL_DATA__=${dataStr}</script>`
    );
  }
  
  return html;
};

const server = (port) => {
  const app = express();

  app.use(express.static("dist"));
  app.get("/search", (req, res) => {
    try {
      // 获取组件：CommonJS 导出时，可能是 SSR.default 或 SSR 本身
      let Component;

      // 优先检查 default 导出（ES6 模块）
      if (SSR && typeof SSR === "object" && SSR.default) {
        Component = SSR.default;
      } else if (typeof SSR === "function") {
        // 如果是函数，直接使用
        Component = SSR;
      } else {
        // 其他情况，尝试使用 SSR 本身
        Component = SSR;
      }

      // 验证 Component 是否是有效的 React 组件
      if (typeof Component !== "function" && typeof Component !== "string") {
        console.error("Invalid component type:", typeof Component, Component);
        throw new Error(
          `Invalid component type: expected function or string, got ${typeof Component}`
        );
      }

      // 服务端渲染：将 React 组件转换为 HTML 字符串
      const htmlStr = renderToString(React.createElement(Component));

      // 可选：预取数据（如果需要）
      // const initialData = await fetchData();

      // 生成完整 HTML
      const html = renderMarkup(htmlStr, data);

      res.status(200).send(html);
    } catch (error) {
      console.error("SSR Error:", error);
      res
        .status(500)
        .send(`Server Error: ${error.message}\n\nStack:\n${error.stack}`);
    }
  });

  app.listen(port, () => {
    console.log("Server is running on port:" + port);
  });
};

server(process.env.PORT || 3000);
