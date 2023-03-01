import favouriteModel from "../models/favourite.models.js";
import responseHandler from "../handlers/response.handler.js";

// add to favourite
const addFavourite = async (req, res) => {
  try {
    const isFavourite = await favouriteModel.findOne({
      user: req.user.id,
      mediaId: req.body.mediaId,
    });

    if (isFavourite) return responseHandler.ok(res, isFavourite);

    const favourite = new favouriteModel({
      ...req.body,
      user: req.user.id,
    });

    await favouriteModel.save();

    responseHandler.created(req, favourite);
  } catch (err) {
    responseHandler.error(err);
  }
};

// remove from favourite
const removeFavourite = async (req, res) => {
  try {
    const { favouriteId } = req.params;

    const favourite = await favouriteModel.findOne({
      user: req.user.id,
      _id: favouriteId,
    });

    if (!favourite) return responseHandler.notfound(res);

    await favourite.remove();

    responseHandler.ok(res);
  } catch (err) {
    responseHandler.error(err);
  }
};

// get favourite
const getFavouritesOfUser = async (req, res) => {
  try {
    const favouriteList = await favouriteModel
      .find({ user: req.user.id })
      .sort("-createdAt");

    responseHandler.ok(res, favouriteList);
  } catch (err) {
    responseHandler.error(err);
  }
};

export default { addFavourite, removeFavourite, getFavouritesOfUser };
