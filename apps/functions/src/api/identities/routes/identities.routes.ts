import express, { Router } from "express";

import { getDataByDni, getDataByRuc } from "../controllers";

const router: Router = express.Router();

router.get("/dni/:documentNumber", getDataByDni);
router.get("/ruc/:documentNumber", getDataByRuc);

export default router;
