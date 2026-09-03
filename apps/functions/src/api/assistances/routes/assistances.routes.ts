import express, { Router } from "express";
import {postRegisterFace, postVerifyFace, putFingerprintAssistance} from "../controllers";

const router: Router = express.Router();

router.post("/register-face", postRegisterFace);
router.post("/verify-face", postVerifyFace);
router.put("/fingerprint/:documentNumber", putFingerprintAssistance);

export default router;

export const legacyCSharpRouter = express.Router();
legacyCSharpRouter.put("/assistances/:documentNumber", putFingerprintAssistance);