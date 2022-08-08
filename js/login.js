import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-analytics.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/9.6.7/firebase-auth.js";
import { equalTo, get, getDatabase, orderByChild, query, ref } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-database.js";



// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth();


const submitBtn = Q(".submit_btn");
const out = $(".out");
const userOrEmail = I("user_or_email");
const password = I("password");
const cover = $(".cover");
const outInput = $(".Input");


// create user ids
const loginWindow = I("login-window");
const createOne = I("create-one");
const goHome = I("go-home");
const goLoginPag = I("go-login-pag");
const loginWindowButton = I("login-window-button");
const fullName = I("full_name");
const username = I("username");
const userCode = I("user-code");
const emailIn = I("email");
const passwordIn = I("_password");
const coPassword = I("coPassword");


createOne.on(() => {
  document.body.classList.toggle("active", false);
});
loginWindowButton.on(() => {
  document.body.classList.toggle("active", true);
})
goLoginPag.on(() => {
  document.body.classList.toggle("active", true);
})
goHome.on(() => {
  location.replace("../index.html")
})


outInput.forEach((e, i) => {
  e.addEventListener("input", (event) => {
    if (!event.target.value.length) {
      cover[i].classList.remove("active");
      return;
    }
    cover[i].classList.add("active");
  });
});

userOrEmail.on("input", checkCompliet);
password.on("input", checkCompliet);

function checkCompliet() {
  const useInpVal = userOrEmail.value;
  const pasInpVal = password.value;
  if (useInpVal.length > 2 && pasInpVal.length > 7) {
    submitBtn.style.background = "#2819aa";
  } else {
    submitBtn.style.background = "#2819aa99";
    return;
  }
}

// submit button
submitBtn.addEventListener("click", () => {
  const useInpVal = userOrEmail.value;
  const pasInpVal = password.value;
  if (useInpVal.length < 3 && pasInpVal.length < 8) return;

  const db = getDatabase();

  const que = query(
    ref(db, "members"),
    orderByChild("username"),
    equalTo(useInpVal)
  );
  console.log(que);

  get(que)
    .then((snp) => {
      let data = snp.val();
      out.forEach(e => {
        e.classList.toggle("u1", false);
      })
      if (data) {
        for (const key in data) data = data[key];

        if (data.username == useInpVal && data.password == pasInpVal) {
          signInWithEmailAndPassword(auth, data.email, pasInpVal).then(() => {
            const obj = {
              uid: data.uid,
              username: data.username,
              userType: data.type
            }
            setCookie("DREAMOVA-SUPPLIERS-STORAGE", JSON.stringify(obj), 1000000);
            loginWindow.classList.toggle("active", false);
          })
        } else {
          out[1].classList.toggle("u1", true);
        }
      } else {
        out.forEach(e => {
          e.classList.toggle("u1", true);
        })
      }
    })
});

// const db = getDatabase();
// // const id = b10t36(Date.now());
// set(ref(db, `datas`), {
//   historyLogs: historyLogs,
//   groups: groups
// })
//   .then(() => {
//     console.log("Successful");
//   })
//   .catch((error) => {
//     console.log(error);
//   });
