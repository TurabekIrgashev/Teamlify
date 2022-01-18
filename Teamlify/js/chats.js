import { addTask, showTask, removeTask, editTask } from "./chastFunctions.js";
import { userData } from "./userObj.js";
const addForm = document.querySelector("#addForm");
function updateScroll() {
  chatbody.scrollTop = chatbody.scrollHeight;
}
const auto_grow = (element) => {
  element.style.height = "5px";
  const h = element.scrollHeight;
  element.style.height = h + "px";
};
updateScroll();
addForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let task_text = addForm.task.value;

  if (task_text === "") {
    return "submit";
  }
  let time = new Date();
  let curTime = `${time.getHours()} : ${time.getMinutes()}`;
  addTask(
    {
      text: task_text,
      date: curTime,
      img: userData.imgUrl,
      user: userData.username,
    },
    addForm
  );
});

const taskListUl = document.querySelector("#taskList");
const chatBtn = document.querySelector("#chatBtn");
const taskboardPage = document.querySelector("#taskboardPage");
const chatPage = document.querySelector("#chatPage");
const actionsHeaderTitle = document.querySelector("#actionsHeaderTitle");

chatBtn.onclick = () => {
  if (userData.groupId.length < 1) {
    alert("Please choose team");
    return;
  }
  actionsHeaderTitle.innerHTML = userData.groupName;
  chatPage.classList.remove("d-none");
  taskboardPage.classList.add("d-none");
  showTask(createList);

  if (userData.isJoin) {
    setTimeout(() => {
      addForm.classList.remove("d-none");
    }, 1500);
  }
};

function createList(obj) {
  if (userData.isJoin) {
    addForm.classList.remove("d-none");
  }
  const chat = obj ? Object.entries(obj) : [];
  taskListUl.innerHTML = "";
  chat.forEach((idTask) => {
    let id = idTask[0];
    let item = idTask[1];
    const li = document.createElement("li");
    const btnCover = document.createElement("div");
    const editBtn = document.createElement("button");
    const removeBtn = document.createElement("button");

    const profileCover = document.createElement("div");
    profileCover.className = "profile-cover";
    const messageImg = document.createElement("div");
    profileCover.appendChild(messageImg);

    const chatImg = document.createElement("img");
    chatImg.alt = "profileImg";
    chatImg.className = "profile-img";
    chatImg.src = `${item.img}`;
    messageImg.appendChild(chatImg);

    const nameDateInput = document.createElement("div");
    profileCover.appendChild(nameDateInput);

    const nameDate = document.createElement("p");
    nameDateInput.appendChild(nameDate);
    nameDate.className = "m-0 name-date";

    const itemUser = document.createElement("span");
    itemUser.innerHTML = `${item.user}`;
    nameDate.appendChild(itemUser);
    itemUser.classList.add("me-2");

    const itemDate = document.createElement("span");
    itemDate.innerHTML = item.date;
    nameDate.appendChild(itemDate);

    const input = document.createElement("input");
    input.value = item.text;
    input.type = "text";
    input.className = "p-2";
    input.style =
      "background: transparent; border-radius: 10px; outline: none; color: white;";
    nameDateInput.appendChild(input);

    input.readOnly = true;

    li.append(profileCover, btnCover);
    taskListUl.append(li);
    if (item.user === userData.username) {
      btnCover.className = "btnCover";

      editBtn.onclick = () => {
        input.readOnly = false;
        input.focus();
      };
      input.onblur = () => {
        editTask(`${id}`, { text: input.value });
        input.readOnly = true;
      };
      // editTask(${id}, {text: task_text});
      editBtn.className = "btn btn-warning me-3";
      const icon = document.createElement("i");
      icon.className = "fa fa-pencil";
      editBtn.appendChild(icon);
      btnCover.appendChild(editBtn);

      removeBtn.onclick = () => {
        console.log(id);
        removeTask(id);
      };
      removeBtn.className = "btn btn-warning me-3";
      const icon1 = document.createElement("i");
      icon1.className = "fa fa-trash";
      removeBtn.appendChild(icon1);
      btnCover.appendChild(removeBtn);
    }

    if (item.user === userData.username) {
      li.className = "p-2 text-white mb-3 right";
      profileCover.className = "profile-cover chatRight";
    } else {
      li.className = "p-2 text-white mb-3";
      profileCover.className = "profile-cover";
    }
    updateScroll();
  });
}
window.removeTask = removeTask;
export { createList, updateScroll };
