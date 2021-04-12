import { Schema, model } from "mongoose";

const ObjectId = Schema.Types.ObjectId;

const MessageSchema = new Schema(
  {
    content: {
      type: String,
      trim: true,
      minLength: 1,
      maxlength: 256,
      required: true,
    },
    from: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
    to: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Message = model("Message", MessageSchema);
export default Message;
