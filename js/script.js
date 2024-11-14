const form = document.querySelector("#form");
const cardContainer = document.querySelector("#card");
const clearAllButton = document.querySelector("#clearAll");

function validate(field) {
  if (field.value.length < 3) {
    alert("Maydon kamida 3 ta belgidan iborat bo'lishi kerak.");
    field.focus();
    return false;
  }
  return true;
}

function validateForm() {
  const logo = document.querySelector("#logo1");
  const companyName = document.querySelector("#Mange");
  const position = document.querySelector(".text3");
  const skillsChecked = document.querySelectorAll(".skills:checked");

  if (!validate(logo) || !validate(companyName) || !validate(position)) {
    return false;
  }

  if (skillsChecked.length === 0) {
    alert("Kamida bitta ko'nikma tanlanishi kerak.");
    return false;
  }

  return true;
}

function createCard(data) {
  return `
    <div class="card" data-id="${data.id}">
     
  <div class="img_div">
    <img class="logo" src="${data.logo}" alt="logo">
  </div>
  <div class="title_div">
    <div class="manage">
      <h4>${data.companyName}</h4>
      ${data.isNew ? "<p>NEW</p>" : ""}
      ${data.isFeatured ? '<p class="featured">FEATURED</p>' : ""}
    </div>
    <div class="user">
      <h2>${data.position}</h2>
    </div>
    <div class="port_time">
      <p>${data.time}</p>
      <p> • </p>
      <p>${data.jobType}</p>
      <p> • </p>
      <p>${data.location}</p>
    </div>
</div>
      <div class="subtitle_div">
        ${
          data.skills.length > 0
            ? (() => {
                let skillsHTML = "";
                for (let skill of data.skills) {
                  skillsHTML += `<h3>${skill}</h3>`;
                }
                return skillsHTML;
              })()
            : "<p>No skills available</p>"
        }
      </div>
      <img class="delete_icon" src="./image/trash-solid.svg" width="20" height="20" alt="delete" data-id="${
        data.id
      }">
    </div>`;
}

function getData() {
  let storage = [];
  if (localStorage.getItem("vacancies")) {
    storage = JSON.parse(localStorage.getItem("vacancies"));
  }
  return storage;
}

document.addEventListener("DOMContentLoaded", function () {
  const data = getData();
  data.forEach((item) => {
    cardContainer.innerHTML += createCard(item);
  });
});

form.addEventListener("submit", function (event) {
  event.preventDefault();

  if (!validateForm()) {
    return;
  }

  const logo = document.querySelector("#logo1").value;
  const companyName = document.querySelector("#Mange").value;
  const isNew = document.querySelector(".checkbox.is-new").checked;
  const isFeatured = document.querySelector(".checkbox.is-featured").checked;
  const position = document.querySelector(".text3").value;
  const time = document.querySelector("#vaqtlar").value;
  const jobType = document.querySelector("#ish").value;
  const location = document.querySelector("#davlat").value;
  const skills = [];
  for (let input of form.querySelectorAll(".skills:checked")) {
    skills.push(input.value);
  }

  const vacancy = {
    id: Date.now(),
    logo,
    companyName,
    isNew,
    isFeatured,
    position,
    time,
    jobType,
    location,
    skills,
  };

  const block = createCard(vacancy);
  cardContainer.innerHTML += block;

  let data = getData();
  data.push(vacancy);
  localStorage.setItem("vacancies", JSON.stringify(data));

  form.reset();
});

cardContainer.addEventListener("click", function (event) {
  if (event.target.classList.contains("delete_icon")) {
    const isDelete = confirm("Rostdan ham o'chirmoqchimisiz?");
    if (isDelete) {
      const id = event.target.getAttribute("data-id");

      const card = document.querySelector(`.card[data-id="${id}"]`);
      if (card) {
        card.remove();
      }

      let data = getData();
      data = data.filter((item) => item.id != id);
      localStorage.setItem("vacancies", JSON.stringify(data));
    }
  }
});

clearAllButton.addEventListener("click", function (event) {
  event.preventDefault();

  const isClear = confirm("Rostdan ham hammasini o'chirmoqchimisiz?");
  if (isClear) {
    cardContainer.innerHTML = "";
    localStorage.removeItem("vacancies");
  }
});
