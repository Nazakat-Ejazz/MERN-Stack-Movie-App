import responseHandler from "../handlers/response.handler.js";

import reviewModel from "../models/review.model.js";

// create
const create = async (req, res) => {
  try {
    const { movieId } = req.params;
    const review = new reviewModel({
      user: req.user.id,
      ...req.body,
    });

    await review.save();

    responseHandler.created(res, {
      ...review._doc,
      id: review.id,
      user: req.user,
    });
  } catch (err) {
    responseHandler.error(err);
  }
};

// remove
const remove = async (req, res) => {
  try {
    const reviewId = req.params;
    const review = reviewModel.finOne({ _id: reviewId, user: req.user.id });
    if (!review) responseHandler.notfound(res);

    await review.remove();

    responseHandler.ok(res);
  } catch (err) {
    responseHandler.error(err);
  }
};

const getReviewsOfUser = async (req, res) => {
  try {
    const review = await reviewModel
      .find({
        user: req.user.id,
      })
      .sort("-createdAt");

    responseHandler.ok(res, review);
  } catch (err) {
    responseHandler.error(err);
  }
};

export default { create, remove, getReviewsOfUser };
