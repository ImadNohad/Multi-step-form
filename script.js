//Objet contenant tous les plan disponibles
let plans = [
  {
    name: "Arcade",
    price: 9,
  },
  {
    name: "Advanced",
    price: 12,
  },
  {
    name: "Pro",
    price: 15,
  },
];

//Objet contenant tous les addons disponibles
let addons = [
  {
    name: "Online service",
    desc: "Access to multiplayer games",
    price: 1,
  },
  {
    name: "Larger storage",
    desc: "Extra 1TB of cloud save",
    price: 2,
  },
  {
    name: "Customizable Profile",
    desc: "Custom theme on your profile",
    price: 2,
  },
];

//Objet pour stocker les informations saisies par l'utilisateur
let data = {
  name: "",
  email: "",
  phone: "",
  plan: {},
  yearly: false,
  addons: [],
};

//Variables globales de selection des élements
var currentStep = 0;
let buttons = document.querySelector(".buttons");
let btnNext = document.querySelector("#btnNext");
let btnBack = document.querySelector("#btnBack");
let plansDiv = document.querySelectorAll(".plan");
let yearly = document.querySelector("#yearly");
let addonsDiv = document.querySelectorAll(".addon");
let changePlan = document.getElementById("changePlan");

//Evènement du clic du boutton Next
btnNext.addEventListener("click", (e) => {
  goToStep(true);
});

//Evènement du clic du boutton Back
btnBack.addEventListener("click", (e) => {
  goToStep(false);
});


//Evènement du clic des éléments des plans
plansDiv.forEach((element, index) => {
  element.addEventListener("click", (e) => {
    data.plan = {};
    let siblings = e.target.parentElement.children;

    //Test pour gérer le clic sur la div du plan ainsi que ses enfants
    if (!e.target.classList.contains("plan")) {
      e.target.parentElement.classList.toggle("plan-selected");
      siblings = e.target.parentElement.parentElement.children;
    } else {
      e.target.classList.toggle("plan-selected");
    }

    //Deséléction des autres plan lorsque un plan est séléctionné
    for (let sibling of siblings) {
      if (Array.from(siblings).indexOf(sibling) == index) continue;
      sibling.classList.remove("plan-selected");
    }

    //Ajout du plan séléctionné au objet
    if (
      e.target.classList.contains("plan-selected") ||
      e.target.parentElement.classList.contains("plan-selected")
    ) {
      data.plan = plans[index];
    }
  });
});

//Evènement du clic des addons
addonsDiv.forEach((element, index) => {
  element.addEventListener("change", (e) => {
    if(e.target.checked)
      data.addons.push(addons[index]);
    else
      data.addons = data.addons.filter(el => el != addons[index])
    element.classList.toggle("plan-selected");
  });
});

//Evènement change de la checkbox yearly/monthly
yearly.addEventListener("change", (e) => {
  setYearly(e.target.checked);
});

//Evènement du clic du lien Change
changePlan.addEventListener("click", (e) => {
  e.preventDefault()
  currentStep = 2
  goToStep(false)
});

//Fonction pour se déplacer entre les étapes du formulaire
function goToStep(forward) {
  index = forward ? 1 : -1;

  if (currentStep == 0) {
    if (!validateForm()) {
      return;
    }
  }

  if (currentStep == 1) {
    if (Object.keys(data.plan).length === 0 && forward) {
      return;
    }
  }

  if (currentStep == 2) {
    populateSummary();
  }

  var steps = Array.from(document.querySelectorAll(".step-main"));
  var sidebarSteps = document.querySelectorAll(".step-number");

  console.log(currentStep)

  for (let step in steps) {
    steps[step].classList.add("hide");
    sidebarSteps[step]?.classList.remove("blue");
  }

  steps[currentStep + index].classList.remove("hide");
  sidebarSteps[currentStep + index]?.classList.add("blue");

  if (forward) {
    currentStep++;
  } else {
    currentStep--;
  }

  if (currentStep == 0) {
    btnBack.classList.add("hide");
  } else {
    btnBack.classList.remove("hide");
  }

  if (currentStep == 4) buttons.classList.toggle("hide");
}

//fonction de validation du formulaire
function validateForm() {
  let txtName = document.querySelector("#txtName");
  let txtEmail = document.querySelector("#txtEmail");
  let txtTel = document.querySelector("#txtTel");
  let valid = true;

  if (txtName.value.length == 0) {
    valid = false;
    DisplayError(txtName, "Name is required");
  } else {
    DisplaySuccess(txtName);
  }

  if (txtEmail.value.length == 0) {
    DisplayError(txtEmail, "Email is required");
    valid = false;
  } else {
    DisplaySuccess(txtEmail);
  }

  if (
    !txtEmail.value.match(/^[a-zA-Z0-9\.\-\_]+@[a-zA-Z0-9\-\_]+\.[a-z]{2,}$/)
  ) {
    DisplayError(txtEmail, "Email is not valid");
    valid = false;
  } else {
    DisplaySuccess(txtEmail);
  }

  if (txtTel.value.length == 0) {
    DisplayError(txtTel, "Phone number is required");
    valid = false;
  } else {
    DisplaySuccess(txtTel);
  }

  if (valid) {
    data.name = txtName.value;
    data.email = txtEmail.value;
    data.phone = txtTel.value;
  }

  return valid;
}

function setYearly(yearly) {
  let arcade = document.querySelector("#arcade .plan-price");
  let advanced = document.querySelector("#advanced .plan-price");
  let pro = document.querySelector("#pro .plan-price");

  arcade.textContent = yearly ? "$90/yr" : "$9/mo";
  advanced.textContent = yearly ? "$120/yr" : "$12/mo";
  pro.textContent = yearly ? "$150/yr" : "$15/mo";

  arcade.nextElementSibling.classList.toggle("hide");
  advanced.nextElementSibling.classList.toggle("hide");
  pro.nextElementSibling.classList.toggle("hide");

  addonsDiv[0].lastElementChild.textContent = yearly ? "$10/yr" : "+$1/mo";
  addonsDiv[1].lastElementChild.textContent = yearly ? "$20/yr" : "+$2/mo";
  addonsDiv[2].lastElementChild.textContent = yearly ? "$20/yr" : "+$2/mo";

  data.yearly = yearly;
}

//Fonction d'affichage du résumé
function populateSummary() {
  let planPrice = data.yearly ? data.plan.price * 10 : data.plan.price;
  let summaryPlan = document.querySelector(".summary-plan");
  let summaryAddons = document.querySelector(".summary-addons");
  let total = document.querySelector(".total");

  summaryPlan.firstElementChild.textContent = `${data.plan.name} (${
    data.yearly ? "Yearly" : "Monthly"
  })`;
  summaryPlan.lastElementChild.textContent = `$${planPrice}/${
    data.yearly ? "yr" : "mo"
  }`;

  summaryAddons.innerHTML = ""

  let totalPrice = planPrice

  for (let addon of data.addons) {
    let addonPrice = data.yearly ? addon.price * 10 : addon.price;
    let div = document.createElement("div");
    let span1 = document.createElement("span");
    let span2 = document.createElement("span");

    span1.textContent = addon.name;
    span2.textContent = `+$${addonPrice}/${data.yearly ? "yr" : "mo"}`;

    div.append(span1);
    div.append(span2);
    summaryAddons.append(div);

    totalPrice += addonPrice
  }

  total.firstElementChild.textContent = data.yearly ? "Total (per year)" : "Total (per month)";
  total.lastElementChild.textContent = `$${totalPrice}${data.yearly ? "/yr" : "/mo"}`;
}

function DisplayError(input, message) {
  input.parentElement.classList.add("error");
  input.previousElementSibling.textContent = message;
}

function DisplaySuccess(input) {
  input.parentElement.classList.remove("error");
  input.previousElementSibling.textContent = "";
}
