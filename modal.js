function editNav() {
  var x = document.getElementById("myTopnav");
  if (x.className === "topnav") {
    x.className += " responsive";
  } else {
    x.className = "topnav";
  }
}

// DOM Elements
const modalbg = document.querySelector(".bground");
const modalBtn = document.querySelectorAll(".modal-btn");
const formData = document.querySelectorAll(".formData");

// launch modal event
modalBtn.forEach((btn) => btn.addEventListener("click", launchModal));

// launch modal form
function launchModal() {
  modalbg.style.display = "block";
}

///////////////////////////////////////////////////////////////////////////////
// Modal window closing implementation

// close modal form
function closeModal() {
  modalbg.style.display = "none"; // Set display to none
}

// Get the close button element
const closeBtn = document.querySelector(".close");

// Wait for close event on close cross click
closeBtn.addEventListener("click", closeModal);
// And on escape key press
window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeModal();
});

///////////////////////////////////////////////////////////////////////////////
// form field format validation functions

// Insert span for error messages
const insertErrorMessage = (element, text) => {
  const parent = element.parentElement;
  parent.setAttribute("data-error", text);
  parent.setAttribute("data-error-visible", "true");
};

// Remove previous error messages
const errorMessagesRemove = () => {
  for (let div of formData) {
    div.setAttribute("data-error", "");
    div.setAttribute("data-error-visible", "false");
  }
};

// first and last name
const validateNames = (...names) => {
  let errorFlag = true;

  for (let name of names) {
    if (name.value.length < 2) {
      const label = name.labels[0];
      const text = `Vous devez fournir un ${label.textContent.toLowerCase()} d'au moins deux lettres`;
      insertErrorMessage(name, text);

      errorFlag = false;
    }
  }

  return errorFlag;
};

// email address
// We don't use html validation feature, as email addresses are somewhat complex
// We allow only a subset of what RFC5322 defines
// To avoid server overload and possible hacking with fabulous regex:
// Wordly characters: letters of English alphabet, digits or underscores
// Doesn't allow unicode characters
// No whitespace
// No single/double quotes, alphanumeric only hostname with TLD (.*),
// But no IP address literals i.e [192.168.0.1]
// Periods(not consecutive) in local-part and domain are allowed
// As well as dashes (-) inside the domain
// As long as they don't lead or trail the string
// No comment with ()
// And of course the @ separator is mandatory
// Lengths: local-part: {1,64} chars max, domain and subdomains: {1,63} chars max each
// TLD length: {2,63}, and a total of 254 characters max
// See https://datatracker.ietf.org/doc/html/rfc5321#section-4.5.3.1.1 for references
// and also https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/email#basic_validation
const validateEmail = (mail) => {
  errorFlag = true;

  minEmailLength = 6;
  maxEmailLength = 254;

  const email = mail.value;
  let errorMessage = "";
  switch (true) {
    case email.length === 0:
      errorFlag = false;
      errorMessage = "Merci de renseigner une adresse de messagerie";
      break;

    case !email.includes("@"):
      errorFlag = false;
      errorMessage =
        'Il semble que votre adresse de messagerie soit mal formée : il manque le caractère "@"';
      break;

    case email.length < minEmailLength:
      errorFlag = false;
      errorMessage = `Votre adresse de messagerie doit comporter au minimum ${minEmailLength} caractères`;
      break;

    case email.length > maxEmailLength:
      errorFlag = false;
      errorMessage = `Votre adresse de messagerie doit comporter au maximum ${maxEmailLength} caractères`;
      break;

    default:
      break;
  }

  // first part of an email, the local part
  const local =
    /^[\w!#$%&*+/=?^_`{|}~][\w!#$%&*+/=?^_`.{|}~-]{0,62}[\w!#$%&*+/=?^_`{|}~]/;
  // second part, domain
  const domain = /(?:(?=[\w-]{1,63}\.)[\w]+(?:-[\w]+)*\.){1,8}[\w]{2,63}$/;

  // split email to check the parts
  const parts = email.split("@");
  // test if email matches the local-part and domain regexes
  if (
    (!local.test(parts[0]) || !domain.test(parts[1])) &&
    errorMessage.length === 0
  ) {
    errorFlag = false;

    errorMessage =
      "Votre email ne semble pas valide, merci d'en renseigner un autre";
  }

  if (errorMessage.length) insertErrorMessage(mail, errorMessage);

  return errorFlag;
};

// Birthdate:
// Competitors must be at least 18 for now
// And of course, Maria Branyas Morera,
// born March 4, 1907 and the dean of the humanity is welcome :)
// But let's give someone a chance to overtake Jeanne Calment(122 years, 164 days)
// and reach the canonical age of 123
const validateBirthDate = (date) => {
  let errorFlag = true;

  if (!date.value.length) {
    insertErrorMessage(date, "Merci de renseigner une date de naissance");

    return false;
  }

  const minAge = 18;
  const maxAge = 123;
  const today = new Date();
  const todayYear = today.getFullYear();
  const birthDate = new Date(date.value);
  const birthYear = birthDate.getFullYear();

  const age = todayYear - birthYear;

  if (age > maxAge) {
    errorMessage =
      "Il semble que vous ayez commis une erreur dans votre date de naissance, merci de la vérifier";
    insertErrorMessage(date, errorMessage);

    return false;
  }

  if (age < minAge) errorFlag = false;

  if (age === minAge) {
    const todayMonth = today.getMonth();
    const birthMonth = birthDate.getMonth();
    if (todayMonth < birthMonth) errorFlag = false;

    if (todayMonth === birthMonth) {
      const todayDay = today.getDate();
      const birthDay = birthDate.getDate();

      if (todayDay < birthDay) errorFlag = false;
    }
  }

  if (!errorFlag)
    insertErrorMessage(
      date,
      "Vous devez être majeur pour participer à un tournoi GameOn"
    );

  return errorFlag;
};

// The number of contests must be a number...
// So get the type of the information returned by the form
// As GameOn seems to exist since 2014,
// let's say that there has been 10 contests max
const validateNbContest = (nb) => {
  let errorFlag = true;

  const castNb = parseInt(nb.value);
  if (isNaN(castNb) || castNb < 0 || castNb > 10) {
    const errorMessage = "Merci de saisir un nombre positif, entre 0 et 10";
    insertErrorMessage(nb, errorMessage);
    errorFlag = false;
  }

  return errorFlag;
};

// Is there a radio button checked for the city ?
const validateCity = () => {
  let errorFlag = true;

  radioCheckedList = document.querySelectorAll(".city-choice:checked");
  if (!radioCheckedList.length) {
    const lastRadioNode = document.querySelectorAll(".city-choice");
    const label = lastRadioNode.item(lastRadioNode.length - 1).labels[0];
    const errorMessage =
      "Merci de sélectionner une ville pour participer à un tournoi";
    insertErrorMessage(label, errorMessage);

    errorFlag = false;
  }

  return errorFlag;
};

// Validate term of use
const validateTerms = () => {
  let errorFlag = true;

  const term = document.getElementById("checkbox1");
  if (!term.checked) {
    const label = term.labels[0];
    const errorMessage = "Merci d'accepter les conditions d'utilisation";
    insertErrorMessage(label, errorMessage);

    errorFlag = false;
  }

  return errorFlag;
};

const firstName = document.getElementById("first");
const lastName = document.getElementById("last");
const email = document.getElementById("email");
const birthDate = document.getElementById("birthdate");
const numberContests = document.getElementById("quantity");

// Prevent form submission before data validation
const form = document.getElementById("form");
form.addEventListener("submit", (event) => {
  event.preventDefault();
});

const submitForm = () => {
  form.style.opacity = 0;
  document.querySelector(".btn-submit").style.display = "none";

  const closeBtn = document.querySelector(".thanks");
  closeBtn.style.display = "block";

  const submit = document.querySelector(".btn-close");
  submit.style.display = "block";
  submit.addEventListener("click", (event) => form.submit());
};

const validate = () => {
  errorMessagesRemove();

  let errorFlags = [];

  errorFlags.push(validateNames(firstName, lastName));
  errorFlags.push(validateEmail(email));
  errorFlags.push(validateBirthDate(birthDate));
  errorFlags.push(validateNbContest(numberContests));
  errorFlags.push(validateCity());
  errorFlags.push(validateTerms());

  const errorFlag = errorFlags.some((b) => b === false);

  if (!errorFlag) submitForm();
};
