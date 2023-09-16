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