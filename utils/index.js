export const isEmail = (email) => {
  let re = /^[^\s@]+@[^\s@]+$/;
  return re.test(email);
};

export const isPassword = (password) => {
  let re = /(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{6,64}/;
  return re.test(password);
};
