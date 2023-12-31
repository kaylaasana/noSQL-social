const { User } = require("../models");

// export User functions
module.exports = {
  // get all users and populate friends and thoughts
  async getUsers(req, res) {
    try {
      const users = await User.find().populate('friends').populate('thoughts')
      res.json(users);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // get one user by id and populate thought and friends data
  async getOneUser(req, res) {
    try {
      const user = await User.findOne({ _id: req.params.userId })
        // filter out unnecessary data
        .select("-__v")
        .populate("thoughts")
        .populate("friends");

      if (!user) {
        return res.status(404).json({ message: "No user with that ID" });
      }

      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // create a new user
  async createUser(req, res) {
    try {
      const user = await User.create(req.body);
      res.json(user);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },
  
  // update a user by their id
  async updateUser(req, res) {
    try {
      const updatedUser = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $set: req.body },
        {
          // check that the fields match
          runValidators: true,
          // return new data
          new: true,
        }
      );

      if (!updatedUser) {
        res.status(404).json({ message: "No user with this id!" });
      }
      res.json(updatedUser);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // delete user by their id
  async deleteUser(req, res) {
    try {
      const user = await User.findOneAndDelete({ _id: req.params.userId });

      if (!user) {
        res.status(404).json({ message: "No user with this id!" });
      }

      // **BONUS**: Remove a user's associated thoughts when deleted.
      // find and delete associated thoughts
      // const thought = await Thought.deletesomehinggiasdfkjd(
      //   req.params.thoughtId,
      //   { $pull: { thoughts: req.params.thoughtId } }
      // );

      // if (!thought) {
      //   return res.status(400).json({
      //     message: "User deleted, no thoughts found",
      //   });
      // }

      res.json({ message: "User successfully deleted" });
    } catch (err) {
      res.status(500).json(err);
    }
  },
  
  // add a new friend to user's friend list
  async addFriend(req, res) {
    try {
      const newFriend = await User.findOneAndUpdate(
        { _id: req.params.userId },
        // push method
        { $addToSet: { friends: req.params.friendId } },
        {
          runValidators: true,
          new: true,
        }
      );
      res.json(newFriend);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // remove a friend from a user's friend list
  // pull method
  async removeFriend(req, res) {
    try {
      const friend = await User.findOneAndUpdate(
        { _id: req.params.userId },
        // remove friend from friends array
        { $pull: { friends: { friendId: req.params.friendId } } },
        { runValidators: true, new: true }
      );

      if (!friend) {
        res.status(404).json({ message: "No user with this id!" });
      }

      res.json({ message: "Friend successfully removed" });
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
