import { registr, enter } from "./firebase.js";

//consts

const signupBtn = document.querySelector("#signupBtn");
const signInBtn = document.querySelector("#signInBtn");
const signInContainer = document.querySelector("#signInContainer");
const signupContainer = document.querySelector("#signupContainer");

// consts

//onclicks

signupBtn.onclick = () => {
  dnone(signInContainer);
  registr();
};

signInBtn.onclick = () => {
  dnone(signupContainer);
  enter();
};
