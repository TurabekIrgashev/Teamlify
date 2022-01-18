import { setGroupName } from "./firebase.js";
const addNewGroupBtn = document.querySelector("#addNewGroupBtn");
const newGroupInput = document.querySelector("#newGroupInput");
const newGroup = document.querySelector("#newGroup");
const groupLists = document.querySelector("#groupLists");
const headerGroup = document.querySelector("#headerGroup");
const membersUl = document.querySelector("#membersUl");
const btnGrHide = document.querySelector("#btnGrHide");
const btnGrShow = document.querySelector("#btnGrShow");
const groups = document.querySelector("#groups");
const btnMembersHide = document.querySelector("#btnMembersHide");
const btnMembersShow = document.querySelector("#btnMembersShow");
const members = document.querySelector("#members");
const chatBody = document.querySelector("#chatBody");

btnGrHide.onclick = () => {
  console.log("hide");
  groups.classList.remove("showGroups");
  groups.classList.add("hideGroup");
  btnGrShow.style.display = "block";
};
btnGrShow.onclick = () => {
  console.log("show");
  groups.classList.remove("hideGroup");
  groups.classList.add("showGroups");
  btnGrShow.style.display = "none";
};
btnMembersHide.onclick = () => {
  console.log("hide");
  members.classList.remove("showMembers");
  members.classList.add("hideMembers");
  btnMembersShow.style.display = "block";
  chatBody.classList.add("px-5");
};
btnMembersShow.onclick = () => {
  console.log("show");
  members.classList.remove("hideMembers");
  members.classList.add("showMembers");
  btnMembersShow.style.display = "none";
};
newGroup.addEventListener("submit", (e) => {
  e.preventDefault();
  const username = document.querySelector("#signupUsername").value;
  if (newGroupInput.value) {
    setGroupName(newGroupInput.value, username);
    membersUl.innerHTML = "";
  }
  newGroupInput.value = "";
});
