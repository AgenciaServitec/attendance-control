import {Router} from "express";
import {postRegisterUser, postSendVerificationCode, postVerifyCode} from "../controllers";

const router = Router();

router.post("/signup", postRegisterUser);
router.post("/verification-code/send", postSendVerificationCode);
router.post("/verification-code/verify", postVerifyCode);

export default router;
