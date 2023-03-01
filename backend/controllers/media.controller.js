import responseHandler from "../handlers/response.handler.js";
import tmdbApi from "../tmdb/tmdb.api.js";
import userModel from "../models/user.model.js";
import favouriteModel from "../models/favourite.models.js";
import reviewModel from "../models/review.model.js";
import tokenMiddleware from "../middlewares/token.middleware.js";

// get list
const getList = async (req, res) => {
  try {
    const { page } = req.query;
    const { mediaType, mediaCategory } = req.params;

    const response = await tmdbApi.mediaList({
      mediaType,
      mediaCategory,
      page,
    });

    return responseHandler.ok(res, response);
  } catch (err) {
    responseHandler.error(err);
  }
};

// get genres
const getGenres = async (req, res) => {
  try {
    const { mediaType } = req.params;
    const response = await tmdbApi.mediaGenres({ mediaType });

    return responseHandler.ok(res, response);
  } catch (err) {
    responseHandler.error(err);
  }
};

// search
const search = (req, res) => {
  try {
    const { mediaType } = req.params;
    const { query, page } = req.query;

    const response = tmdbApi.mediaSearch({
      mediaType: mediaType === "people" ? "person" : mediaType,
      query,
      page,
    });

    responseHandler.ok(res, response);
  } catch (err) {
    responseHandler.error(err);
  }
};

//get details
const getDetails = async (req, res) => {
  try {
    const { mediaType, mediaId } = req.params;

    // creating params for credit req that need for media
    const params = { mediaType, mediaId };

    const media = await tmdbApi.mediaDetail(params);
    media.credits = await tmdbApi.mediaCredits(params);
    const videos = await tmdbApi.mediaVideos(params);
    media.videos = videos;
    const recommended = await tmdbApi.mediaRecommend(params);
    media.recommend = recommended.result;

    media.images = await tmdbApi.mediaImages(params);

    const tokenDecode = tokenMiddleware.tokenDecode(req);

    if (tokenDecode) {
      const user = await userModel.findById(tokenDecode.data);

      if (user) {
        const isFavourite = await favouriteModel.findOne({
          user: user.id,
          mediaId,
        });
        media.isFavourite = isFavourite !== null;
      }
    }

    media.reviews = await reviewModel
      .find({ mediaId })
      .populate("user")
      .sort("-createdAt");

    responseHandler.ok(res, media);
  } catch (err) {
    responseHandler.error(err);
  }
};

export default { getList, getGenres, search, getDetails };
