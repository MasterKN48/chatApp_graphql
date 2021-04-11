import User from "../model/User";
import { isEmail, isPassword } from "../utils";
import { UserInputError } from "apollo-server";

export const getUsers = async () => {
  try {
    const usrs = await User.find({}).select("-password").lean();
    return usrs;
  } catch (error) {
    console.log(error);
  }
};

export const register = async (_, args) => {
  let { name, email, password } = args;
  let errors = [];
  try {
    //* validation
    if (!name || name.length < 1 || name.length > 60) {
      errors.push({ name: "Name must be between 1 to 60 letters" });
    }

    if (
      !email ||
      email.length < 4 ||
      email.length > 80 ||
      isEmail(email) === false
    ) {
      errors.push({ email: "Email must be between 4 to 80 letters." });
    }

    if (!password || isPassword(password) === false) {
      errors.push({
        password:
          "Password must be between 6 to 64 letters and have lowercase, uppercase letters, numbers.",
      });
    }

    //* check user exists
    const checkUsr = await User.findOne({ email }).lean();
    if (checkUsr) {
      errors.push({
        email:
          "Can't create account with this email address. Please try other email address.",
      });
    }

    if (errors.length > 0) {
      throw errors;
    }

    //* create user
    const usr = await User.create({ name, email, password });
    return usr;
  } catch (error) {
    console.log(error);
    throw new UserInputError("Bad Input", { errors });
  }
};
