import userModel from "../models/user.model.js";
import JsonWebToken from "jsonwebtoken";
import responseHandler from "../handlers/response.handler.js";

// signup controller
const signup = async (req, res) => {
  try {
    const { username, password, displayName } = req.body;

    const checkUser = userModel.findOne({ username });
    if (!checkUser)
      return responseHandler.badrequest(res, "Username already exists.");

    const user = new userModel();
    user.displayName = displayName;
    user.username = username;
    user.setPassword(password);

    await user.save();

    const token = JsonWebToken.sign(
      {
        data: user.id,
      },
      process.env.TOKEN_SECRET,
      { expiresIn: "24h" }
    );

    responseHandler.created(res, {
      token,
      ...user._doc,
      id: user.id,
    });
  } catch {
    responseHandler.error(res);
  }
};

// signin controller
const signin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await userModel
      .findOne({ username })
      .select("username password salt id displayName");

    if (!user) {
      return responseHandler.badrequest(res, "User not exist");
    }

    if (!user.validPassword(password)) {
      return responseHandler.badrequest(res, "Wrong password");
    }

    user.password = undefined;
    user.salt = undefined;
    const token = JsonWebToken.sign(
      { data: user.id },
      process.env.TOKEN_SECRET,
      { expiresIn: "24h" }
    );

    responseHandler.created(res, {
      token,
      ...user._doc,
      id: user.id,
    });
  } catch (err) {
    responseHandler.error(err);
  }
};

// update password
const updatePassword = async (req, res) => {
  try {
    const { password, newPassword } = req.body;
    const user = userModel.findOne(req.user.id).select("password id salt");

    if (!user) {
      return responseHandler.unauthorized(res);
    }

    if (!user.validPassword(password)) {
      responseHandler.badrequest(res, "Wrong password");
    }

    user.setPassword = newPassword;
    await user.save();

    responseHandler.ok(res);
  } catch (err) {
    responseHandler.error(res);
  }
};

// get a user info using id
const getInfo = async (req, res) => {
  try {
    const user = userModel.findById(req.user.id);

    if (!user) return responseHandler.notFound(res);

    responseHandler.ok(res, user);
  } catch (err) {
    responseHandler.error(err);
  }
};

export default { signin, signup, updatePassword, getInfo };
