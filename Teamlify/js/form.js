import { createElement } from "./createEl.js";
import {
  getAllUsers,
  renderMembers,
  addNewMember,
  updateGroup,
} from "./firebase.js";
import { userData } from "./userObj.js";

const searchUsersForm = document.querySelector("#searchUsersForm");
const usersUl = document.querySelector("#membersUlSearched");
const togglePublic = document.querySelector("#togglePublic");
const searchInput = document.querySelector("#searchInput");
const searchBtn = document.querySelector("#searchBtn");

searchUsersForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const v = searchUsersForm.searchUser.value.trim().toLowerCase();

  getAllUsers((users) => {
    users = Object.entries(users || {})
      .map((item) => item[1])
      .filter((user) => {
        // console.log(user);
        return (
          user.username.toLowerCase().includes(v) ||
          user.email.toLowerCase().includes(v)
        );
      });

    console.log(users);

    renderMembers(users, usersUl);

    for (let i = 0; i < usersUl.children.length; i++) {
      const li = usersUl.children[i];
      console.log(li);
      const btnAdd = createElement(
        "button",
        "btn",
        `<i class="fas fa-plus    "></i>`,
        li
      );
      btnAdd.addEventListener("click", () => {
        const user = users[i];
        addNewMember(userData.groupId, user.uid, {
          imgUrl: user.imgUrl,
          username: user.username,
          uid: user.uid,
        });
        searchInput.value = "";
        usersUl.innerHTML = "";
      });
    }
  });
});

togglePublic.addEventListener("click", () => {
  console.log("button");
  updateGroup(userData.groupId, { public: !userData.group.public });
});
