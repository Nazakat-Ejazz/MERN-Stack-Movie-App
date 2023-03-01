import express from "express";
import mediaController from "../controllers/media.controller.js";

const router = express.Router();

router.get("/search", mediaController.search);
router.get("/genres", mediaController.getGenres);
router.get("/detail/:mediaId", mediaController.getDetails);
router.get("/:mediaCategory", mediaController.getList);

export default router;
