const bcrypt = require("bcrypt"); /* to hash and verify passwords*/
const userModel = require("../models/user");

/*
CREATE USER
@POST
*/
const createUser = async (req, res) => {
  const { fullname, email, password } = req.body;

  let regExFirstName = /^[a-zA-Z]+(?:[\s.]+[a-zA-Z]+)*$/;
  let regExEmail = /[a-z]+@[northeastern]+\.(edu)$/;
  let regExPassword = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

  if (!regExFirstName.test(fullname)) {
    res.status(500).json({
      message: "Enter Valid FullName!(Spaces between two words are allowed!)",
    });
  } else if (!regExEmail.test(email)) {
    res.status(500).json({ message: "Enter Valid Email(@northeastern.edu)!" });
  } else if (!regExPassword.test(password)) {
    res.status(500).json({
      message:
        "Enter Valid Password(Atleast 8 characters, Atleast 1 capital letter, Atleast 1 small letter, Atleast 1 special character)!",
    });
  } else {
    try {
      const existingUser = await userModel.findOne({ email: email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists!" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const result = await userModel.create({
        fullname: fullname,
        email: email,
        password: hashedPassword,
      });

      res
        .status(201)
        .json({ message: "User Created Successfully!", user: result });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Something went wrong!" });
    }
  }
};

/*
UPDATE USER
@PUT
*/
const updateUser = async (req, res) => {
  const { fullname, email, password } = req.body;

  let regExFirstName = /^[a-zA-Z]+(?:[\s.]+[a-zA-Z]+)*$/;
  let regExEmail = /[a-z]+@[northeastern]+\.(edu)$/;
  let regExPassword = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

  if (!regExFirstName.test(fullname)) {
    res.status(500).json({
      message: "Enter Valid FullName!(Spaces between two words are allowed!)",
    });
  } else if (!regExEmail.test(email)) {
    res.status(500).json({ message: "Enter Valid Email(@northeastern.edu)!" });
  } else if (!regExPassword.test(password)) {
    res.status(500).json({
      message:
        "Enter Valid Password(Atleast 8 characters, Atleast 1 capital letter, Atleast 1 small letter, Atleast 1 special character)!",
    });
  } else {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      fullname: fullname,
      password: hashedPassword,
    };

    try {
      const returnedNewUser = await userModel.findOneAndUpdate(
        { email: email },
        newUser,
        { new: true }
      );
      if (returnedNewUser != null) {
        res
          .status(200)
          .json({
            message: "User Updated Successfully!",
            updatedUser: newUser,
          });
      }else{
        res.status(500).json({ message: "Email Not Found!" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Something went wrong!" });
    }
  }
};

/*
DELETE USER
@DELETE
*/
const deleteUser = async (req, res) => {
  const { email } = req.body;

  let regExEmail = /[a-z]+@[northeastern]+\.(edu)$/;

  if (!regExEmail.test(email)) {
    res.status(500).json({ message: "Enter Valid Email(@northeastern.edu)!" });
  } else {
    try {
      const userToDelete = await userModel.findOneAndDelete({ email: email });
      if (userToDelete != null) {
        res
          .status(202)
          .json({
            message: "User Deleted Successfully!",
            deletedUser: userToDelete,
          });
      } else {
        res.status(500).json({ message: "Email Not Found!" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Something went wrong!" });
    }
  }
};

/*
GET ALL USER
@GET
*/
const getAllUsers = async (req, res) => {

    try {
        const notes = await userModel.find({})
        res.status(200).json(notes)
    } catch (error) {
        console.log(error);
      res.status(500).json({ message: "Something went wrong!" });
    }


};

module.exports = { createUser, updateUser, deleteUser, getAllUsers };
