import * as express from "express";
import EntityController from "./EntityController";

const router = express.Router();
router.route("/").post(EntityController.createEntity);

export default router;
