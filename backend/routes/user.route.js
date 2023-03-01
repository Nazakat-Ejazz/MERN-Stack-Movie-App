import express from "express";
import { body } from "express-validator";
import favouriteController from "../controllers/favourite.controller.js";
import userController from "../controllers/user.controller.js";
import requestHandler from "../handlers/request.handler.js";
import userModel from "../models/user.model.js";
import tokenMiddleware from "../middlewares/token.middleware.js";

const router = express.Router();

// signup route
router.post(
  "/signup",
  body("username")
    .exists()
    .withMessage("username is required.")
    .isLength({ min: 8 })
    .withMessage("username must be atleast 8 characters long.")
    .custom(async (value) => {
      const user = await userModel.findOne({ username: value });
      if (user) return Promise.reject("this username is already in use.");
    }),
  body("password")
    .exists()
    .withMessage("password is required.")
    .isLength({ min: 8 })
    .withMessage("password must be atleast 8 characters long."),
  body("confirmPassword")
    .exists()
    .withMessage("confirmPassword is required.")
    .isLength({ min: 8 })
    .withMessage("confirmPassword must be atleast 8 characters long.")
    .custom((value, { req }) => {
      if (value !== req.body.password)
        throw new Error("confirm password is not same as password.");
      return true;
    }),
  body("displayName")
    .exists()
    .withMessage("displayName is required.")
    .isLength({ min: 8 })
    .withMessage("displayName must be atleat 8 characters long."),

  requestHandler.validate,
  userController.signup
);

// signin route
router.post(
  "/signin",
  body("username")
    .exists()
    .withMessage("username is required.")
    .isLength({ min: 8 })
    .withMessage("username must be atleast 8 characters long."),
  body("password")
    .exists()
    .withMessage("password is required.")
    .isLength({ min: 8 })
    .withMessage("Password must be atleast 8 characters long."),
  requestHandler.validate,
  userController.signin
);

// update password
router.put(
  "/update-password",
  tokenMiddleware.auth,
  body("password")
    .exists()
    .withMessage("passsword is required.")
    .isLength({ min: 8 })
    .withMessage("password must be atleast 8 characters long."),
  body("newPassword")
    .exists()
    .withMessage("newPassword is required.")
    .isLength({ min: 8 })
    .withMessage("newPassword must be atleast 8 characters long."),
  body("confirmNewPassword")
    .exists()
    .withMessage("confirmNewPassword is required.")
    .isLength({ min: 8 })
    .withMessage("confirmNewPassword must be atleast 8 characters long.")
    .custom((value, { req }) => {
      if (value !== req.body.password)
        throw new Error("confirm password is not same as password.");
      return true;
    }),
  requestHandler.validate,
  userController.updatePassword
);

// get user's info
router.get("/info", tokenMiddleware.auth, userController.getInfo);

// get favourtie
router.get(
  "/favorites",
  tokenMiddleware.auth,
  favouriteController.getFavouritesOfUser
);

// add to favourite
router.post(
  "/favorites",
  tokenMiddleware.auth,
  body("mediatype")
    .exists()
    .withMessage("mediatype is required.")
    .custom((type) => ["movie", "tv"].includes(type))
    .withMessage("media type is invalid."),
  body("mediaId")
    .exists()
    .withMessage("mediaId is required.")
    .isLength({ min: 1 })
    .withMessage("mediaId can't be empty."),
  body("mediaTitle").exists().withMessage("mediaTitle is required."),
  body("mediaPoster").exists().withMessage("mediaPoster is required."),
  body("mediaRate").exists().withMessage("medaiRate is required"),
  requestHandler.validate,
  favouriteController.addFavourite
);

// delete a favourite
router.delete(
  "/favorites/:favoriteId",
  tokenMiddleware.auth,
  favouriteController.removeFavourite
);
export default router;
