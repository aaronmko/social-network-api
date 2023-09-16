const { User, Thought } = require('../models');

module.exports = {
    // Get all users
    getUsers (req, res) {
        User.find()
            .then((users) => {
                return res.json(users);
            })
            .catch((err) => {
                console.log(err);
                return res.status(500).json(err);
            });
    },

    getSingleThought (req, res) {
        Thought.findOne({ _id: req.params.thoughtId })
            .select('-__v')
            .then((thought) =>
                !thought
                    ? res.status(404).json({ message: 'No thought with this id found' })
                    : res.json(thought)
            )
            .catch((err) => {
                console.log(err);
                return res.status(500).json(err);
            });
    },

    createUser (req, res) {
        User.create(req.body)
            .then((user) => {
                return res.json(user)
            })
            .catch((err) => {
                return res.status(500).json(err)
            });
    },

    updateUser (req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $set: req.body },
            { runValidators: true, new: true }
        )
            .then((user) =>
                !user
                    ? res.status(404).json({ message: 'No user with this id found' })
                    : res.json({
                        updatedUser: user,
                        message: 'User updated'
                    })
            )
            .catch((err) => {
                console.log(err);
                return res.status(500).json(err);
            });
    },

    deleteUser (req, res) {
        User.findOneAndDelete({ _id: req.params.userId })
            .then((user) => {
                if (!user) {
                    res.status(404).json({ message: 'No user with this id found' })
                }
                // Remove a user's associated thoughts when deleted
                Thought.deleteMany({ _id: { $in: user.thoughts } })
                return res.json({
                    deletedUser: user,
                    message: 'User and associated thoughts deleted'
                });
            })
            .catch((err) => {
                console.log(err);
                return res.status(500).json(err);
            });
    },

    addFriend (req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $addToSet: { friends: req.params.friendId } },
            { runValidators: true, new: true }
        )
            .then((user) =>
                !user
                    ? res.status(404).json({ message: 'No user with this id found' })
                    : res.json({
                        updatedUser: user,
                        message: 'Friend added'
                    })
            )
            .catch((err) => {
                return res.status(500).json(err)
            });
    },
