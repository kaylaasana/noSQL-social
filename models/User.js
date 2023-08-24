const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      // checking if the email input matches an email format (check if correct, not sure that this is right)
      match: "/^([a-z0-9_.-]+)@([da-z.-]+).([a-z.]{2,6})$/",
    },
    thoughts: [
      {
        type: Schema.Types.ObjectId,
        ref: "thought",
      },
    ],
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
    ],
  },
  {
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);

// find length of friends array
userSchema.virtual("friendCount").get(function () {
  // add conditional checking if array is empty
  return this.friends.length;
});

// initialize User model
const User = model("user", userSchema);

module.exports = User;