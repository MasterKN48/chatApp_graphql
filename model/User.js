import { Schema, model } from "mongoose";
import { randomBytes, scryptSync } from "crypto";

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 1,
      trim: true,
      maxlength: 60,
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      minlength: 4,
      maxlength: 100,
    },
    hashed_password: {
      type: String,
      minlength: 6,
      maxlength: 256,
    },
    salt: String,
  },
  {
    timestamps: true,
  }
);

UserSchema.virtual("password")
  .set(function (password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });

UserSchema.methods = {
  encryptPassword: function (password) {
    if (!password) throw new Error("Must provided password");
    try {
      return scryptSync(password, this.salt, 48).toString("hex");
    } catch (err) {
      throw err;
    }
  },
  makeSalt: function () {
    let extra = randomBytes(8).toString("hex");
    return Math.round(new Date().valueOf() * Math.random() + "") + "" + extra;
  },
  authenticate: function (plainPassword) {
    // matching hash values
    return this.encryptPassword(plainPassword) === this.hashed_password;
  },
};

UserSchema.index({ email: 1 }, { unique: true, background: true });
const User = model("User", UserSchema);
export default User;
