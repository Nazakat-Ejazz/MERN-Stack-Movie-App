import responseHandler from "../handlers/response.handler.js";

import tmdbApi from "../tmdb/tmdb.api.js";

// get person details
const personDetails = async (req, res) => {
  try {
    const { personId } = req.params;

    const person = await tmdbApi.personDetails({ personId });

    responseHandler.ok(res, person);
  } catch (err) {
    responseHandler.error(err);
  }
};

// personMedia
const personMedias = async (req, res) => {
  try {
    const { personId } = req.params;
    const medias = await tmdbApi.personMedias({ personId });
    responseHandler.ok(res, medias);
  } catch (err) {
    responseHandler.error(err);
  }
};

export default { personDetails, personMedias };
