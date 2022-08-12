import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-analytics.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.6.7/firebase-auth.js";
import { equalTo, get, set, getDatabase, orderByChild, query, ref, onValue, remove, update } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-database.js";


let user = undefined;
let historyLogs, members;

let myStatus = {
  uid: null,
  username: null,
  userType: "visitor"
}
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth();
const db = getDatabase();

auth.signOut()
onAuthStateChanged(auth, (usr) => {
  if (usr) {
    const uid = usr.uid;
    user = usr;
    console.log("user");
  } else {
    console.log("no user");
  }
});

try {
  try {
    const dtls = JSON.parse(getCookie("DREAMOVA-SUPPLIERS-STORAGE"));
    myStatus = dtls;
  } catch (error) {
    console.log(error);
  }

  onValue(ref(db, "datas"), (snapshot) => {
    if (snapshot.exists()) {
      const datas = snapshot.val();
      historyLogs = datas.historyLogs;

      allGroups.innerHTML = "";
      const groups = datas.groups
      for (const key in groups) {
        addGroup(groups[key]);
      }
    } else {
      console.log("No data available");
    }
  })

  onValue(ref(db, "members"), (snps) => {
    if (snps.exists()) {
      members = snps.val();
      memberSetup();
    } else {
      console.log("no member data");
    }
  })

  onValue(ref(db, `laseUpdate`), () => {
    get(ref(db, `datas/groups/${currentGroup}/items`)).then((sp) => {
      itemSetup(sp.val());
      setupFoundItems();
      setupAllItem();
    });
  })

} catch (err) {
  console.log(err);
}

// console.log(myStatus);

// alert ids 
const alertWindow = I("alert-window");
const addContentWindow = I("add-content-window");

const loginBtn = I("login-btn");
loginBtn.on(() => {
  location.replace("../html/user.html")
});


// header ids
const menuOpenBtn = I("open-menu");
const menuWindow = I("menu-window");
const allGroups = I("all-groups");
const editGroup = I("edit-group");
const addNewGroupBtn = I("add-new-group");
const header = I("header");
const searchBar = I("search-bar");
const searchInput = I("search-input");

// found list ids
const foundItems = I("found-items");
const findWindow = I("find-window");
const backFWindow = I("back-f-window");

// Menu lest ids
const openHome = I("open-home")
const openGroups = I("open-groups")
const openAllItem = I("open-all-item")
const openHistorys = I("open-historys")
const openMembers = I("open-members")
const logoutWindow = I("logout-window")

// all item show window 
const allItemWindow = I("all-item-window")
const allItemList = I("all-item-list")


// home ids
const homeWindow = I("home-window")

// Groups window ids
const groupSection = I("group-section");

// Items window ids
const insideGroupWindow = I("inside-group-window");
const itemGroupTitle = I("item-group-title");
const itemBackBtn = I("item-back-btn");
const addNewItem = I("add-new-item");
const editItem = I("edit-item");
const itemsSection = I("items-section");


// Member window ids
const memberWindow = I("member-window");
const addMember = I("add-member");
const allMembers = I("all-members");


// Histrys window ids
const historyWindow = I("history-window");
const preMonth = I("pre-month");
const postMonth = I("post-month");
const showMonth = I("show-month");
const showHistory = I("show-history");

let currentGroup;
let _d = new Date;
let dates = {
  year: _d.getFullYear(),
  month: _d.getMonth()
}
let css = {
  menuW: 150
}


//  resize windwo 
let winWidth = window.innerWidth;
let winHeight = window.innerHeight;
const root = document.querySelector(":root");
root.style.setProperty("--winWidth", `${winWidth}px`);
root.style.setProperty("--winHeight", `${winHeight}px`);

window.addEventListener("resize", (e) => {
  winWidth = window.innerWidth;
  winHeight = window.innerHeight;
  root.style.setProperty("--winWidth", `${winWidth}px`);
  root.style.setProperty("--winHeight", `${winHeight}px`);
});

// hide all active window 
function hideWindow() {
  const all = [findWindow, homeWindow, groupSection, insideGroupWindow, memberWindow, historyWindow, allItemWindow];
  menuWindow.classList.remove("active")
  all.forEach(a => {
    a.classList.remove("active");
  })
}

// push log array 
async function logPush(mod, type, name) {
  let nDate = new Date;
  let mm = nDate.getMonth() + 1;
  let nmm = mm > 9 ? mm : `0${mm}`;
  const dt = `${nDate.getFullYear()}-${nmm}`;

  get(ref(db, `datas/historyLogs/${dt}`)).then((sp) => {
    const len = sp.val() ? sp.val().length : 0;
    set(ref(db, `datas/historyLogs/${dt}/${len}`), {
      username: myStatus.username,
      time: getFormatTime(),
      mod: mod,
      type: type,
      name: name
    });
  })
}

const createAlertBox = (message, yesObj, noObj, fun) => {
  console.log(yesObj, noObj);
  alertWindow.innerHTML = "";
  alertWindow.classList.toggle("active", true);
  const artBox = createEle("div", "alert-box", alertWindow);
  const artTitle = createEle("div", "alert-title", artBox);
  const spn = createEle("span", null, artTitle, `<i class="sb-alert"></i> Alert`);
  const i = createEle("i", "sb-close", artTitle);
  const artMsg = createEle("div", "alert-message", artBox, message);
  const artBtns = createEle("div", "a-btns", artBox);
  const p2 = createEle("p", "alert-no", artBtns, `<i class="sb-${noObj.cn}"></i>${noObj.nm}`);
  const p1 = createEle("p", "alert-yes", artBtns, `<i class="sb-${yesObj.cn}"></i>${yesObj.nm}`);

  const close = () => alertWindow.classList.toggle("active", false);
  p1.addEventListener("click", () => { fun(close) });
  p2.addEventListener("click", close);
  i.addEventListener("click", close);
  return p1;
}

function createAddDoc(titel, placeholderName, fun, done = "add") {
  addContentWindow.innerHTML = "";

  const abt = createEle("div", "add-box-tab", addContentWindow);
  const cgt = createEle("div", "create-group-title", abt);
  createEle("p", null, cgt, titel);
  const close = createEle("i", "sb-close", cgt);
  const span = createEle("span", null, abt);
  const inp = createEle("input", "name-input-group", span);
  inp.setAttribute("type", "text");
  inp.setAttribute("placeholder", placeholderName);
  const inline = createEle("div", "inline", abt);
  const add = createEle("div", "group-add-btn", inline, done);
  const cancle = createEle("div", "inline", inline, "cancle");

  const closeWin = () => addContentWindow.classList.toggle("active", false);
  close.addEventListener("click", closeWin);
  cancle.addEventListener("click", closeWin);

  add.addEventListener("click", () => {
    if (inp.value.length < 1) return;
    fun(inp, closeWin);
  })
}

let searchValue = "";
// search event
searchInput.on("input", (e) => {
  searchValue = e.target.value.toLowerCase();
  const isBig = searchValue.length > 0;
  findWindow.classList.toggle("active", isBig)
  setupFoundItems();
});

// items append found window
function setupFoundItems() {
  foundItems.innerHTML = "";
  get(ref(db, `datas/groups`)).then((snapshot) => {
    if (snapshot.exists()) {
      const groups = snapshot.val();
      for (const key in groups) {
        const itms = groups[key].items;
        for (const k in itms) {
          itms[k].name.toLowerCase().includes(searchValue) && setItem(itms[k], foundItems);
        }
      }
    }
  })
}

backFWindow.on(() => {
  findWindow.classList.remove("active");
})

// header events 
searchInput.on(() => {
  header.classList.add("active");
})

searchInput.on("focusout", () => {
  searchInput.value = "";
  header.classList.remove("active");
})

/* -------- menu event -------- */
openHome.on(() => {
  hideWindow();
  homeWindow.classList.add("active")
})

I("close-menuz").on(() => {
  menuWindow.classList.remove("active")
})

menuOpenBtn.on(() => {
  menuWindow.classList.add("active")
})

openGroups.on(() => {
  hideWindow();
  tuggle(groupSection);
})

openAllItem.on(() => {
  hideWindow();
  setupAllItem();
  tuggle(allItemWindow);
})

openHistorys.on(() => {
  hideWindow();
  setupHistory();
  tuggle(historyWindow);
})

openMembers.on(() => {
  hideWindow();
  memberSetup();
  tuggle(memberWindow);
})

function memberSetup() {
  allMembers.innerHTML = "";
  for (const key in members) {
    setMember(members[key]);
  }
}

function itemSetup(items) {
  itemsSection.innerHTML = "";
  for (const key in items) {
    setItem(items[key]);
  }
}

function setupAllItem() {
  allItemList.innerHTML = "";
  get(ref(db, `datas/groups`)).then((snapshot) => {
    if (snapshot.exists()) {
      let allItems = [];
      const groups = snapshot.val();
      for (const key in groups) {
        const items = groups[key].items;
        for (const k in items) {
          allItems.push(items[k]);
        }
      }

      // sort a-z
      allItems.sort((a, b) => {
        if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
        if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
        return 0;
      });
      allItems.forEach((e) => {
        setItem(e, allItemList);
      })
    }
  });
}



// groups events
function addGroup(data) {
  const len = data.items ? Object.keys(data.items).length : 0;

  const grp = createEle("div", "group", allGroups);

  const ctn = createEle("div", "content", grp);
  const gName = createEle("div", "group-name", ctn, `<i class="sb-drawer"></i> ${data.name}`);
  const itm = createEle("div", "items", ctn, `<i class="sb-tags"></i> Items ${len}`);

  const edcnt = createEle("div", "editable-content", grp);
  const dlt = createEle("div", "group-delete-btn", edcnt, `<i class="sb-trash-1"></i> DELETE`);
  const grin = createEle("div", "group-input", edcnt);
  const inp = createEle("input", null, grin);
  inp.setAttribute("spellcheck", false);
  inp.setAttribute("type", "text");
  inp.value = data.name;
  inp.setAttribute("placeholder", "Group Name");
  const upd = createEle("div", "group-update", edcnt, `<i class="sb-back-to-top"></i> RENAME`);

  inp.addEventListener("click", () => {
    inp.select();
  })

  upd.addEventListener("click", () => {
    if (inp.value == data.name || inp.value.length < 1) return;
    createAlertBox(`Do you want to modify "${data.name}" group to "${inp.value}"?`, { cn: "true", nm: "YES" }, { cn: "close", nm: "NO" }, (fun) => {
      const gName = data.name.split(" ").join("-");
      const newGname = inp.value.split(" ").join("-");

      get(ref(db, `datas/groups/${gName}`)).then((sp) => {
        if (sp.exists()) {


          let obj = {
            id: sp.val().id,
            items: sp.val().items || [],
            name: inp.value
          }
          console.log(obj);
          set(ref(db, `datas/groups/${newGname}`), obj).then(() => {
            remove(ref(db, `datas/groups/${gName}`)).then(() => {
              tuggle(allGroups, "edit");
              logPush("modify", "group", `${data.name} to ${inp.value}`).then(() => {
                fun();
                set(ref(db, `laseUpdate/`), { status: `name: ${myStatus.username}, date: ${(new Date())}` })
                alertWindow.classList.toggle("active", false);
              })
            })
          })
        }
      })
    });
  })


  dlt.addEventListener("click", () => {
    createAlertBox(`Do you want to delete "${data.name}" group?`, { cn: "true", nm: "YES" }, { cn: "close", nm: "NO" }, (fun) => {
      tuggle(allGroups, "edit");

      const gName = data.name.split(" ").join("-");
      remove(ref(db, `datas/groups/${gName}`)).then(() => {
        alertWindow.classList.toggle("active", false);
      })
      logPush("delete", `group`, data.name).then(() => {
        set(ref(db, `laseUpdate/`), { status: `name: ${myStatus.username}, date: ${(new Date())}` })
        fun();
      });
    });
  })

  ctn.addEventListener("click", () => {
    itemsSection.innerHTML = "";
    currentGroup = data.name.split(" ").join("-");
    get(ref(db, `datas/groups/${currentGroup}`)).then((snapshot) => {
      if (snapshot.exists()) {
        itemSetup(snapshot.val().items);
      }
    })

    itemGroupTitle.innerHTML = `<i class="sb-drawer"></i> ${data.name}`;
    tuggle(insideGroupWindow);
  })
}

function setItem(item, parent = itemsSection) {
  const itm = createEle("div", "item", parent);
  const aclCnt = createEle("div", "actiol-item", itm);
  const incnt = createEle("div", "in-content", aclCnt)
  createEle("div", "item-name", incnt, `<i class="sb-tag"></i> ${item.name}`);
  const itmQnt = createEle("div", "item-quantity", incnt, `Quantity: <x class="qun-num" >${item.quantity}</x>`);
  const spn = createEle("span", null, aclCnt);

  const qunInp = createEle("div", "quantity-input-fild", spn);
  const mins = createEle("div", "mins-1", qunInp, `<i></i>`);
  const _input_ = createEle("div", "_input_", qunInp);
  const it = createEle("input", null, _input_);
  it.setAttribute("spellcheck", false);
  it.setAttribute("type", "number");
  it.setAttribute("value", "0");
  const pls = createEle("div", "plus-1", qunInp, `<i></i>`);

  const itmUpdBtn = createEle("div", "item-update-btn", spn);
  const itmOut = createEle("div", "item-out", itmUpdBtn, `<p><i class="sb-box-remove"></i> OUT</p>`);
  const itmIn = createEle("div", "item-in", itmUpdBtn, `<p><i class="sb-box-add"></i> IN</p>`);

  if (parent == itemsSection) {
    const edtItm = createEle("div", "editable-items", itm);
    const dlt = createEle("div", "item-delete-btn", edtItm, `<i class="sb-trash-1"></i> DELETE`);
    const _inp = createEle("div", "item-input", edtItm);
    const iInp = createEle("input", null, _inp);
    iInp.setAttribute("spellcheck", false);
    iInp.setAttribute("type", "text");
    iInp.setAttribute("value", item.name);
    iInp.setAttribute("placeholder", `Item Name`);
    const updt = createEle("div", "item-update", edtItm, `<i class="sb-back-to-top"></i> RENAME`);

    updt.addEventListener("click", () => {
      if (iInp.value == item.name || iInp.value.length < 1) return;
      createAlertBox(`Do you want to modify "${item.name}" item name to "${iInp.value}"?`, { cn: "true", nm: "YES" }, { cn: "close", nm: "NO" }, (fun) => {
        const iName = item.name.split(" ").join("-");
        const newIname = iInp.value.split(" ").join("-");

        get(ref(db, `datas/groups/${currentGroup}/items/${iName}`)).then((sp) => {
          if (sp.exists()) {
            let obj = {
              id: sp.val().id,
              name: iInp.value,
              quantity: sp.val().quantity
            }
            set(ref(db, `datas/groups/${currentGroup}/items/${newIname}`), obj).then(() => {
              remove(ref(db, `datas/groups/${currentGroup}/items/${iName}`)).then(() => {
                logPush("modify", `item`, `${item.name} to ${iInp.value}`).then(() => {
                  set(ref(db, `laseUpdate/`), { status: `name: ${myStatus.username}, date: ${(new Date())}` })
                  tuggle(itemsSection);
                  fun();
                })
              })
            })
          }
        })
      });
    })

    dlt.addEventListener("click", () => {
      createAlertBox(`Do you want to delete "${item.name}" item?`, { cn: "true", nm: "YES" }, { cn: "close", nm: "NO" }, (fun) => {
        const iName = item.name.split(" ").join("-");

        remove(ref(db, `datas/groups/${currentGroup}/items/${iName}`)).then(() => {
          logPush("delete", "item", item.name).then(() => {
            set(ref(db, `laseUpdate/`), { status: `name: ${myStatus.username}, date: ${(new Date())}` })
            tuggle(itemsSection);
            fun();
          });
        })
      });
    })
  }

  // when hold the plus button then incrige max quentity
  let mouseTimer;
  function mouseDown() {
    mouseUp();
    mouseTimer = window.setTimeout(execMouseDown, 500);
  }
  function mouseUp() {
    if (mouseTimer) window.clearTimeout(mouseTimer);
  }
  function execMouseDown() {
    if (item.quantity)
      it.value = Number(item.quantity - 1);
  }
  pls.addEventListener("mousedown", mouseDown);
  document.body.addEventListener("mouseup", mouseUp);
  pls.addEventListener("touchstart", mouseDown);
  document.body.addEventListener("touchend", mouseUp);


  it.addEventListener("input", () => {
    let intV = Number(it.value);
    it.value = intV;
    if (intV >= 100000) {
      it.value = 100000;
    } else if (intV <= 0) {
      it.value = 0;
    }
  });
  pls.addEventListener("click", () => {
    let intV = Number(it.value);
    if (intV < 100000) {
      it.value = ++intV;
    }
  });
  mins.addEventListener("click", () => {
    let intV = Number(it.value);
    if (intV > 0) {
      it.value = --intV;
    }
  });

  itmIn.addEventListener("click", () => updateQuentity(1));
  itmOut.addEventListener("click", () => updateQuentity(-1));

  function updateQuentity(delta) {
    let intV = Number(it.value);
    if (intV >= 1) {
      const iName = item.name.split(" ").join("-");

      getGroupNameUsingChild(iName, (gName) => {
        get(ref(db, `datas/groups/${gName}/items/${iName}`)).then((snp) => {
          if (snp.exists()) {
            const oldVal = Number(snp.val().quantity);
            const newVal = oldVal + intV * delta;
            update(ref(db, `datas/groups/${gName}/items/${iName}/`), {
              quantity
                : newVal
            }).then(() => {
              set(ref(db, `laseUpdate/`), { status: `name: ${myStatus.username}, date: ${(new Date())}` })
              logPush("update", `item`, `${snp.val().name} quantity <x class="c-feb">${oldVal}</x> to <x class="c-feb">${newVal}</x>`);
            })
          }
        })
      })
    }
  }

  // take input item name and return parent name
  function getGroupNameUsingChild(itemName, fun) {
    get(ref(db, `datas/groups`)).then((sp) => {
      const val = sp.val();
      for (const key in val) {
        const itms = val[key].items;
        for (const k in itms) {
          if (itms[k].name == itemName) {
            fun(val[key].name);
            return;
          }
        }
      }
    })
  }
}

itemBackBtn.on(() => {
  allGroups.innerHTML = "";
  get(ref(db, `datas/groups`)).then((snapshot) => {
    if (snapshot.exists()) {
      const groups = snapshot.val();
      for (const k in groups) {
        addGroup(groups[k]);
      }
      tuggle(insideGroupWindow);
    }
  });
});

editItem.on(() => {
  tuggle(itemsSection);
});

addNewItem.on(() => {
  addContentWindow.classList.toggle("active", true);
  createAddDoc("Create New Item", "Item Name", (e, fun) => {

    const q = query(ref(db, `datas/groups/${currentGroup}`), orderByChild("name"), equalTo(e.value));
    get(q).then((sp) => {
      if (!sp.exists()) {
        const v = (e.value).split(" ").join("-");
        set(ref(db, `datas/groups/${currentGroup}/items/${v}`), {
          name: e.value,
          id: Date.now(),
          quantity: 0
        }).then(() => {
          logPush("create", "item", e.value).then(() => {
            set(ref(db, `laseUpdate/`), { status: `name: ${myStatus.username}, date: ${(new Date())}` })
            fun();
          })
        })
      }
    })
  });
});

editGroup.on(() => {
  tuggle(allGroups, "edit");
});

addNewGroupBtn.on(() => {
  addContentWindow.classList.toggle("active", true);
  createAddDoc("Create New Group", "Group Name", (e, fun) => {
    const q = query(ref(db, "datas/groups"), orderByChild("name"), equalTo(e.value));
    get(q).then((sp) => {
      if (!sp.exists()) {
        set(ref(db, `datas/groups/${(e.value).split(" ").join("-")}`), {
          name: e.value,
          id: Date.now(),
          items: []
        })
        logPush("create", "group", e.value);
        fun();
      }
    })
  })

});

/* --------- members ----------- */
addMember.on(() => {
  addContentWindow.classList.toggle("active", true);
  createAddDoc("Create New Member", "Enter Name", (e, fun) => {
    const val = e.value.toLowerCase();

    if (val.length <= 5) {
      e.setAttribute("placeholder", "Min 6 letter required!!!");
      e.value = "";
    } else if (!checkExp(val)) {
      e.setAttribute("placeholder", "Format error (i-am_me@ ✔)");
      e.value = "";
    } else {

      const q = query(ref(db, `members`), orderByChild("username"), equalTo(val));
      get(q).then(function (snapshot) {
        if (!snapshot.exists()) {


          // when no user this name then create use
          const key = (Date.now() * (Math.floor(Math.random() * 999))).toString(36).toUpperCase();
          set(ref(db, `members/${val}`), { username: val, uid: Date.now(), key: key })
            .then(() => {
              logPush("modify", "member", "").then(() => {
                fun();// close add user window
                set(ref(db, `laseUpdate/`), { status: `name: ${myStatus.username}, date: ${(new Date())}` })
              });
            }).catch((error) => {
              console.log(error);
            });

        } else {
          e.setAttribute("placeholder", `${val} olready exist!!!`);
          e.value = "";
        }
      });
    }
  })
})

function checkExp(exp) {
  return /^[a-z0-9_\-\@]{3,16}$/.test(exp);
}



function setMember(mem) {
  const mbr = createEle("div", "member", allMembers);
  createEle("div", "m-username", mbr, `<i class="sb-user"></i> <x><p>${mem.username}</p></x>`);
  createEle("div", "m-password", mbr, `<i class="sb-key"></i> <x><p>${mem.key}</p></x>`);
  const usrE = createEle("div", "m-eidt", mbr, `<i class="sb-pen"></i>`);
  const dlt = createEle("div", "m-delete", mbr, `<i class="sb-user-minus"></i>`);

  usrE.addEventListener("click", () => {
    addContentWindow.classList.toggle("active", true);
    createAddDoc("Update Member Name", "Enter New Name", (e, fun) => {
      const val = e.value;

      if (val.length <= 5) {
        e.setAttribute("placeholder", "Min 6 letter required!!!");
        e.value = "";
      } else if (!checkExp(val)) {
        e.setAttribute("placeholder", "Format error (i-am_me@ ✔)");
        e.value = "";
      } else {
        get(ref(db, `members/${mem.username}`)).then((snp) => {
          const member = snp.val();
          if (snp.exists()) {
            const q = query(ref(db, `members`), orderByChild("username"), equalTo(val));
            get(q).then(function (snapshot) {
              if (!snapshot.exists()) {
                set(ref(db, `members/${val}`), {
                  uid: member.uid,
                  key: member.key,
                  username: val
                }).then(() => {
                })
                remove(ref(db, `members/${member.username}`)).then(() => {
                  logPush("modify", "member", "");
                  fun();
                })
              }
            })
          }
        })
      }
    }, "rename");
  });

  dlt.addEventListener("click", () => {
    createAlertBox(`Do you want to delete "${mem.username}" account?`, { cn: "true", nm: "YES" }, { cn: "close", nm: "NO" }, (fun) => {
      remove(ref(db, `members/${mem.username}`)).then(() => {
        logPush("modify", "member", "").then(() => {
          set(ref(db, `laseUpdate/`), { status: `name: ${myStatus.username}, date: ${(new Date())}` })
          fun();
        });
      })
    });
  })
}

/* -------- Setup History --------- */

preMonth.on(() => {
  let yy = dates.year;
  let next = dates.month;
  if (next < 0) {
    --yy;
    next = 11;
  }
  let nm = next > 9 ? next : `0${next}`;
  let dt = `${yy}-${nm}`;
  if (historyLogs[dt]) {
    dates.year = yy;
    dates.month = next - 1;
    setupHistory();
  }
})
postMonth.on(() => {
  let yy = dates.year;
  let next = dates.month + 2;
  if (next > 11) {
    ++yy;
    next = 0;
  }
  let nm = next > 9 ? next : `0${next}`;
  let dt = `${yy}-${nm}`;
  if (historyLogs[dt]) {
    dates.year = yy;
    dates.month = next - 1;
    setupHistory();
  }
})
function setupHistory() {
  showHistory.innerHTML = "";
  let mm = dates.month + 1;
  let nmm = mm > 9 ? mm : `0${mm}`;
  let dt = `${dates.year}-${nmm}`;
  showMonth.innerText = dt;

  try {
    for (let i = historyLogs[dt].length - 1; i >= 0; i--) {
      hLog(historyLogs[dt][i]);
    }
  } catch (e) {
    console.log("History is empty! ");
  }
}

function hLog(l) {
  let unm = l.username === myStatus.username ? "you" : l.username;
  let mColor = unm === "you" ? "c-green" : "c-white";
  let isDC = l.mod === "delete" ? "c-red" : "c-white";
  let isx = l.type === "group" ? "c-cor1" : l.type === "item" ? "c-cor2" : mColor;
  const hL = createEle("div", "h-log", showHistory);
  const spn = createEle("span", "h-span", hL);
  createEle("div", "c-white", spn, l.time);
  createEle("div", mColor, spn, unm);
  createEle("div", isDC, spn, l.mod);
  createEle("div", isx, spn, l.type);
  createEle("div", "c-white", spn, l.name);
}
