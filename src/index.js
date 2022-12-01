import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./Navbar/Navbar.css";
// import MineSweeper from './MineSweeper/MineSweeper';
import MineSweeper2 from "./MineSweeper2/MineSweeper2";
// import NavBar from './Navbar/NavBar';
import Test from "./Test/Test";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    {/* <Test /> */}
    {/*<NavBar />*/}
    {/* <MineSweeper />  */}
    <MineSweeper2 />
  </React.StrictMode>
);

// reportWebVitals();
