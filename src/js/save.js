const BASE_URL = "http://localhost:5000";

const elData = document.querySelector(".data");

const elTemplate = document.querySelector(".template").content;

const elLoading = document.querySelector(".loading");

const elForm = document.querySelector(".form");

const elGameInput = document.querySelector(".game-input");

const elButtonList = document.querySelector(".button-list");

const elRowList = document.querySelector(".row-button-list");

const elSaveNumber = document.querySelector(".save-number");

let list = [];

let saveItem = 0;

const saveNumber = (number = 0) => {
  elSaveNumber.textContent = number;
};

const getPosts = async () => {
  document.body.classList.add("body-hidden");
  elLoading.classList.remove("hidden");
  elData.classList.add("hidden");
  await fetch(BASE_URL + `/posts`, {
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
      list = [...res];
      renderPosts();
    })
    .catch((error) => console.log(error));
  elLoading.classList.add("hidden");
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
      // list = [...res];
      // renderPosts();
    })
    .catch((error) => console.log(error));
};
getSaves();

// elSaveNumber.textContent = saveItem;

// function paginate(event) {
//   const id = event.target.dataset.id;
//   const content = event.target.textContent;
//   if (event.target.matches(".button") && content) {
//     getPosts(event.target.textContent);
//   }
// }

// function paginateCount(num) {
//   elButtonList.innerHTML = null;
//   for (let i = 1; i <= num; i++) {
//     creatButtonListBtn(i);
//   }
// }

// function creatButtonListBtn(num) {
//   const button = document.createElement("button");
//   button.classList.add("button");
//   button.textContent = num;
//   button.dataset.id = num;
//   elButtonList.appendChild(button);
// }

// elButtonList.addEventListener("click", paginate);

function renderPosts() {
  const createFragment = document.createDocumentFragment();
  list.forEach((post) => {
    if (post.isSave == true) {
      createFragment.appendChild(createPosts(post));
    }
  });
  elData.innerHTML = null;
  elData.appendChild(createFragment);
}

function word(text) {
  let words = text.split(" ");
  const wordsSlice = words.slice(0, 4);
  if (words.length >= 4) {
    wordsSlice.push("...");
    return wordsSlice.join(" ");
  } else {
    return text;
  }
}

function createPosts(post) {
  const element = elTemplate.cloneNode(true);
  const postDescription = post.description.split(" ");
  element.querySelector(".release-date").textContent = post.releaseDate;
  element.querySelector(".url").src = post.url;
  element.querySelector(".name").textContent = post.name;
  element.querySelector(".author").textContent = post.author;
  element.querySelector(".developer").textContent = post.developer;
  element.querySelector(".description").textContent =
    postDescription.length > 4
      ? postDescription.slice(0, 4).join(" ") + " ..."
      : postDescription.join(" ");
  element.querySelector(".types").textContent = post.types;
  element.querySelector(".size").textContent = post.size;
  element.querySelector(".like").dataset.id = post.id;
  element.querySelector(".like").src = post.isLike
    ? "./assets/svg/heart-like.svg"
    : "./assets/svg/heart-fill.svg";
  element.querySelector(".save").dataset.id = post.id;
  element.querySelector(".save").src = post.isSave
    ? "./assets/svg/bookmark-check.svg"
    : "./assets/svg/bookmark-remove.svg";
  return element;
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
    .then((res) => {})
    .catch((error) => console.log(error));
}

async function clickingSave(data, id) {
  await fetch(BASE_URL + "/posts/" + id, {
    method: "PUT",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      if (res.status == 200) {
        // let updatedSaveIndex = -1;
        // for (let i = 0; i < list.length; i++) {
        //   if (list[i].id == id) {
        //     updatedSaveIndex = i;
        //   }
        // }
        // if (updatedSaveIndex != -1) {
        //   const updatedSave = {
        //     ...list[updatedSaveIndex],
        //     isSave: !list[updatedSaveIndex].isSave,
        //   };
        //   list.splice(updatedSaveIndex, 1, updatedSave);
        //   renderPosts();
        // }
        // if (.id == id) {
        //   findIndex = list.id;
        // }
        // if(findIndex !=-1){
        // }
      }
      return res.json();
    })
    .then((res) => {
      let findIndex = list.findIndex((el) => el.id == id);
      if (findIndex >= 0) {
        list.splice(findIndex, 1, res);
        renderPosts();
      }
      if (res.isSave) {
        saveItem -= 1;
        saveNumber(saveItem);
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
}

function clickLike(event) {
  const getObj = list.find((el) => el.id === event.target.dataset.id * 1);
  const id = event.target.dataset.id;
  clickingLIke({ ...getObj, isLike: !getObj.isLike }, id);
}

function clickSave(event) {
  const getObj = list.find((el) => el.id === event.target.dataset.id * 1);
  const id = event.target.dataset.id;
  clickingSave({ ...getObj, isSave: !getObj.isSave }, id);
}

function clickedBtns(event) {
  if (event.target.matches(".like")) {
    clickLike(event);
  } else if (event.target.matches(".save")) {
    clickSave(event);
  }
}

elData.addEventListener("click", clickedBtns);
