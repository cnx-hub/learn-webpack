import { helloworld } from "./helloworld";
import { common } from "../../common/index";

common();


const root = document.getElementById("root");
root.innerHTML = helloworld();
