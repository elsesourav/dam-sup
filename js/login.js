import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-analytics.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/9.6.7/firebase-auth.js";
import { equalTo, set, get, getDatabase, query, ref, update } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-database.js";



// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth();
const db = getDatabase();


const submitBtn = $(".submit_btn");
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
  location.replace("../index.html");
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

let validLogin = false;
userOrEmail.on("input", isLoginFildComplite);
password.on("input", isLoginFildComplite);
window.addEventListener("load", isLoginFildComplite);

function isLoginFildComplite() {
  const useInpVal = userOrEmail.value;
  const pasInpVal = password.value;
  if (validUName(useInpVal) && validPass(pasInpVal)) {
    validLogin = true;
    submitBtn[0].style.background = "#2819aa";
  }
  else {
    validLogin = false;
    submitBtn[0].style.background = "#2819aa99";
  }
}

// submit button
submitBtn[0].on(async () => {
  if (!validLogin) return;

  const useInpVal = userOrEmail.value;
  const pasInpVal = password.value;
  try {
    const result = await get(ref(db, `members/${useInpVal}`));
    if (result) {
      const val = result.val();
      const user = await signInWithEmailAndPassword(auth, val.email, pasInpVal);
      const obj = {
        username: val.username,
        type: val.type
      }
      setCookie("DREAMOVA-SUPPLIERS-STORAGE", JSON.stringify(obj), 1000000);
      location.replace("../index.html");
    }
  } catch (error) {
    alert("Your documents not correct! Please Try again.");
    console.log(error);
  }
});

let validSignUp = false;
username.on("input", isSignUpFildComplite);
userCode.on("input", isSignUpFildComplite);
emailIn.on("input", isSignUpFildComplite);
passwordIn.on("input", isSignUpFildComplite);
coPassword.on("input", isSignUpFildComplite);
window.addEventListener("load", isSignUpFildComplite);

function isSignUpFildComplite() {
  const usernaemVal = username.value;
  const userCodeVal = userCode.value;
  const emailInVal = emailIn.value;
  const passwordInVal = passwordIn.value;
  const coPasswordVal = coPassword.value;

  if (validUName(usernaemVal) && validText(userCodeVal) && validEmail(emailInVal) && validPass(passwordInVal) && validPass(coPasswordVal) && passwordInVal == coPasswordVal) {
    console.log("run");
    validSignUp = true;
    submitBtn[1].style.background = "#2819aa";
  } else {
    validSignUp = false;
    submitBtn[1].style.background = "#2819aa99";
  }
}

submitBtn[1].on(async () => {
  if (!validSignUp) return;
  const usernaemVal = username.value;
  const userCodeVal = userCode.value;
  const emailInVal = emailIn.value;
  const passwordInVal = passwordIn.value;

  const data = (await get(ref(db, `members`))).val();
  let userData = null;
  for (const k in data) {
    if (data[k].username == usernaemVal) {
      userData = data[k];
      break;
    }
  }

  // when username or user key are same then create a new user
  if (userData && userData.key == userCodeVal) {
    try {
      const createdUser = await createUserWithEmailAndPassword(auth, emailInVal, passwordInVal);
  
      const user = createdUser.user;
      const date = new Date();
  
      await set(ref(db, `members/${usernaemVal}`), {
        uid: user.uid,
        email: emailInVal,
        username: userData.username,
        key: userData.key,
        date: date,
        type: 'member',
        password: `%${b10t36(date)}${stringToB64(passwordInVal)}%${b10t36(date)}`
      })
      document.body.classList.toggle("active", true);
    } catch (error) {
      console.log(error);
      alert("Your documents not correct! Please Try again.");
    }
  }
})
