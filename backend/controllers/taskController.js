const asyncHandler = require('express-async-handler');
const Task = require('../models/taskModel');
const User = require('../models/userModel');

// @desc    Get Tasks
// @route   GET /api/tasks
// @access  Private
const getTasks = asyncHandler(async (req, res) => {
    const tasks = await Task.find({ user: req.user._id });

    res.status(200).json(tasks);
});

// @desc    Create Task
// @route   POST /api/tasks
// @access  Private
const setTask = asyncHandler(async (req, res) => {
    if (!req.body.text) {
        res.status(400);
        throw new Error('Please enter a task');
    }

    const task = await Task.create({
        text: req.body.text,
        user: req.user._id,
    });

    res.status(201).json(task);
});

// @desc    Update Task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = asyncHandler(async (req, res) => {
    const task = await Task.findById(req.params.id);

    if (!task) {
        res.status(404);
        throw new Error('Task not found');
    }

    const user = await User.findById(req.user._id);

    if (!user) {
        res.status(401);
        throw new Error('User not found');
    }

    // Make sure the logged-in user owns the task
    if (task.user.toString() !== user._id) {
        res.status(401);
        throw new Error('User is not authorized to update this task');
    }

    const updatedTask = await Task.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true,
            runValidators: true,
        }
    );

    res.status(200).json(updatedTask);
});

// @desc    Delete Task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = asyncHandler(async (req, res) => {
    const task = await Task.findById(req.params.id);

    if (!task) {
        res.status(404);
        throw new Error('Task not found');
    }

    const user = await User.findById(req.user._id);

    if (!user) {
        res.status(401);
        throw new Error('User not found');
    }

    // Make sure the logged-in user owns the task
    if (task.user.toString() !== user._id) {
        res.status(401);
        throw new Error('User is not authorized to delete this task');
    }

    await task.deleteOne();

    res.status(200).json({
        id: req.params.id,
        message: 'Task deleted successfully',
    });
});

module.exports = {
    getTasks,
    setTask,
    updateTask,
    deleteTask,
};