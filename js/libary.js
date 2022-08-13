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
    if (typeof event  != "string") {
      e.addEventListener("click", event);
    } else {
      e.addEventListener(event, callBackFun);
    }
  }
  return e;
}


function getFormatTime() {
  let d = new Date();
  let days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  let day = d.getDate() <= 9 ? `0${d.getDate()}` : d.getDate();
  let hh = d.getHours() <= 9 ? `0${d.getHours()}` : d.getHours();
  let mm = d.getMinutes() <= 9 ? `0${d.getMinutes()}` : d.getMinutes();
  return `${days[d.getDay()]} ${day} ${hh}:${mm}`;
}

function hover(element, name = "hover") {
  const namerun = `${name}-n`
  element.classList.add(namerun);
  element.classList.remove(name);
  const addHover = () => {
    element.classList.add(name);
    element.classList.remove(namerun);
  }
  const removeHover = () => {
    element.classList.remove(name);
    element.classList.add(namerun);
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

window.onload = () => {
  document.querySelectorAll(".hover").forEach((h) => {
    hover(h);
  })
  document.querySelectorAll(".hover-r").forEach((h) => {
    hover(h, "hover-r");
  })
  document.querySelectorAll(".hover-f").forEach((h) => {
    hover(h, "hover-f");
  })
  document.querySelectorAll(".hover-l").forEach((h) => {
    hover(h, "hover-l");
  })
}

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


const validEmail = exp => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(exp);
const validName = exp => /^([a-zA-Zà-úÀ-Ú]{2,})+\s+([a-zA-Zà-úÀ-Ú\s]{2,})+$/.test(exp);
const validUName = exp => /^[a-zA-Z0-9\_\-\@]{6,16}$/.test(exp);
const validPass = exp => /^([A-Za-z0-9à-úÀ-Ú\@\_\.\-]{8,16})+$/.test(exp);
const validText = exp => /^([A-Za-z0-9à-úÀ-Ú\.\-\,\_\|\?\:\*\&\%\#\!\+\~\₹\'\"\`\@\s]{2,})+$/.test(exp); 


const b36to10 = b36 => parseInt(b36, 36);
const b10to36 = b10 => b10.toString(36);
const b64toString = b64 => btoa(b64);
const stringToB64 = b64 => atob(b64);


/* -------------------- formula ----------------------------------**
** const date = new Date();                                       **
** const pass = Sourav@121                                        **        
** let x = `%${b10t36(date)}${stringToB64(pass)}%${b10t36(date)}` **  
** console.log(x);                                                **  
** x = x.split(`%${b10t36(date)}`).join("");                      **          
** console.log(x);                                                **
** let y = b64toString(x);                                        **  
** console.log(y);                                                **      
**----------------------------------------------------------------**/
