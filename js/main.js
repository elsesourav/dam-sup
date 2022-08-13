import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-analytics.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-app.js";
import {
  getAuth, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.6.7/firebase-auth.js";
import { equalTo, get, getDatabase, onValue, orderByChild, query, ref, remove, set, update } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-database.js";

let myStatus = {
  username: null,
  userType: "visitor"
}

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth();
const db = getDatabase();

try {
  onAuthStateChanged(auth, (usr) => {
    if (usr) {
      const dtls = JSON.parse(getCookie("DREAMOVA-SUPPLIERS-STORAGE"));
      myStatus = dtls;
      console.log(myStatus);
    } else {
      console.log("no user");
    }
  });

  onValue(ref(db, "datas"), (snapshot) => {
    if (snapshot.exists()) {
      const datas = snapshot.val();
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
    memberSetup();
  })

  onValue(ref(db, `laseUpdate`), async () => {
    const sp = await get(ref(db, `datas/groups/${currentGroup}/items`))
    itemSetup(sp.val());
    setupFoundItems();
    setupAllItem();
  })

} catch (err) {
  console.log(err);
}

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

  const sp = await get(ref(db, `datas/historyLogs/${dt}`));
  const len = sp.val() ? sp.val().length : 0;

  set(ref(db, `datas/historyLogs/${dt}/${len}`), {
    username: myStatus.username,
    time: getFormatTime(),
    mod: mod,
    type: type,
    name: name
  });
}

const createAlertBox = (message, yesObj, noObj, fun) => {
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
  p1.on(() => { fun(close) });
  p2.on(close);
  i.on(close);
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
  close.on(closeWin);
  cancle.on(closeWin);

  add.on(() => {
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
async function setupFoundItems() {
  foundItems.innerHTML = "";
  const snapshot = await get(ref(db, `datas/groups`));
  if (snapshot.exists()) {
    const groups = snapshot.val();
    for (const key in groups) {
      const itms = groups[key].items;
      for (const k in itms) {
        itms[k].name.toLowerCase().includes(searchValue) && setItem(itms[k], foundItems);
      }
    }
  }
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

async function memberSetup() {
  const members = (await get(ref(db, `members`))).val();
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

async function setupAllItem() {
  allItemList.innerHTML = "";
  try {
    const snapshot = await get(ref(db, `datas/groups`))
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
  } catch (error) {
    console.log(error);
  }
}



// groups events
function addGroup(data) {
  const len = data.items ? Object.keys(data.items).length : 0;

  const grp = createEle("div", "group", allGroups);

  const ctn = createEle("div", "content", grp);
  createEle("div", "group-name", ctn, `<i class="sb-drawer"></i> ${data.name}`);
  createEle("div", "items", ctn, `<i class="sb-tags"></i> Items ${len}`);

  const edcnt = createEle("div", "editable-content", grp);
  const dlt = createEle("div", "group-delete-btn", edcnt, `<i class="sb-trash-1"></i> DELETE`);
  const grin = createEle("div", "group-input", edcnt);
  const inp = createEle("input", null, grin);
  inp.setAttribute("spellcheck", false);
  inp.setAttribute("type", "text");
  inp.value = data.name;
  inp.setAttribute("placeholder", "Group Name");
  const upd = createEle("div", "group-update", edcnt, `<i class="sb-back-to-top"></i> RENAME`);

  inp.on(() => {
    inp.select();
  })

  // when past name or new name not match
  inp.addEventListener("input", inputEvent);
  inp.on(inputEvent);

  function inputEvent() {
    if (data.name != inp.value && inp.value.length > 1 && validText(inp.value)) {
      upd.classList.add("active");
    } else {
      upd.classList.remove("active");
    }
  }

  upd.on(() => {
    if (inp.value == data.name || !validText(inp.value)) return;
    createAlertBox(`Do you want to modify "${data.name}" group to "${inp.value}"?`,
      { cn: "true", nm: "YES" },
      { cn: "close", nm: "NO" },
      async (fun) => {
        const gName = data.name.split(" ").join("-");
        const newGname = inp.value.split(" ").join("-");

        try {
          const sp = await get(ref(db, `datas/groups/${gName}`));
          tuggle(allGroups, "edit");
          let obj = {
            id: sp.val().id,
            items: sp.val().items || [],
            name: inp.value
          }
          remove(ref(db, `datas/groups/${gName}`));
          await set(ref(db, `datas/groups/${newGname}`), obj)
          await logPush("modify", "group", `${data.name} to ${inp.value}`);
          await set(ref(db, `laseUpdate/`), { status: `name: ${myStatus.username}, date: ${(new Date())}` })
          fun();
          alertWindow.classList.toggle("active", false);

        } catch (error) {
          console.log(error);
        }
      });
  })


  dlt.on(() => {
    createAlertBox(`Do you want to delete "${data.name}" group?`,
      { cn: "true", nm: "YES" },
      { cn: "close", nm: "NO" },
      async (fun) => {
        tuggle(allGroups, "edit");
        const gName = data.name.split(" ").join("-");
        try {
          await remove(ref(db, `datas/groups/${gName}`))
          alertWindow.classList.toggle("active", false);
          await logPush("delete", `group`, data.name)
          await set(ref(db, `laseUpdate/`), { status: `name: ${myStatus.username}, date: ${(new Date())}` })
          fun();
        } catch (error) {
          console.log(error);
        }
      });

  })

  ctn.on(async () => {
    itemsSection.innerHTML = "";
    currentGroup = data.name.split(" ").join("-");
    try {
      const snapshot = await get(ref(db, `datas/groups/${currentGroup}`))
      if (snapshot.exists()) {
        itemSetup(snapshot.val().items);
      }
      itemGroupTitle.innerHTML = `<i class="sb-drawer"></i> ${data.name}`;
      tuggle(insideGroupWindow);
    } catch (error) {
      console.log(error);
    }
  })
}

function setItem(item, parent = itemsSection) {
  const itm = createEle("div", "item", parent);
  const aclCnt = createEle("div", "actiol-item", itm);
  const incnt = createEle("div", "in-content", aclCnt)
  createEle("div", "item-name", incnt, `<i class="sb-tag"></i> ${item.name}`);
  createEle("div", "item-quantity", incnt, `Quantity: <x class="qun-num" >${item.quantity}</x>`);
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


    // when past name or new name not match
    iInp.addEventListener("input", inputEvent);
    iInp.on(inputEvent);

    function inputEvent() {
      if (item.name != iInp.value && iInp.value.length > 1 && validText(iInp.value)) {
        updt.classList.add("active");
      } else {
        updt.classList.remove("active");
      }
    }

    updt.on(() => {
      if (iInp.value == item.name || !validText(iInp.value)) return;
      createAlertBox(
        `Do you want to modify "${item.name}" item name to "${iInp.value}"?`,
        { cn: "true", nm: "YES" },
        { cn: "close", nm: "NO" },
        async (fun) => {
          const iName = item.name.split(" ").join("-");
          const newIname = iInp.value.split(" ").join("-");

          try {
            const sp = await get(ref(db, `datas/groups/${currentGroup}/items/${iName}`));

            let obj = {
              id: sp.val().id,
              name: iInp.value,
              quantity: sp.val().quantity
            }
            remove(ref(db, `datas/groups/${currentGroup}/items/${iName}`));
            await set(ref(db, `datas/groups/${currentGroup}/items/${newIname}`), obj)
            await logPush("modify", `item`, `${item.name} to ${iInp.value}`);
            await set(ref(db, `laseUpdate/`), { status: `name: ${myStatus.username}, date: ${(new Date())}` })
            tuggle(itemsSection);
            fun();
          } catch (error) {
            console.log(error);
          }
        });
    })

    dlt.on(() => {
      createAlertBox(`Do you want to delete "${item.name}" item?`,
        { cn: "true", nm: "YES" },
        { cn: "close", nm: "NO" },
        async (fun) => {
          try {
            const iName = item.name.split(" ").join("-");

            remove(ref(db, `datas/groups/${currentGroup}/items/${iName}`))
            await logPush("delete", "item", item.name)
            await set(ref(db, `laseUpdate/`), { status: `name: ${myStatus.username}, date: ${(new Date())}` })
            tuggle(itemsSection);
            fun();
          } catch (error) {
            console.log(error);
          }
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
  pls.on(() => {
    let intV = Number(it.value);
    if (intV < 100000) {
      it.value = ++intV;
    }
  });
  mins.on(() => {
    let intV = Number(it.value);
    if (intV > 0) {
      it.value = --intV;
    }
  });

  itmIn.on(() => updateQuentity(1));
  itmOut.on(() => updateQuentity(-1));

  function updateQuentity(delta) {
    let intV = Number(it.value);
    if (intV >= 1) {
      const iName = item.name.split(" ").join("-");

      getGroupNameUsingChild(iName,
        async (gName) => {
          try {
            const snp = await get(ref(db, `datas/groups/${gName}/items/${iName}`))
            if (snp.exists()) {
              const oldVal = Number(snp.val().quantity);
              const newVal = oldVal + intV * delta;
              const dbRef = ref(db, `datas/groups/${gName}/items/${iName}/`);

              await update(dbRef, { quantity: newVal });
              await set(ref(db, `laseUpdate/`), { status: `name: ${myStatus.username}, date: ${(new Date())}` })
              await logPush("update", `item`, `${snp.val().name} quantity <x class="c-feb">${oldVal}</x> to <x class="c-feb">${newVal}</x>`);
            }
          } catch (error) {
            console.log(error);
          }
        })
    }
  }

  // take input item name and return parent name
  async function getGroupNameUsingChild(itemName, fun) {
    try {
      const sp = await get(ref(db, `datas/groups`))
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
    } catch (error) {
      console.log(error);
    }
  }
}

itemBackBtn.on(async () => {
  allGroups.innerHTML = "";
  try {
    const snapshot = await get(ref(db, `datas/groups`));
    const groups = snapshot.val();

    for (const k in groups) {
      addGroup(groups[k]);
    }
    tuggle(insideGroupWindow);
  } catch (error) {
    console.log(error);
  }
});

editItem.on(() => {
  tuggle(itemsSection);
});

addNewItem.on(() => {
  addContentWindow.classList.toggle("active", true);
  createAddDoc("Create New Item", "Item Name", async (e, fun) => {
    try {
      const val = e.value;
      const dbRef = ref(db, `datas/groups/${currentGroup}`);

      const sp = await get(query(dbRef, orderByChild("name"), equalTo(val)));
      if (!sp.exists()) {
        const itmNm = (val).split(" ").join("-");
        const obj = {
          name: val,
          id: Date.now(),
          quantity: 0
        }
        await set(ref(db, `datas/groups/${currentGroup}/items/${itmNm}`), obj)
        await logPush("create", "item", val)
        set(ref(db, `laseUpdate/`), { status: `name: ${myStatus.username}, date: ${(new Date())}` })
        fun();
      }
    } catch (error) {
      console.log(error);
    }
  });
});

editGroup.on(() => {
  tuggle(allGroups, "edit");
});

addNewGroupBtn.on(() => {
  addContentWindow.classList.toggle("active", true);
  createAddDoc("Create New Group", "Group Name", async (e, fun) => {
    try {
      const q = query(ref(db, "datas/groups"), orderByChild("name"), equalTo(e.value));
      const sp = await get(q);

      if (!sp.exists()) {
        await set(ref(db, `datas/groups/${(e.value).split(" ").join("-")}`), {
          name: e.value,
          id: Date.now(),
          items: []
        })
        await logPush("create", "group", e.value);
        fun();
      }
    } catch (error) {
      console.log(error);
    }
  });
});

/* --------- members ----------- */
addMember.on(() => {
  addContentWindow.classList.toggle("active", true);
  createAddDoc("Create New Member", "Enter Name", async (e, fun) => {
    const val = e.value.toLowerCase();

    if (val.length <= 5) {
      e.setAttribute("placeholder", "Min 6 letter required!!!");
      e.value = "";
    } else if (!validUName(val)) {
      e.setAttribute("placeholder", "Format error (i-am_me@ ✔)");
      e.value = "";
    } else {
      try {
        const q = query(ref(db, `members`), orderByChild("username"), equalTo(val));
        const snapshot = await get(q)

        // when no user this name then create use
        if (!snapshot.exists()) {
          const key = (Date.now() * (Math.floor(Math.random() * 999))).toString(36).toUpperCase();
          await set(ref(db, `members/${val}`), { username: val, key: key })
          await logPush("modify", "member", "");
          fun();// close add user window
          set(ref(db, `laseUpdate/`), { status: `name: ${myStatus.username}, date: ${(new Date())}` })
        } else {
          e.setAttribute("placeholder", `${val} olready exist!!!`);
          e.value = "";
        }
      } catch (error) {
        console.log(error);
      }
    }
  })
})



function setMember(mem) {
  const mbr = createEle("div", "member", allMembers);
  createEle("div", "m-username", mbr, `<i class="sb-user"></i> <x><p>${mem.username}</p></x>`);
  createEle("div", "m-password", mbr, `<i class="sb-key"></i> <x><p>${mem.key}</p></x>`);
  const usrE = createEle("div", "m-eidt", mbr, `<i class="sb-pen"></i>`);
  const dlt = createEle("div", "m-delete", mbr, `<i class="sb-user-minus"></i>`);

  usrE.on(() => {
    addContentWindow.classList.toggle("active", true);
    createAddDoc("Update Member Name", "Enter New Name", async (e, fun) => {
      const val = e.value.toLowerCase();

      if (val.length <= 5) {
        e.setAttribute("placeholder", "Min 6 letter required!!!");
        e.value = "";
      } else if (!validUName(val)) {
        e.setAttribute("placeholder", "Format error (i-am_me@ ✔)");
        e.value = "";
      } else {
        try {
          const snp = await get(ref(db, `members/${mem.username}`))
          const s = snp.val();

          if (snp.exists()) {
            const q = query(ref(db, `members`), orderByChild("username"), equalTo(val));

            const snapshot = await get(q);
            if (!snapshot.exists()) {
              remove(ref(db, `members/${s.username}`))
              const obj = {
                uid: s.uid || null,
                email: s.email || null,
                username: val,
                key: s.key,
                date: s.date || null,
                type: s.type || null,
                password: s.password || null
              }
              await set(ref(db, `members/${val}`), obj);
              await logPush("modify", "member", "");
              await set(ref(db, `laseUpdate/`), { status: `name: ${myStatus.username}, date: ${(new Date())}` })
              fun();
            }
          }
        } catch (error) {
          console.log(error);
        }
      }
    }, "rename");
  });

  dlt.on(() => {
    createAlertBox(`Do you want to delete "${mem.username}" account?`,
      { cn: "true", nm: "YES" },
      { cn: "close", nm: "NO" },
      async (fun) => {
        try {
          await remove(ref(db, `members/${mem.username}`));
          await logPush("modify", "member", "");
          await set(ref(db, `laseUpdate/`), { status: `name: ${myStatus.username}, date: ${(new Date())}` })
          fun();
        } catch (error) {
          console.log(error);
        }
      });
  })
}

/* -------- Setup History --------- */
preMonth.on(() => { dateSetup(-1) })
postMonth.on(() => { dateSetup(1) })

// history date setup (+++, ---)
function dateSetup(del) {
  const d = new Date();
  if (d.getFullYear() <= dates.year && d.getMonth() < dates.month + del) return;

  if (dates.month + del > 11) {
    dates.month = 0;
    ++dates.year;
  } else if (dates.month + del < 0) {
    dates.month = 11;
    --dates.year;
  } else {
    dates.month += del;
  }
  setupHistory();
}

async function setupHistory() {
  showHistory.innerHTML = "";
  const mm = dates.month + 1;
  const nmm = mm > 9 ? mm : `0${mm}`;
  const dt = `${dates.year}-${nmm}`;
  showMonth.innerText = dt;
  try {
    const data = await get(ref(db, `datas/historyLogs`));
    const logs = data.val()[dt];
    logs.forEach(log => { hLog(log) });
  } catch (e) {
    console.log(e);
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
