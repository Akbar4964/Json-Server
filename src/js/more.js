const id = window.location.search.replace("?id=", "");

const BASE_URL = "http://localhost:5000";

const elData = document.querySelector(".data");

const elTemplate = document.querySelector(".template").content;

const elComments = document.querySelector(".comments").content;

const elStickers = document.querySelector(".template-sticks").content;

const elLoading = document.querySelector(".loading");

const elMoreComments = document.querySelector(".more-comments");

const elForm = document.querySelector(".form");

const elMoreInput = document.querySelector(".more-input");

const elMoreText = document.querySelector(".more-text");

const elStickersList = document.querySelector(".stickers-list");

const elAcceptButton = document.querySelector(".accept");

const modals = document.getElementById("myModals");

const closeBtn = document.getElementsByClassName("close")[0];

let list = {};

function getTime(time) {
  const now = new Date(time);
  const date = now.getDate() < 10 ? "0" : now.getDate();
  const month =
    now.getMonth() < 10 ? "0" + (now.getMonth() + 1) : now.getMonth();
  const year = now.getFullYear();
  const minutes =
    now.getMinutes() < 10 ? "0" + (now.getMinutes() + 1) : now.getMinutes();
  const hour = now.getHours() < 10 ? "0" + now.getHours() : now.getHours();
  const seconds =
    now.getSeconds() < 10 ? "0" + (now.getSeconds() + 1) : now.getSeconds();
  return `${hour}:${minutes}:${seconds} ${date}.${month}.${year}`;
}

const getPosts = async () => {
  await fetch(BASE_URL + "/posts/" + id, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      list = { ...res };
      renderPosts(res);
    })
    .catch((error) => console.log(error));
};
getPosts();

function renderPosts(obj) {
  const createFragment = document.createDocumentFragment();
  createFragment.appendChild(createPosts(obj));
  elData.innerHTML = null;
  elData.appendChild(createFragment);
}

function createPosts(post) {
  const element = elTemplate.cloneNode(true);
  const postUrl = post.url.split("|");
  element.querySelector(".release-date").textContent = post.releaseDate;
  element.querySelector(".url").src = postUrl[0];
  element.querySelector(".img1").src = postUrl[1];
  element.querySelector(".img2").src = postUrl[2];
  element.querySelector(".img3").src = postUrl[3];
  element.querySelector(".name").textContent = post.name;
  element.querySelector(".author").textContent = `Author: ${post.author}`;
  element.querySelector(
    ".developer"
  ).textContent = `Developer: ${post.developer}`;
  element.querySelector(".description").textContent = post.description;
  element.querySelector(".types").textContent = post.types;
  element.querySelector(".size").textContent = `Size: ${post.size}`;
  return element;
}

let comments = [];

const getComments = async () => {
  await fetch(BASE_URL + "/comments", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      res.sort((a, b) => {
        return new Date(b.time) - new Date(a.time);
      });
      // console.log(
      //   aTime,
      //   new Date(aTime).getHours(),
      //   new Date(aTime).getMinutes()
      // );
      // res.sort((a, b) => {
      //   console.log(a, b);
      //   return b.id - a.id;
      // });
      // res.reverse();
      comments = [...res];
      renderComments();
    })
    .catch((error) => console.log(error));
};
getComments();

function renderComments() {
  const createFragment = document.createDocumentFragment();
  comments.forEach((comment) => {
    createFragment.appendChild(createComments(comment));
  });
  elMoreComments.innerHTML = null;
  elMoreComments.appendChild(createFragment);
}

const date = new Date();
const october20 = new Date(2023, 9, 20);
const october24 = new Date();
const result = october20 - october24;

function createComments(comment) {
  const element = elComments.cloneNode(true);
  element.querySelector(".user-name").textContent = comment.name;
  element.querySelector(".user-comment").textContent = comment.comment;
  element.querySelector(".com-delete").dataset.id = comment.id;
  element.querySelector(".year").textContent = getTime(comment.time);
  return element;
}

const setPosts = async (data) => {
  await fetch(BASE_URL + "/comments", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      Toastify({
        text: "Komentariya muvaffaqiyatli qo'shildi!",
        duration: 1500,
        destination: "https://github.com/apvarun/toastify-js",
        className: "toast",
        newWindow: true,
        stopOnFocus: true,
        style: {
          display: "flex",
          alignitems: "center",
          justifycontent: "center",
          color: "green",
          background: "greenyellow",
        },
        onClick: function () {},
      }).showToast();
      getComments();
      // comments = [data, ...comments];
      // renderComments();
    })
    .catch((error) => {
      console.log(error);
    });
};

elForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = elMoreInput.value.trim();
  const comment = elMoreText.value.trim();
  const commentTime = getTime();
  if (name === "" || comment === "") {
    alert("Ma'lumotlar to'liq kiritilmadi!");
  } else {
    const object = {
      name: name,
      comment: comment,
      time: new Date(),
    };
    setPosts(object);
    elMoreInput.value = null;
    elMoreText.value = null;
  }
});

let stickers = [];

let test = "";

const getStickers = async () => {
  await fetch(BASE_URL + "/stickers", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      stickers = [...res];
      renderStickers();
    })
    .catch((error) => console.log(error));
};
getStickers();

function renderStickers() {
  const createFragment = document.createDocumentFragment();
  stickers.forEach((stick) => {
    createFragment.appendChild(createStickers(stick));
  });
  elStickersList.innerHTML = null;
  elStickersList.appendChild(createFragment);
}

function createStickers(sticker) {
  const element = elStickers.cloneNode(true);
  element.querySelector(".more-sticks").textContent = sticker.sticker;
  element.querySelector(".more-sticks").dataset.id = sticker.id;
  return element;
}

function eventSticker(event) {
  const id = event.target.dataset.id;
  const content = event.target.textContent.toString();
  if (id) {
    test = content;
    elMoreText.value += test;
  }
}

elStickersList.addEventListener("click", eventSticker);

async function deleteComments(id) {
  await fetch(BASE_URL + "/comments/" + id, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      if (res.status == 200) {
        comments = comments.filter((el) => el.id !== id * 1);
        renderComments();
      }
      return res.json();
    })
    .then((res) => {})
    .catch((error) => console.log(error));
  modals.style.display = "none";
}

function acceptDelete() {
  if (elAcceptButton.dataset.id) {
    deleteComments(elAcceptButton.dataset.id);
  }
}

function deleteComment(event) {
  if (event.target) {
    const id = event.target.dataset.id;
    elAcceptButton.dataset.id = id;
  }
}

function tests(event) {
  if (event.target.matches(".com-delete")) {
    deleteComment(event);
  }
}

elMoreComments.addEventListener("click", tests);

elAcceptButton.addEventListener("click", acceptDelete);

elMoreComments.addEventListener("click", function (event) {
  const element = event.target.matches(".com-delete");
  if (element == true) {
    modals.style.display = "block";
  }
});

closeBtn.addEventListener("click", function () {
  modals.style.display = "none";
});
