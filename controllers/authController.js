const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  const { email, username, password } = req.body;

  //OR
  // const email = req.body.email;
  // const username = req.body.username;
  // const password = req.body.password;

  //Check if all fields are present / available
  if (!email || !username || !password) {
    return res.status(400).send("Please provide all fields.");
  }

  //Check if username / email is already in database
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).send("Email already exists.");
  }

  //Hashing of password
  const hashedPassword = await bcrypt.hash(password, 12);

  //Create a new user
  const user = await User.create({ email, username, password: hashedPassword });

  //generate a token
  const token = jwt.sign({ id: user._id }, "123456789", { expiresIn: "1h" });

  //return response
  res.status(201).json({ token });
};



const login = async (req, res) => {
  const { email, password } = req.body;

  //Check if user is in the database
  let user = await User.findOne({ email });
  if (!user) {
    return res.status(400).send("Invalid Credentials.");
  }

  //Compare password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).send("Invalid Credentials.");
  }

  //generate token
  const token = jwt.sign({ id: user._id }, "123456789", { expiresIn: "1h" });

  //return response
  res.status(200).json({ token });
};

const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(401).json({ message: "Not Authorized." });
  }

  // console.log(token)
  
  token = token.split(" ")[1];

  try {
    let user = jwt.verify(token, "123456789");
    req.user = user.id;
    return next();
  } catch (error) {
    res
      .status(401)
      .json({ message: "Invalid token, verify you are not a robot" });
  }
  next();
};

module.exports = {
  register,
  login,
  verifyToken,
};
