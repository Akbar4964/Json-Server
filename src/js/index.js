const BASE_URL = "http://localhost:5000";

const elData = document.querySelector(".data");

const elSearch = document.querySelector(".side-search");

const elTemplate = document.querySelector(".template").content;

const elTemplate1 = document.querySelector(".template1").content;

const elTemplate2 = document.querySelector(".template2").content;

const elLoading = document.querySelector(".loading");

const elLoadingAll = document.querySelector(".loading-all");

const elLoadingEdit = document.querySelector(".loading-edit");

const elSideSearch = document.querySelector(".side-search");

const elForm = document.querySelector(".form");

const elGameInput = document.querySelector(".game-input");

const openModalBtn = document.getElementById("openModalBtn");

const modal = document.getElementById("myModal");

const modals = document.getElementById("myModals");

const closeBtn = document.getElementsByClassName("close")[0];

const elModal = document.querySelector(".modalForm");

const elTypeBtn = document.querySelector(".type-btn");

const elButtonList = document.querySelector(".button-list");

const elRowList = document.querySelector(".row-button-list");

const elAllMixTypes = document.querySelector(".all");

const elAcceptButton = document.querySelector(".accept");

const elRejectButton = document.querySelector(".reject");

let elSaveNumber = document.querySelector(".save-number");

const elModalInput1 = document.querySelector(".modal-input1");
const elModalInput2 = document.querySelector(".modal-input2");
const elModalInput3 = document.querySelector(".modal-input3");
const elModalInput4 = document.querySelector(".modal-input4");
const elModalInput5 = document.querySelector(".modal-input5");
const elModalInput6 = document.querySelector(".modal-input-description");
const elModalInput7 = document.querySelector(".modal-input6");
const elModalInput8 = document.querySelector(".modal-input7");

let list = [];

let saveItem = 0;

let activePage = 1;
let editDataId = null;

const saveNumber = (number = 0) => {
  elSaveNumber.textContent = number;
};

const getPosts = async (page = 1) => {
  document.body.classList.add("body-hidden");
  elLoading.classList.remove("hidden");
  elSideSearch.classList.add("hidden");
  elData.classList.add("hidden");
  await fetch(BASE_URL + `/posts?_page=${page}&_limit=6`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      activePage = page;
      const count = Math.ceil(res.headers.get("X-Total-Count") / 6);
      paginateCount(count);
      return res.json();
    })
    .then((res) => {
      list = [...res];
      renderPosts();
    })
    .catch((error) => console.log(error));
  elLoading.classList.add("hidden");
  elSideSearch.classList.remove("hidden");
  elData.classList.remove("hidden");
  document.body.classList.remove("body-hidden");
};
getPosts();

const getSaves = async () => {
  await fetch(BASE_URL + `/posts?isSave=true`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      //   const count = Math.ceil(res.headers.get("X-Total-Count") / 6);
      //   paginateCount(count);

      return res.json();
    })
    .then((res) => {
      saveItem = res.length;
      saveNumber(saveItem);
    })
    .catch((error) => console.log(error));
};
getSaves();

function paginate(event) {
  const id = event.target.dataset.id;
  if (event.target.matches(".button")) {
    getPosts(id);
  }
}

function paginateCount(num) {
  elButtonList.innerHTML = null;
  for (let i = 1; i <= num; i++) {
    creatButtonListBtn(i);
  }
}

function creatButtonListBtn(num) {
  const button = document.createElement("button");
  button.setAttribute(
    "class",
    `button ${activePage == num ? "btn-active" : ""}`
  );
  button.textContent = num;
  button.dataset.id = num;
  elButtonList.appendChild(button);
}

elButtonList.addEventListener("click", paginate);

function renderPosts(data) {
  const createFragment = document.createDocumentFragment();
  list.forEach((post) => {
    createFragment.appendChild(createPosts(post));
  });
  elData.innerHTML = null;
  elData.appendChild(createFragment);
}

function word(text) {
  // console.log(text);
  let words = text.split(" ");
  const wordsSlice = words.slice(0, 4);
  if (words.length >= 4) {
    wordsSlice.push("...");
    // console.log(wordsSlice);
    // console.log(wordsText)
    return wordsSlice.join(" ");
  } else {
    return text;
  }
}

function createPosts(post) {
  const element = elTemplate.cloneNode(true);
  // const postDescription = word(post.description);
  const postUrl = post.url.split("|");
  const postDescription = post.description.split(" ");
  element.querySelector(".release-date").textContent = post.releaseDate;
  element.querySelector(".url").src = postUrl[0];
  element.querySelector(".name").textContent = post.name;
  element.querySelector(".author").textContent = post.author;
  element.querySelector(".developer").textContent = post.developer;
  element.querySelector(".description").textContent =
    postDescription.length > 4
      ? postDescription.slice(0, 3).join(" ") + " ..."
      : postDescription.join(" ");
  element.querySelector(".more").dataset.id = post.id;
  element.querySelector(".more").textContent = "more";
  element.querySelector(".types").textContent = post.types;
  element.querySelector(".size").textContent = post.size;
  element.querySelector(".btn-delete").dataset.id = post.id;
  element.querySelector(".btn-edit").dataset.id = post.id;
  // element.querySelectorAll(".js-like")[0].dataset.id = post.id;
  // element.querySelectorAll(".js-like")[1].dataset.id = post.id;
  // element.querySelectorAll(".js-like")[0].style.fill = post.isLike
  //   ? "red"
  //   : "yellow";

  // element.querySelector("svg").classList.add(post.isLike ? "heart-like" : "");
  element.querySelector(".like").dataset.id = post.id;
  element.querySelector(".like").src = post.isLike
    ? "./assets/svg/heart-like.svg"
    : "./assets/svg/heart-fill.svg";
  // element.querySelector(".btn-save").disabled = post.isSave ? true : false;
  element.querySelector(".save").dataset.id = post.id;
  element.querySelector(".save").src = post.isSave
    ? "./assets/svg/bookmark-check.svg"
    : "./assets/svg/bookmark-remove.svg";
  return element;
}

async function deletePosts(id) {
  elLoadingAll.classList.remove("hidden");
  elSideSearch.classList.add("hidden");
  elData.classList.add("hidden");
  await fetch(BASE_URL + "/posts/" + id, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      if (res.status == 200) {
        list = list.filter((el) => el.id !== id * 1);
        renderPosts();
      }
      return res.json();
    })
    .then((res) => {
      setTimeout(() => {
        Toastify({
          text: "Ma'lumotlar muvaffaqiyatli o'chirildi!",
          duration: 2000,
          destination: "https://github.com/apvarun/toastify-js",
          className: "toastss",
          newWindow: true,
          stopOnFocus: true,
          style: {
            display: "flex",
            alignitems: "center",
            justifycontent: "center",
            color: "black",
            background: "red",
          },
          onClick: function () {},
        }).showToast();
      }, 0);
    })
    .catch((error) => console.log(error));
  elLoadingAll.classList.add("hidden");
  elSideSearch.classList.remove("hidden");
  elData.classList.remove("hidden");
  modals.style.display = "none";
}

function acceptDelete() {
  if (elAcceptButton.dataset.id) {
    deletePosts(elAcceptButton.dataset.id);
  }
}

function deletePost(event) {
  if (event.target) {
    const id = event.target.dataset.id;
    elAcceptButton.dataset.id = id;
  }
}

elRejectButton.addEventListener("click", function () {
  modals.style.display = "none";
});

elAcceptButton.addEventListener("click", acceptDelete);

elData.addEventListener("click", function (event) {
  const element = event.target.matches(".btn-edit");
  const element1 = event.target.matches(".btn-delete");
  if (element == true) {
    modal.style.display = "block";
  }
  if (element1 == true) {
    modals.style.display = "block";
  }
});

closeBtn.addEventListener("click", function () {
  modal.style.display = "none";
});

async function editPosts(data) {
  elTypeBtn.textContent = "";
  elLoadingEdit.classList.remove("hidden");
  elSideSearch.classList.add("hidden");
  elData.classList.add("hidden");
  await fetch(BASE_URL + "/posts/" + editDataId, {
    method: "PUT",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json", 
    },
  })
    .then((res) => {
      if (res.status == 200) {
        const renderList = list.map((el) => {
          if (el.id == editDataId) {
            return data;
          }
          return el;
        });
        list = [...renderList];
        renderPosts();
      }
      return res.json();
    })
    .then((res) => {
      setTimeout(() => {
        Toastify({
          text: "Ma'lumotlar muvaffaqiyatli tahrirlandi!",
          duration: 2000,
          destination: "https://github.com/apvarun/toastify-js",
          className: "toasts",
          newWindow: true,
          stopOnFocus: true,
          style: {
            display: "flex",
            alignitems: "center",
            justifycontent: "center",
            color: "black",
            background: "yellow",
          },
          onClick: function () {},
        }).showToast();
      }, 0);
    })
    .catch((error) => console.log(error));
  elLoadingEdit.classList.add("hidden");
  elSideSearch.classList.remove("hidden");
  elData.classList.remove("hidden");
  elTypeBtn.textContent = "Submit";
  modal.style.display = "none";
}

function editPost(event) {
  event.preventDefault();
  const releaseDate = elModalInput1.value.trim();
  const url = elModalInput2.value.trim();
  const name = elModalInput3.value.trim();
  const author = elModalInput4.value.trim();
  const developer = elModalInput5.value.trim();
  const description = elModalInput6.value.trim();
  const types = elModalInput7.value.trim();
  const size = elModalInput8.value.trim();
  if (
    !releaseDate ||
    url === "" ||
    name === "" ||
    author === "" ||
    developer === "" ||
    description === "" ||
    types === "" ||
    size === ""
  ) {
    alert("Ma'lumotlar to'liq kiritilmadi!");
  } else {
    const newObject = {
      releaseDate: releaseDate,
      url: url,
      name: name,
      author: author,
      developer: developer,
      description: description,
      types: types,
      size: size,
    };
    editPosts(newObject);
  }

  // if (event.target) {
  // }
}

// function putEdit(event) {
//   editPost(event);
// }

elModal.addEventListener("submit", editPost);

function clickEdit(data) {
  editDataId = data.target.dataset.id;
  const newObj = list.find((el) => el.id === Number(data.target.dataset.id));
  elModalInput1.value = newObj.releaseDate;
  elModalInput2.value = newObj.url;
  elModalInput3.value = newObj.name;
  elModalInput4.value = newObj.author;
  elModalInput5.value = newObj.developer;
  elModalInput6.value = newObj.description;
  elModalInput7.value = newObj.types;
  elModalInput8.value = newObj.size;
  elTypeBtn.dataset.id = newObj.id;
}

async function clickingLIke(data, id) {
  await fetch(BASE_URL + "/posts/" + id, {
    method: "PUT",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      if (res.status == 200) {
        const renderList = list.map((el) => {
          if (el.id == id) {
            return { ...el, isLike: !el.isLike };
          }
          return el;
        });
        list = [...renderList];
        renderPosts();
      }
      return res.json();
    })
    .then((res) => {
      // getPosts();
    })
    .catch((error) => console.log(error));
}

async function clickingSave(data, id, element) {
  element.disabled = true;
  await fetch(BASE_URL + "/posts/" + id, {
    method: "PUT",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      if (res.status == 200) {
        let updatedSaveIndex = -1;
        for (let i = 0; i < list.length; i++) {
          if (list[i].id == id) {
            updatedSaveIndex = i;
          }
        }
        if (updatedSaveIndex != -1) {
          const updatedSave = {
            ...list[updatedSaveIndex],
            isSave: !list[updatedSaveIndex].isSave,
          };
          list.splice(updatedSaveIndex, 1, updatedSave);
          renderPosts();
        }
      }
      return res.json();
    })
    .then((res) => {
      if (res.isSave) {
        saveItem += 1;
        saveNumber(saveItem);
        setTimeout(() => {
          Toastify({
            text: "Ma'lumotlar muvaffaqiyatli saqlandi!",
            duration: 1000,
            destination: "https://github.com/apvarun/toastify-js",
            className: "toastss",
            newWindow: true,
            stopOnFocus: true,
            style: {
              display: "flex",
              alignitems: "center",
              justifycontent: "center",
              color: "red",
              background: "white",
            },
            onClick: function () {},
          }).showToast();
        }, 0);
      } else {
        saveItem -= 1;
        saveNumber(saveItem);
        setTimeout(() => {
          Toastify({
            text: "Ma'lumotlar muvaffaqiyatli olib tashlandi!",
            duration: 1000,
            destination: "https://github.com/apvarun/toastify-js",
            className: "toastss",
            newWindow: true,
            stopOnFocus: true,
            style: {
              display: "flex",
              alignitems: "center",
              justifycontent: "center",
              color: "white",
              background: "red",
            },
            onClick: function () {},
          }).showToast();
        }, 0);
      }
    })
    .catch((error) => console.log(error));
  element.disabled = false;
}

// function heartClick(obj, id) {
//   const newObject = { ...obj, isLike: !obj.isLike };
//   clickingLIke(newObject, id);
//   /*
// {...obj} ={releaseDate:"",url:"",name:"",author:"",developer="",
// types:"",description:"",size:"",isLike:false,id:1,isLike:true}
// */
// }

function clickLike(event) {
  const getObj = list.find((el) => el.id === event.target.dataset.id * 1);
  const id = event.target.dataset.id;
  clickingLIke({ ...getObj, isLike: !getObj.isLike }, id);

  // getObj.releaseDate;
  // getObj.url;
  // getObj.name;
  // getObj.author;
  // getObj.developer;
  // getObj.description;
  // getObj.types;
  // getObj.size;
  // getObj.isLike;
  // heartClick(getObj, id);
}

function clickSave(event) {
  const getObj = list.find((el) => el.id === event.target.dataset.id * 1);
  const id = event.target.dataset.id;
  const parentElement = event.target.parentElement;
  clickingSave({ ...getObj, isSave: !getObj.isSave }, id, parentElement);
}

// BU funksiya kerak emas sababi bitta funksiya orqali
// editga valuelani olib kelish mumkin!!!
// function clickedEdit(data) {
//   data.forEach((obj) => {
//     clickEdit(obj);
//   });
// }

// elModal.addEventListener("submit", (event) => {
//   event.preventDefault();
//   const releaseDate = elModalInput1.value.trim();
//   const url = elModalInput2.value.trim();
//   const name = elModalInput3.value.trim();
//   const author = elModalInput4.value.trim();
//   const developer = elModalInput5.value.trim();
//   const description = elModalInput6.value.trim();
//   const types = elModalInput7;
//   const size = elModalInput8.value.trim();
//   if (
//     releaseDate === "" ||
//     url === "" ||
//     name === "" ||
//     author === "" ||
//     developer === "" ||
//     description === "" ||
//     types === "" ||
//     size === ""
//   ) {
//     alert("Ma'lumotlar to'liq kiritilmadi!");
//   } else {
//     const object = {
//       releaseDate: releaseDate,
//       url: url,
//       name: name,
//       author: author,
//       developer: developer,
//       description: description,
//       types: types,
//       size: size,
//     };
//     getPosts(object);
//   }
//   elModalInput1.value = null;
//   elModalInput2.value = null;
//   elModalInput3.value = null;
//   elModalInput4.value = null;
//   elModalInput5.value = null;
//   elModalInput6.value = null;
//   elModalInput7.value = null;
//   elModalInput8.value = null;
// });

function moreGame(event) {
  const id = event.target.dataset.id;
  if (id) {
    window.location.assign(`http://127.0.0.1:5500/more.html?id=${id}`);
  }
}

function clickedBtns(event) {
  if (event.target.matches(".btn-delete")) {
    deletePost(event);
  } else if (event.target.matches(".btn-edit")) {
    clickEdit(event);
  } else if (event.target.matches(".like")) {
    clickLike(event);
  } else if (event.target.matches(".save")) {
    clickSave(event);
  } else if (event.target.matches(".more")) {
    moreGame(event);
  }
}

elData.addEventListener("click", clickedBtns);

const getTypes = async (data) => {
  await fetch(BASE_URL + "/types", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) =>
    res
      .json()
      .then((res) => {
        renderTypess(res);
        searchTypes(res);
      })
      .catch((error) => console.log(error))
  );
};
getTypes();

function renderTypess(data) {
  const createFragment = document.createDocumentFragment();
  data.forEach((type) => {
    createFragment.appendChild(createTypes(type));
  });
  elModalInput7.appendChild(createFragment);
}

function createTypes(type) {
  const element = elTemplate1.cloneNode(true);
  element.querySelector(".type1").textContent = type.type;
  element.querySelector(".type1").value = type.type;
  return element;
}

// Mumkinmas chunki bu oshiqcha kod va ortiqcha zapros saytni
// kechikishiga sabab bo'ladi!!!
// const searchType = async (data) => {
//   await fetch(BASE_URL + "/types", {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//     },
//   }).then((res) =>
//     res
//       .json()
//       .then((res) => {
//         console.log(res);
//         searchTypes(res);
//       })
//       .catch((error) => console.log(error))
//   );
// };
// searchType();

function searchTypes(data) {
  const createFragment = document.createDocumentFragment();
  data.forEach((post) => {
    createFragment.appendChild(createTypess(post));
  });
  elSearch.appendChild(createFragment);
}
function createTypess(type) {
  const element = elTemplate2.cloneNode(true);
  element.querySelector(".search-type").textContent = type.type;
  element.querySelector(".search-type").dataset.id = type.id;
  return element;
}

const searchPosts = async (page) => {
  elLoading.classList.remove("hidden");
  elSideSearch.classList.add("hidden");
  await fetch(BASE_URL + `/posts?types=${page}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((res) => {
      list = [...res];
      renderPosts();
      if (res.length == 0) {
        const element = document.createElement("h1");
        const element1 = document.createElement("img");
        element.classList.add("null");
        element.textContent = `No information found on ${page}!`;
        element1.src = "./assets/images/asd.jpg";
        element1.classList.add("null-img");
        elData.append(element, element1);
        return element;
      }
    })
    .catch((error) => console.log(error));
  elLoading.classList.add("hidden");
  elSideSearch.classList.remove("hidden");
};

const getPost = async () => {
  elLoading.classList.remove("hidden");
  elSideSearch.classList.add("hidden");
  await fetch(BASE_URL + "/posts?_page=1&_limit=6", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((res) => {
      list = [...res];
      renderPosts();
    })
    .catch((error) => console.log(error));
  elLoading.classList.add("hidden");
  elSideSearch.classList.remove("hidden");
};

function searchClick(event) {
  const id = event.target.dataset.id;
  if (event.target.matches(".search-type") && id) {
    searchPosts(event.target.textContent);
  }
  if (event.target.matches(".all")) {
    getPost();
  }
}
elSideSearch.addEventListener("click", searchClick);
