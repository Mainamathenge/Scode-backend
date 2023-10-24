const Todo = require("../models/todoModel");
const factory = require("./handlerFactory");

exports.createTodo = factory.createOne(Todo);
exports.getTodo = factory.getOne(Todo);
exports.getAllTodos = factory.getAll(Todo);
exports.updateTodo = factory.updateOne(Todo);
exports.deleteTodo = factory.deleteOne(Todo);
