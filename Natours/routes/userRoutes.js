const express = require('express');
const {getAllUsers,addNewUser,getUser,deleteUser,updateUser} = require('./../controllers/userControllers');

const userRouter = express.Router()


userRouter.route("/").get(getAllUsers).post(addNewUser)
userRouter.route("/:id").get(getUser).delete(deleteUser).patch(updateUser)


module.exports = userRouter