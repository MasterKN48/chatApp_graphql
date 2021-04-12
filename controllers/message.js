import Message from "../model/Message";
import User from "../model/User";
import { AuthenticationError, UserInputError, withFilter } from "apollo-server";

export const sendMessage = async (_, { to, content }, { user, pubsub }) => {
  try {
    if (!user) throw new AuthenticationError("Unauthorized");

    const reciever = await User.findOne({ _id: to }).lean();
    if (!reciever) {
      throw new UserInputError("User not found");
    } else if (to == user._id) {
      throw new UserInputError("You can't message yourself.");
    }

    if (content.trim() === "" || content.length > 256) {
      throw new UserInputError(
        "Message is empty, it must be between 1 to 256 letters."
      );
    }

    const message = await Message.create({
      from: user._id,
      to,
      content,
    });
    pubsub.publish("NEW_MESSAGE", { newMessage: message });
    return message;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getMessages = async (_, { to }, { user }) => {
  try {
    if (!user) throw new AuthenticationError("Unauthorized");
    const otherUser = await User.findOne({ _id: to })
      .select("-hashed_password -salt")
      .sort({ createdAt: -1 })
      .lean();

    if (!otherUser) {
      throw new UserInputError("user not found");
    }

    const messages = await Message.find({
      from: { $in: [user._id, to] },
      to: { $in: [user._id, to] },
    }).lean();
    return messages;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const newMessage = {
  subscribe: withFilter(
    //? only valid to and from user shoudl get this update not all users
    (_, __, { pubsub, user }) => {
      if (!user) {
        throw new AuthenticationError("Unauthenticated");
      }
      return pubsub.asyncIterator(["NEW_MESSAGE"]);
    },
    ({ newMessage }, _, { user }) => {
      if (newMessage.from == user._id || newMessage.to == user._id) {
        return true;
      } else {
        return false;
      }
    }
  ),
};
