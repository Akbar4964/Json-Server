const BASE_URL = "http://localhost:5000";

const elData = document.querySelector(".game-input7");

const elForm = document.querySelector(".form");

const elLink = document.querySelector(".link");

const elGameBtn = document.querySelector(".game-btn");

const elTypeBtn = document.querySelector(".type-btn");

const elAddType = document.querySelector(".add-type");

const elTemplate = document.querySelector(".template1").content;

const elGameInput1 = document.querySelector(".game-input1");

const elGameInput2 = document.querySelector(".game-input2");

const elGameInput3 = document.querySelector(".game-input3");

const elGameInput4 = document.querySelector(".game-input4");

const elGameInput5 = document.querySelector(".game-input5");

const elGameInput6 = document.querySelector(".game-input6");

const elGameInput7 = document.querySelector(".game-input7");

const elGameInput8 = document.querySelector(".game-input8");

const elModalInput = document.querySelector(".modal-input");

const openModalBtn = document.getElementById("openModalBtn");

const elLoadingGame = document.querySelector(".loading-game");

const modal = document.getElementById("myModal");

const closeBtn = document.getElementsByClassName("close")[0];

const elModal = document.querySelector(".modalForm");

const setPosts = async (data) => {
  elLoadingGame.classList.remove("hidden");
  await fetch(BASE_URL + "/posts", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) =>
    res
      .json()
      .then((data) => {
        setTimeout(() => {
          Toastify({
            text: "Ma'lumotlar muvaffaqiyatli qo'shildi!",
            duration: 1000,
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
            onClick: function () { },
          }).showToast();
        }, 0);
        setTimeout(() => {
          window.location.assign("http://127.0.0.1:5500/index.html");
        }, 1500);
      })
      .catch((error) => {
        console.log(error);
      })
  );
  elLoadingGame.classList.add("hidden");
};

elForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const releaseDate = elGameInput1.value.trim();
  const url = elGameInput2.value.trim();
  const name = elGameInput3.value.trim();
  const author = elGameInput4.value.trim();
  const developer = elGameInput5.value.trim();
  const description = elGameInput6.value.trim();
  const types = elGameInput7.value.trim();
  const size = elGameInput8.value.trim();
  if (
    releaseDate === "" ||
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
    const object = {
      releaseDate: releaseDate,
      url: url,
      name: name,
      author: author,
      developer: developer,
      description: description,
      types: types,
      size: size,
      isLike: false,
    };
    setPosts(object);
    elGameInput1.value = null;
    elGameInput2.value = null;
    elGameInput3.value = null;
    elGameInput4.value = null;
    elGameInput5.value = null;
    elGameInput6.value = null;
    elGameInput7.value = null;
    elGameInput8.value = null;
  }
});

const getPosts = async (data) => {
  await fetch(BASE_URL + "/types", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) =>
    res
      .json()
      .then((res) => {
        renderPosts(res);
      })
      .catch((error) => console.log(error))
  );
};
getPosts();

function renderPosts(data) {
  const createFragment = document.createDocumentFragment();
  data.forEach((post) => {
    createFragment.appendChild(createPosts(post));
  });
  elData.appendChild(createFragment);
}
function createPosts(post) {
  const element = elTemplate.cloneNode(true);
  element.querySelector(".type").textContent = post.type;
  element.querySelector(".type").value = post.type;
  return element;
}

elAddType.addEventListener("click", function () {
  modal.style.display = "block";
});

closeBtn.addEventListener("click", function () {
  modal.style.display = "none";
});

const setTypes = async (data) => {
  await fetch(BASE_URL + "/types", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) =>
    res
      .json()
      .then((res) => {
        setTimeout(() => {
          Toastify({
            text: "Turlari muvaffaqiyatli qo'shildi!",
            duration: 2000,
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
            onClick: function () { },
          }).showToast();
        }, 0);
        modal.style.display = "none";
        setTypes(res);
      })
      .catch((error) => {
        console.log(error);
      })
  );
};
elModal.addEventListener("submit", (event) => {
  event.preventDefault();
  const types = elModalInput.value.trim().toUpperCase();
  if (types === "") {
    alert("Hech qanday type kirilmadi!");
  } else {
    const object = {
      type: types,
    };
    setTypes(object);
  }
  elModalInput.value = null;
});
