// const { ObjectId } = require("bson");
const { Schema, model } = require("mongoose");

const reactionSchema = new Schema({
  reactionId: {
    type: Schema.Types.ObjectId,
    // default value is set to a new ObjectId
    default: () => new Types.ObjectId(),
  },
  reactionBody: {
    type: String,
    required: true,
    max_length: 280,
  },
  username: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    // format date
    get: (date) => date.toLocalDateString(),
  },
});

const thoughtSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: true,
      min_length: 1,
      max_length: 280,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      // format date
      get: (date) => date.toLocalDateString(),
    },
    username: {
      type: String,
      required: true,
    },
    // array of nested documents
    reaction: [reactionSchema],
  },
  {
    toJSON: {
      virtuals: true,
      getters: true,
    },
  }
);

// find length of reaction array
thoughtSchema.virtual("reactionCount").get(function () {
  // add conditional checking if array is empty
  //  test this!!!!!!!!!!!!
  if (!this.reaction) {
    return "no one cares";
  } else {
    if (this.reaction.length) {
      return this.reaction.length;
    }
  }
});

// initialize Thought model
const Thought = model("thought", thoughtSchema);

module.exports = Thought;
