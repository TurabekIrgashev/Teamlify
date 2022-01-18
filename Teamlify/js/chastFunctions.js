import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-analytics.js";
import { userData } from "./userObj.js";
import {
  getDatabase,
  ref,
  set,
  onValue,
  push,
  remove,
  update,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// databasega ulanish
const db = getDatabase();

// databasega murojat
const dbRef = ref(db);

const addTask = (task, form) => {
  push(ref(db, `groups/${userData.groupId}/chat`), task).then(() => {
    form.reset();
  });
};

const showTask = (callback) => {
  onValue(ref(db, `groups/${userData.groupId}/chat`), (data) => {
    callback(data.val());
  });
};

const removeTask = (id) => {
  console.log("remove");
  remove(ref(db, `groups/${userData.groupId}/chat/${id}`));
};

const editTask = (id, obj) => {
  update(ref(db, `groups/${userData.groupId}/chat/${id}`), obj);
};

export { addTask, showTask, removeTask, editTask };
