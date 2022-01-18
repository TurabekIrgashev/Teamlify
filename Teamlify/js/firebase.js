import { createElement } from "./createEl.js";
import { showTask } from "./chastFunctions.js";
import { createList, updateScroll } from "./chats.js";
import { userData } from "./userObj.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.2/firebase-app.js";
import {
  getDatabase,
  ref,
  set,
  onValue,
  push,
  remove,
  update,
} from "https://www.gstatic.com/firebasejs/9.6.2/firebase-database.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  deleteUser,
} from "https://www.gstatic.com/firebasejs/9.6.2/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.2/firebase-analytics.js";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAlbODJfsf-pvCrNQdu0IOTwtbvZo90N60",
  authDomain: "fir-learning-2-c96ab.firebaseapp.com",
  databaseURL:
    "https://fir-learning-2-c96ab-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "fir-learning-2-c96ab",
  storageBucket: "fir-learning-2-c96ab.appspot.com",
  messagingSenderId: "696256624301",
  appId: "1:696256624301:web:37ef196390ec712b343824",
  measurementId: "G-Q2RGQY8EDL",
};
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth();
const db = getDatabase();

//#region CONSTS
const welcome = document.querySelector("#welcome");
const menuImg = document.querySelector("#menuImg");
const groups = document.querySelector("#groups");
const signContainer = document.querySelector("#signContainer");
const signupContainer = document.querySelector("#signupContainer");
const signInContainer = document.querySelector("#signInContainer");
const window = document.querySelector("#window");
const signupBtn = document.querySelector("#signupBtn");
const signInBtn = document.querySelector("#signInBtn");
const logOut = document.querySelector("#logOut");
const usernameMenu = document.querySelector("#usernameMenu");
const menu = document.querySelector("#menu");
const actionsHeaderTitle = document.querySelector("#actionsHeaderTitle");
const membersUl = document.querySelector("#membersUl");
const members = document.querySelector("#members");
const chatWriteSec = document.querySelector("#chatWriteSec");
const addForm = document.querySelector("#addForm");
const taskboardPage = document.querySelector("#taskboardPage");
const taskboardBtn = document.querySelector("#taskboardBtn");
const chatPage = document.querySelector("#chatPage");

const forAdmin = document.querySelector("#forAdmin");
const usersUl = document.querySelector("#membersUlSearched");

//#endregion CONSTS
// functions
//#region join team

//#endregion
//#region logOut
logOut.onclick = () => {
  dnone(window);
  dnone(menu);
  dnone(chatPage);
  dnone(members);
  dnoner(signContainer);
  dnoner(signInBtn);
  dnoner(signupBtn);
  const userDel = auth.currentUser;
};

//#endregion logOut
//#region issignIn
const isSignIn = (callback = () => {}) => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const starCountRef = ref(db, `users/${user.uid}`);
      onValue(starCountRef, (snapshot) => {
        const data = snapshot.val();
        //updateStarCount(postElement, data);

        userData.imgUrl = data.imgUrl;
        userData.email = data.email;
        userData.username = data.username;
        userData.uid = user.uid;
        menuImg.src = data.imgUrl;
        usernameMenu.innerHTML = data.username;
      });
      callback(true);
    } else {
      console.warn("no sign in");
      callback(false);
    }
  });
};

isSignIn(() => {
  dnone(signContainer);
  dnone(welcome);
  dnoner(menu);
  dnone(signupBtn);
  dnone(signInBtn);
  dnoner(window);
  getGroups();
});
//#endregion issignIn
//#region  rigistr
const registr = () => {
  const signupForm = document.querySelector("#signupForm");
  dnoner(signupContainer);
  dnoner(signContainer);
  dnone(welcome);
  signupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.querySelector("#signupEmail").value;
    const pass = document.querySelector("#signupPass").value;
    const username = document.querySelector("#signupUsername").value;
    const img = document.querySelector("#signupImg").value;
    userData.username = username;
    userData.imgUrl = img;
    userData.email = email;

    usernameMenu.innerHTML = username;
    menuImg.src = img;
    createUserWithEmailAndPassword(auth, email, pass)
      .then((userCredential) => {
        dnoner(welcome);
        userData.uid = userCredential.user.uid;
        const title1 = document.querySelector("#welcomeTitle");
        title1.innerHTML = "Successfully signed! You can SignIn";
        set(ref(db, `users/${userCredential.user.uid}`), {
          username: username,
          email: email,
          imgUrl: img,
          uid: userCredential.user.uid,
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("signupda up hato");
      });
  });
};
//#endregion registr

//#region  enter
const enter = () => {
  dnoner(signInContainer);
  dnoner(signContainer);
  signInForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.querySelector("#signInEmail").value;
    const pass = document.querySelector("#signInPass").value;
    signInWithEmailAndPassword(auth, email, pass)
      .then((userCredential) => {
        // Signed in
        console.log("signIn");
        const user = userCredential.user;
        if (user) {
          dnone(signContainer);
          dnone(welcome);
          dnoner(menu);

          dnone(signInBtn);
          dnone(signupBtn);
          dnoner(window);
        }

        getGroups();
        document.location.reload();
      })
      .catch((error) => {
        alert("Password or email failed");
      });
  });
};
//#endregion enter

//#region  setGroupName
const setGroupName = (name, username) => {
  push(ref(db, "groups/"), {
    title: name,
    public: false,
    admin: userData.username,
  });
  getGroups();
};
//#endregion setGroupName

//#region  getgroups
const getGroups = () => {
  const starCountRef = ref(db, "groups/");
  const res = onValue(starCountRef, (snapshot) => {
    const data = snapshot.val();
    let data1 = Object.entries(data || {}).filter((group) => {
      const g = group[1];

      if (g.public || g.admin === userData.username) return true;

      const members = Object.entries(g.members || {}).map(
        (item) => item[1].username
      );
      if (members.includes(userData.username)) return true;

      return false;
    });

    renderGroup(data1);
  });
};
//#endregion getgroups
const groupLists = document.querySelector("#groupLists");
//#region  rendergroup
const renderGroup = (arr) => {
  groupLists.innerHTML = "";
  arr.map((group) => {
    const keyGroup = group[0];
    const li = createElement(
      "li",
      "d-flex align-items-center shadow p-2 justify-content-between",
      "",
      groupLists
    );
    const left = createElement(
      "div",
      "d-flex align-items-center gap-2",
      "",
      li
    );
    const icon = createElement(
      "span",
      "",
      ` <i class="fas fa-user-friends"></i>`,
      left
    );
    const button = createElement("button", "btn grBtn", group[1].title, left);
    button.value = group[1].title;

    button.onclick = () => {
      dnone(addForm);
      dnoner(members);
      button.classList.add = "btn-danger";
      userData.group = group[1];
      userData.groupName = button.value;
      userData.isJoin = false;
      actionsHeaderTitle.innerHTML = `${button.value} : Chat`;
      userData.groupId = keyGroup;
      const taskListUl = document.querySelector("#taskList");
      taskListUl.innerHTML = "";

      const div = createElement(
        "div",
        "d-flex justify-content-center align-items-center w-100 h-100",
        "",
        taskListUl
      );

      getGroupMembers(keyGroup);
      showTask(createList);
      dnoner(chatPage);
      dnone(taskboardPage);
      dnoner(right);
      checkAdmin(userData.groupId);
    };

    const right = createElement("div", "d-none", "", li);

    const icons = createElement(
      "div",
      "d-flex justify-content-end ms-1 align-items-center",

      "",
      right
    );
    const join = createElement(
      "button",
      "btn btn-success",
      `<i class="fas fa-arrow-circle-right"></i>`,
      icons
    );
    const exit = createElement(
      "button",
      "btn d-none btn-danger",
      `<i class="fas fa-arrow-circle-left"></i>`,
      icons
    );
    getGroupMembers2(keyGroup, join, exit);
    exit.onclick = () => {
      remove(ref(db, `groups/${userData.groupId}/members/${userData.uid}`));
      dnoner(join);
      console.log("exit");
      dnone(exit);
      dnone(addForm);
      console.log(userData.uid);
      getGroupMembers(userData.groupId);
    };
    join.onclick = () => {
      updateScroll();
      dnoner(exit);
      dnone(join);
      dnoner(addForm);
      getUser((user) => {
        addNewMember(keyGroup, user.uid, {
          imgUrl: userData.imgUrl,
          username: userData.username,
          uid: user.uid,
        });
      });
    };
    if (group[1].admin === userData.username) {
      const trash = createElement(
        "button",
        "btn",
        ` <i class="fa fa-trash-alt"></i>`,
        icons
      );
      trash.onclick = () => {
        console.log("trash ishga tushdi");
        remove(ref(db, `groups/${keyGroup}`));
      };
    }
  });
};
//#endregion rendergroups
//#region getuser
const getUser = (callback) => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      callback(user);
    } else {
      log.warn("User sign in qilmagan");
    }
  });
};
//#endregion getuser
const headerGroup = document.querySelector("#headerGroup");
//#region  member

//#region  add new member
const addNewMember = (keyGroup, userUid, obj) => {
  console.log(keyGroup, userUid);
  set(ref(db, `groups/${keyGroup}/members/${userUid}`), obj);
};
//#endregion add new memeber

const updateGroup = (keyGroup, obj) => {
  update(ref(db, `groups/${keyGroup}/`), obj);
};

//#region get group members
const getGroupMembers = (keyGroup) => {
  const starCountRef = ref(db, `groups/${keyGroup}`);
  const res = onValue(starCountRef, (snapshot) => {
    const data = snapshot.val();
    const data2 = Object.entries(data.members || {}).map((item) => item[1]);
    renderMembers(data2, membersUl);
  });
};

//#region render members
const renderMembers = (members, membersUl) => {
  membersUl.innerHTML = "";

  members.map((member) => {
    const li = createElement("li", "d-flex align-items-center", "", membersUl);
    const img = createElement("img", "", "", li);
    img.src = member.imgUrl;
    const p = createElement("p", "m-0 mx-2", member.username, li);
    p.style.flex = "1";
    if (userData.username === member.username) {
      userData.isJoin = true;
    }
  });

  return membersUl;
};

const getGroupMembers2 = (keyGroup, join, exit) => {
  const starCountRef = ref(db, `groups/${keyGroup}`);
  const res = onValue(starCountRef, (snapshot) => {
    const data = snapshot.val();
    renderMembers2(data.members, join, exit);
  });
};
const renderMembers2 = (members, join, exit) => {
  const azolar = Object.entries(members || {}) || [];

  azolar.map((mem) => {
    const member = mem[1];
    if (userData.username === member.username) {
      dnone(join);
      dnoner(exit);
    }
  });
};

//#region taskboard
taskboardBtn.onclick = () => {
  if (userData.groupId.length < 1) {
    alert("Please choose team");
    return;
  }
  dnone(chatPage);
  dnoner(taskboardPage);
  const taskboardTitle = document.querySelector("#taskboardTitle");
  taskboardTitle.innerHTML = `${userData.groupName} : Taskboard`;
  const dbRef = ref(db);

  const listsInput = document.querySelector("#newList");

  const lists = document.querySelector("#lists");

  const createElement = (tagName, className, innerHTML, father) => {
    const element = document.createElement(tagName);
    element.innerHTML = innerHTML;
    element.className = className;

    father && father.append(element);

    return element;
  };

  const getTaskLists = (callback) => {
    const starCountRef = ref(db, `groups/${userData.groupId}/taskslist`);
    onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();

      callback(data);
    });
  };

  const renderLists = (data) => {
    const arrayData = Object.entries(data || {});

    lists.innerHTML = "";

    const container = createElement("div", "container-fluid", "", lists);
    const row = createElement("div", "row", "", container);

    arrayData.map((message) => {
      const item = message[1];
      const key = message[0];

      const tasksArray = Object.entries(item.tasks || {});

      const list = document.createElement("div");
      list.className = "col-sm-6 col-md-3 m-1 list shadow p-3";

      const headList = createElement(
        "div",
        "headList d-flex align-items-center justify-content-between",
        "",
        list
      );

      const title = createElement("p", "m-0 ", item.title, headList);

      const titleInput = createElement(
        "input",
        "d-none form-control",
        "",
        headList
      );
      const editTitleBtn = createElement(
        "button",
        "btn d-none ms-2",
        `<i class = "fas fa-check"></i>`,
        headList
      );

      const headBtn = createElement(
        "button",
        "btn m-1",
        `<i class = "fas fa-ellipsis-v"></i>`,
        headList
      );

      const ellipse = createElement(
        "div",
        "d-none shadow p-3 ellipse",
        "",
        headList
      );

      const deleteList = createElement(
        "button",
        "btn w-100",
        `<i class="me-2 fas fa-trash-alt"></i>`,
        ellipse
      );
      const editList = createElement(
        "button",
        "btn w-100",
        `<i class="me-2 fas fa-edit"></i>`,
        ellipse
      );

      deleteList.onmouseover = () => {
        deleteList.style.background = "#CED1DA";
      };
      deleteList.onmouseleave = () => {
        deleteList.style.background = "white";
      };

      editList.onmouseover = () => {
        editList.style.background = "#CED1DA";
      };
      editList.onmouseleave = () => {
        editList.style.background = "white";
      };

      const deleteSpan = createElement("span", "", "Delete List", deleteList);
      const editSpan = createElement("span", "", "Edit List", editList);

      headBtn.onclick = () => {
        if (ellipse.classList.contains("d-none")) {
          ellipse.classList.remove("d-none");
          ellipse.classList.add("d-flex");
          ellipse.classList.add("flex-column");
          ellipse.classList.add("align-items-start");
          deleteList.onclick = () => {
            remove(ref(db, `groups/${userData.groupId}/taskslist/${key}`));
          };
          titleInput.value = item.title;
          editList.onclick = () => {
            title.classList.add("d-none");
            titleInput.classList.remove("d-none");
            editTitleBtn.classList.remove("d-none");
            editTitleBtn.onclick = () => {
              if (titleInput.value === "") return;
              update(ref(db, `groups/${userData.groupId}/taskslist/${key}`), {
                title: titleInput.value,
              });
              title.classList.remove("d-none");
              titleInput.classList.add("d-none");
              editTitleBtn.classList.add("d-none");
              ellipse.classList.add("d-none");
            };
          };
        } else {
          ellipse.classList.add("d-none");
        }
      };
      headBtn.onblur = () => {
        setTimeout(() => {
          ellipse.classList.add("d-none");
        }, 350);
      };

      // Add task form
      const addForm = createElement(
        "div",
        "d-flex rounded align-items-center",
        "",
        list
      );

      const addFormParagraph = createElement(
        "p",
        "paragraph p-0 m-0",
        " Add tasks",
        addForm
      );

      const addFormInput = createElement("input", "d-none S", "", addForm);
      const addFormChecked = createElement(
        "button",
        "btn d-none ms-2",
        `<i class = "fas fa-check"></i>`,
        addForm
      );
      addFormInput.placeholder = "Add New Task";

      addForm.onclick = (item) => {
        addFormInput.classList.remove("d-none");
        addFormParagraph.classList.add("d-none");
        addFormChecked.classList.remove("d-none");
        addFormChecked.onclick = () => {
          if (addFormInput.value === "") return;
          // addTask(task, list);
          // push(ref(db,), addFormInput.value);
          push(ref(db, `groups/${userData.groupId}/taskslist/${key}/tasks`), {
            task: addFormInput.value,
          });
        };
      };

      // Todo body

      tasksArray.map((taskItem) => {
        const keyTask = taskItem[0];
        const taskObj = taskItem[1];

        const todoBody = createElement("div", "todo-body", "", list);

        const tasksTodo = createElement("ul", "tasksTodo", "", todoBody);

        const task = createElement(
          "li",
          "p-1 m-1 d-flex justify-content-between",
          "",
          tasksTodo
        );

        const span = createElement("span", "ms-2", taskObj.task, task);

        const btns = createElement("div", "", "", task);

        const deleteBtn = createElement(
          "button",
          "btn p-0 px-1 m-0",
          `<i class="fas fa-trash-alt"></i>`,
          btns
        );
        const editBtn = createElement(
          "button",
          "btn p-0 px-1 m-0",
          `<i class="fas fa-edit"></i>`,
          btns
        );

        const editTaskInput = createElement(
          "input",
          "d-none form-control",
          "",
          task
        );
        const editTaskChecked = createElement(
          "button",
          "btn d-none ms-2",
          `<i class = "fas fa-check"></i>`,
          task
        );

        deleteBtn.style.color = "white";
        editBtn.style.color = "white";

        task.onmouseover = () => {
          deleteBtn.style.color = "#CED1DA";
          editBtn.style.color = "#CED1DA";
          deleteBtn.onclick = () => {
            // tasksTodo.remove();
            remove(
              ref(
                db,
                `groups/${userData.groupId}/taskslist/${key}/tasks/${keyTask}`
              )
            );
          };
          editBtn.onclick = () => {
            editTaskInput.classList.remove("d-none");
            editTaskChecked.classList.remove("d-none");
            deleteBtn.classList.add("d-none");
            editBtn.classList.add("d-none");
            span.classList.add("d-none");
            editTaskInput.value = taskObj.task;
            editTaskChecked.onclick = () => {
              update(
                ref(db, `groups/${userData.groupId}/${key}/tasks/${keyTask}`),
                {
                  task: editTaskInput.value,
                }
              );
              editTaskInput.classList.add("d-none");
              editTaskChecked.classList.add("d-none");
              deleteBtn.classList.remove("d-none");
              editBtn.classList.remove("d-none");
              span.classList.remove("d-none");
            };
          };
        };
        task.onmouseleave = () => {
          deleteBtn.style.color = "white";
          editBtn.style.color = "white";
        };
      });

      row.append(list);
    });
  };
  getTaskLists(renderLists);
  // document.querySelector("body").onload = () => {
  //   getTaskLists(renderLists);
  // };

  const add = document.querySelector("#addList");

  add.onclick = () => {
    const listsInputValue = document.querySelector("#newList").value;
    const newList = document.querySelector("#newList");
    newList.value = "";
    console.log("add bolsildi");
    const obj = {
      title: listsInputValue,
    };
    push(ref(db, `groups/${userData.groupId}/taskslist/`), obj);
  };
};

const getAllUsers = (callback = () => {}) => {
  onValue(ref(db, `users`), (snapshot) => {
    const data = snapshot.val();
    callback(data);
  });
};
const checkAdmin = (id) => {
  const starCountRef = ref(db, `groups/${id}/admin`);
  const res = onValue(starCountRef, (snapshot) => {
    const data = snapshot.val();
    renderAdminPage(data);
  });
};

const renderAdminPage = (name) => {
  forAdmin.innerHTML = "";
  if (userData.username === name) {
    const addDiv = createElement("div", "mb-4", "", forAdmin);
    const div = createElement(
      "div",
      "d-flex align-items-center mb-3",
      "",
      addDiv
    );

    const h2Add = createElement("p", "m-0 p-0", `Group type :  `, div);
    const typeP = createElement("p", "m-0 p-0 ms-1", "", div);
    const modeDiv = createElement(
      "div",
      "d-flex align-items-center mb-2",
      "",
      addDiv
    );
    const modeH2 = createElement("p", "m-0 p-0", "Change Mode : ", modeDiv);
    const togBtn = createElement("button", "btn btnMode", " change", modeDiv);
    togBtn.type = "submit";
    togBtn.id = "togglePublic";
    if (userData.group.public) {
      typeP.innerHTML = "Public";
      togBtn.innerHTML = "Private";
      togBtn.value = "Private";
    } else {
      typeP.innerHTML = "Private";
      togBtn.innerHTML = "Public";
      togBtn.value = "Public";
    }
    const formAdd = createElement(
      "form",
      "d-flex align-items-center",
      "",
      addDiv
    );
    formAdd.id = "searchUsersForm";
    const inputAdd = createElement("input", "form-control", "", formAdd);
    inputAdd.name = "searchUser";
    inputAdd.type = "text";
    inputAdd.color = "white";
    inputAdd.placeholder = "Add new member";
    inputAdd.id = "searchInput";
    const buttonAdd = createElement(
      "button",
      "btn  ",
      `<i class="fas fa-search"></i>`,
      formAdd
    );
    const buttonExit = createElement(
      "button",
      "btn  d-none",
      ` <i class="fa fa-times"></i>`,
      formAdd
    );

    const ul = createElement("ul", "members", "", addDiv);
    ul.id = "membersUlSearched";
    const settingDiv = createElement("div", "mb-4", "", forAdmin);

    const togDiv = createElement(
      "div",
      "d-flex align-items-center",
      "",
      settingDiv
    );

    buttonAdd.onclick = (e) => {
      e.preventDefault();
      buttonExit.classList.remove("d-none");
      buttonAdd.classList.add("d-none");
      const v = formAdd.searchUser.value.trim().toLowerCase();

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

        renderMembers(users, ul);

        for (let i = 0; i < ul.children.length; i++) {
          const li = ul.children[i];
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
          });
        }
      });
    };
    buttonExit.onclick = (e) => {
      dnone(buttonExit);
      dnoner(buttonAdd);
      e.preventDefault();
      searchInput.value = "";
      ul.innerHTML = "";
    };

    togBtn.onclick = () => {
      updateGroup(userData.groupId, { public: !userData.group.public });
      if (togBtn.value === "Public") {
        togBtn.innerHTML = "Private";
        togBtn.value = "Private";
        typeP.innerHTML = "Public";
      } else {
        togBtn.innerHTML = "Public";
        togBtn.value = "Public";
        typeP.innerHTML = "Private";
      }
    };
  }
};
export {
  registr,
  enter,
  auth,
  setGroupName,
  onAuthStateChanged,
  getAllUsers,
  renderMembers,
  addNewMember,
  updateGroup,
};
//#endregion exposrts
