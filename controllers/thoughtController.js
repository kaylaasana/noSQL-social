const { User, Thought } = require("../models");

// export Thought functions
module.exports = {
  // get all thoughts and populate associated reactions
  async getThoughts(req, res) {
    try {
      const thoughts = await Thought.find().populate("reaction");
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
      const user = await User.findByIdAndUpdate(
        req.params.userId,
        { $addToSet: { thoughts: newThought._id } },
        { runValidators: true, new: true }
      );
      if (!user) {
        res.status(404).json({ message: "No user with this id!" });
      }

      res.json(newThought);
    } catch (err) {
      res.status(500).json();
    }
  },

  // ```json
  // // example data
  // {
  //   "thoughtText": "Here's a cool thought...",
  //   "username": "lernantino",
  //   "userId": "5edff358a0fcb779aa7b118b"
  // }
  // ```

  // update thought by id and update user thoughts array
  async updateThought(req, res) {
    try {
      const thought = await Thought.findOneAndUpdate({
        _id: req.params.thoughtId,
      });
      if (!thought) {
        res.status(404).json({ message: "No thought with this id!" });
      }
      const user = await User.findByIdAndUpdate(
        req.params.userId,
        { $addToSet: { thoughts: newThought._id } },
        { runValidators: true, new: true }
      );
      if (!user) {
        res.status(404).json({ message: "No user with this id!" });
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
        _id: req.params.userId,
      });

      if (!thought) {
        res.status(404).json({ message: "No thought with this id!" });
      }

      // find and delete associated reactions
      const reaction = await Thought.findByIdAndDelete(
        { user: req.params.userId },
        { $pull: { reaction: req.params.thoughtId } }
      );

      if (!reaction) {
        return res.status(400).json({
          message: "Thought deleted, no reactions found",
        });
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
      const newReaction = await Thought.findOneAndUpdate(
        {
          _id: req.params.thoughtId,
        },
        {
          $addToSet: { reaction: req.body },
        },
        {
          runValidators: true,
          new: true,
        }
      );
      res.json(newReaction);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // * delete reaction by it's ID
  async deleteReaction(req, res) {
    try {
      const reaction = await Thought.findOneAndDelete(
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
