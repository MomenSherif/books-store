function isValidEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function isValidName(name) {
  const re = /^[\w ]{4,20}$/;
  return re.test(name);
}

function isValidDate(date) {
  const re = /^[0-9]{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/;
  return re.test(date);
}

function isValidPrice(price) {
  const re = /^\d+$/;
  return re.test(price);
}
export { isValidEmail, isValidName, isValidDate, isValidPrice };