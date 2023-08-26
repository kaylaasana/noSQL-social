const { User, Thought } = require("../models");

// export Thought functions
module.exports = {
  // get all thoughts and populate associated reactions
  async getThoughts(req, res) {
    try {
      const thoughts = await Thought.find()
      res.json(thoughts);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // get one thought and it's associated reactions
  async getOneThought(req, res) {
    try {
      const thought = await Thought.findOne({ _id: req.params.thoughtId })
        .select("-__v")
        .populate("reaction");

      if (!thought) {
        return res.status(404).json({ message: "No thought with that ID" });
      }

      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // create thought and add to associated user thoughts array
  async createThought(req, res) {
    try {
      const newThought = await Thought.create(req.body);
      console.log(newThought)
      const user = await User.findByIdAndUpdate(
        req.params.userId,
        { $addToSet: { thoughts: newThought._id } },
        { runValidators: true, new: true }
      );
      console.log(user)
      if (!user) {
        res.status(404).json({ message: "No user with this id!" });
      }

      res.json(newThought);
    } catch (err) {
      console.log(err)
      res.status(500).json();
    }
  },
  
  // update thought by id
  async updateThought(req, res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $set: req.body },
        {
          // check that the fields match
          runValidators: true,
          // return new data
          new: true,
        }
      );
      if (!thought) {
        res.status(404).json({ message: "No thought with this id!" });
      }

      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // delete thought by it's ID
  async deleteThought(req, res) {
    try {
      const thought = await Thought.findOneAndDelete({
        _id: req.params.thoughtId,
      });

      if (!thought) {
        res.status(404).json({ message: "No thought with this id!" });
      }

      res.json({ message: "Thought successfully deleted" });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // **`/api/thoughts/:thoughtId/reactions`**

  // * create new reactions
  async addReaction(req, res) {
    try {
      console.log(req)
      const newReaction = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $addToSet: { reaction: req.body } },
        {
          runValidators: true,
          new: true,
        }
      );
      console.log(newReaction)
      res.json(newReaction);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // * delete reaction by it's ID
  async deleteReaction(req, res) {
    try {
      const reaction = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        // remove reaction from reaction array
        { $pull: { reaction: { reactionId: req.params.reactionId } } },
        { runValidators: true, new: true }
      );

      if (!reaction) {
        res.status(404).json({ message: "No reaction with this id!" });
      }

      res.json({ message: "Reaction successfully deleted" });
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
