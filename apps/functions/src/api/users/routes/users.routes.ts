import express, { Router } from "express";

import {getUser, getUsers, postUser, putUser, getUserByDocument, putUserFingerprintTemplate} from "../controllers";

const router: Router = express.Router();

router.get("/", getUsers);
router.get("/:userId", getUser);
router.post("/", postUser);
router.put("/:userId", putUser);
router.get("/cip/:documentNumber", getUserByDocument);
router.put("/:documentNumber/fingerprint", putUserFingerprintTemplate);

export default router;
