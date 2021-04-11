import User from "../model/User";
import { isEmail, isPassword } from "../utils";
import { UserInputError, AuthenticationError } from "apollo-server";
import jwt from "jsonwebtoken";

export const getUsers = async (_, __, ctx) => {
  try {
    let user;
    if (ctx.req && ctx.req.headers.authorization) {
      const token = ctx.req.headers.authorization.split("Bearer ")[1];
      jwt.verify(token, process.env.SECRET, (err, decoded) => {
        if (err) throw new AuthenticationError("Unauthorized");
        user = decoded;
      });
    }
    const users = await User.find({ _id: { $ne: user._id } })
      .select("-hashed_password -salt")
      .lean();

    return users;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const register = async (_, args) => {
  let { name, email, password } = args;
  let errors = {};
  try {
    //* validation
    if (!name || name.trim() === "" || name.length < 1 || name.length > 60) {
      errors.name = "Name must be between 1 to 60 letters";
    }

    if (
      !email ||
      email.length < 4 ||
      email.length > 80 ||
      isEmail(email) === false
    ) {
      errors.email = "Email must be between 4 to 80 letters.";
    }

    if (!password || isPassword(password) === false) {
      errors.password =
        "Password must be between 6 to 64 letters and have lowercase, uppercase letters, numbers.";
    }

    //* check user exists
    const checkUsr = await User.findOne({ email }).lean();
    if (checkUsr) {
      errors.user =
        "Can't create account with this email address. Please try other email address.";
    }

    if (Object.keys(errors).length > 0) {
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

export const login = async (_, args) => {
  let errors = {};
  try {
    let { email, password } = args;

    if (email.trim() === "") errors.email = "Email is required";
    if (password === "") errors.password = "Password is required";

    if (Object.keys(errors).length > 0) {
      throw new UserInputError("Bad Input", { errors });
    }

    const usr = await User.findOne({ email });
    if (!usr) {
      errors.user = "User not exists";
      throw new UserInputError("Invalid User", { errors });
    }

    if (usr.authenticate(password) === false) {
      errors.password = "Wrong Password.";
      throw new UserInputError("Wrong Password", { errors });
    }

    let token = jwt.sign({ _id: usr._id }, process.env.SECRET, {
      expiresIn: "1h",
    });
    return {
      ...usr.toJSON(),
      token,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};
