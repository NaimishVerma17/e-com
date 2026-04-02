import { Router } from "express";

import * as ItemController from "../controllers/item.controller";
import { asyncMiddleware } from "../utils/common.util";

const router = Router();

router.get("/", asyncMiddleware(ItemController.getAllItems));
router.get("/:itemId", asyncMiddleware(ItemController.getItemById));

export default router;
