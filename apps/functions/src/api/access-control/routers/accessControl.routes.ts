import express, { Router } from "express";

import {
    getAccessControls,
    getAccessControl,
    postAccessControl,
    putAccessControl,
    getAccessPoints
} from "../controllers";

const router: Router = express.Router();

router.get("/", getAccessControls);
router.post("/", postAccessControl);
router.get("/points", getAccessPoints);

router.get("/:id", getAccessControl);
router.put("/:id", putAccessControl);

export default router;