"use strict";
const I = (_) => {
  const self = document.getElementById(_);
  self.on = (event, fun) => {
    if (typeof event  != "string") {
      self.addEventListener("click", event);
    } else {
      self.addEventListener(event, fun);
    }
  }
  return self;
}
const Q = (_) => {
  const self = document.querySelector(_);
  self.on = (event, fun) => {
    if (typeof event  != "string") {
      self.addEventListener("click", event);
    } else {
      self.addEventListener(event, fun);
    }
  }
  return self;
}
const $ = (_) => {
  const self = document.querySelectorAll(_);
  self.forEach((sf) => {
    sf.on = (event, fun) => {
      if (typeof event  != "string") {
        sf.addEventListener("click", event);
      } else {
        sf.addEventListener(event, fun);
      }
    }
  })
  return self;
}

const tuggle = (element, className = "active") => {
  if (element.classList.contains(className)) {
    element.classList.remove(className);
  } else {
    element.classList.add(className);
  }
}

const insert = (array, index, value) => {
  let ary = [];
  for (let i = 0, j = 0; i < array.length; i++) {
    if (i == index) ary[i + j++] = value;
    ary[i + j] = array[i];
  }
  return ary;
}
const _remove = (array, index) => {
  let ary = [];
  for (let i = 0, j = 0; i < array.length; i++, j++) {
    if (i !== index) ary[j] = array[i];
    else j--;
  }
  return ary;
}

const createEle = (elementName, className = null, appendParentName = null, inrHtml = null) => {
  const e = document.createElement(elementName);
  if (className) e.classList.add(className);
  if (inrHtml) e.innerHTML = inrHtml;
  if (appendParentName) appendParentName.appendChild(e);
  e.on = (event, callBackFun) => {
    e.addEventListener(event, callBackFun);
  }
  return e;
}

// let groups = []
// let historyLogs = {}

let groups = [
  // {
  //   name: "group 1",
  //   id: "20220712",
  //   items: [
  //     {
  //       name: "item fhjfjh ",
  //       quantity: 10,
  //       id: "20220700"
  //     },
  //     {
  //       name: "item 2",
  //       quantity: 40,
  //       id: "20220701"
  //     },
  //     {
  //       name: "item 3",
  //       quantity: 4,
  //       id: "20220702"
  //     },
  //   ]
  // },
  // {
  //   name: "group 2",
  //   id: "20220711",
  //   items: [
  //     {
  //       name: "item 1",
  //       quantity: 10,
  //       id: "20220700"
  //     },
  //     {
  //       name: "item 2",
  //       quantity: 40,
  //       id: "20220701"
  //     },
  //     {
  //       name: "item 3",
  //       quantity: 4,
  //       id: "20220702"
  //     },
  //   ]
  // },
  // {
  //   name: "group 3",
  //   id: "20220710",
  //   items: [
  //     {
  //       name: "item 1",
  //       quantity: 10,
  //       id: "20220700"
  //     },
  //     {
  //       name: "item 2",
  //       quantity: 40,
  //       id: "20220701"
  //     },
  //     {
  //       name: "item 3",
  //       quantity: 4,
  //       id: "20220702"
  //     },
  //   ]
  // }
]
let historyLogs = {
  // "2022-03": [ {
  //   username: "sourav",
  //   time: "Fri 15 21:04",
  //   mod: "update",
  //   type: "item",
  //   name: "3"
  // }],
  // "2022-04": [{
  //   username: "sourav",
  //   time: "Fri 15 21:04",
  //   mod: "delete",
  //   type: "group",
  //   name: "4"
  // }],
  // "2022-05": [ {
  //   username: "souravx",
  //   time: "Fri 15 21:04",
  //   mod: "update",
  //   type: "item",
  //   name: "5"
  // }],
  // "2022-06": [{
  //   username: "sourav",
  //   time: "Fri 15 21:04",
  //   mod: "create",
  //   type: "group",
  //   name: "6"
  // }],
  // "2022-07": [ {
  //   username: "sourav",
  //   time: "Fri 15 21:04",
  //   mod: "update",
  //   type: "item",
  //   name: "group 1 to 7"
  // },
  // {
  //   username: "sourav",
  //   time: "Fri 15 21:04",
  //   mod: "delete",
  //   type: "group",
  //   name: "oils"
  // },
  // {
  //   username: "souravx",
  //   time: "Fri 15 21:04",
  //   mod: "update",
  //   type: "item",
  //   name: "item 1 to biskit"
  // },
  // {
  //   username: "sourav",
  //   time: "Fri 15 21:04",
  //   mod: "create",
  //   type: "group",
  //   name: "cake op"
  // }],
}
let members = [
  // {
  //   username: "sourav@12345",
  //   key: "12345678",
  //   uid: "20220707"
  // },
  // {
  //   username: "subrata@123",
  //   key: "12345678",
  //   uid: "20220700"
  // }
]
let myStatus = {
  uid: null,
  username: null,
  userType: "visitor"
}



function getFormatTime() {
  let d = new Date();
  let days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  let day = d.getDate() <= 9 ? `0${d.getDate()}` : d.getDate();
  let hh = d.getHours() <= 9 ? `0${d.getHours()}` : d.getHours();
  let mm = d.getMinutes() <= 9 ? `0${d.getMinutes()}` : d.getMinutes();
  return `${days[d.getDay()]} ${day} ${hh}:${mm}`;
}

function hover(element) {
  const addHover = () => {
    element.classList.add("hover");
  }
  const removeHover = () => {
    element.classList.remove("hover");
  }
  element.addEventListener("touchstart", addHover);
  element.addEventListener("mouseenter", addHover);

  element.addEventListener("touchend", removeHover);
  element.addEventListener("mouseleave", removeHover);
}

function b36t10(v) {
  return parseInt(v, 36);
}
function b10t36(v) {
  return Number(v).toString(36);
}

const hoverIds = document.querySelectorAll(".hover").forEach((h) => {
  hover(h);
})

function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
