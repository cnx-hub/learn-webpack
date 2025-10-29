import { helloworld } from "./helloworld";
import { common } from "../../common/index";
import { a, b } from "../tree-shaking";

if (false) {
  const funA = a();
  console.log(funA);
}

common();

const root = document.getElementById("root");
root.innerHTML = helloworld();
