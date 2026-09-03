import { Request, Response } from "express";
import { firestore } from "../../../_firebase";
import admin from "firebase-admin";

export const postVerifyCode = async (req: Request, res: Response) => {
  const { dni, code } = req.body;

  try {
    const now = new Date();

    const querySnapshot = await firestore
      .collection("verificationCodes")
      .where("dni", "==", dni)
      .where("code", "==", code)
      .where("isUsed", "==", false)
      .where("expiresAt", ">", now)
      .limit(1)
      .get();

    if (querySnapshot.empty) {
      return res.status(400).json({
        success: false,
        error:
          "El código ingresado es incorrecto, ya fue utilizado o ha expirado.",
      });
    }

    const validCodeDoc = querySnapshot.docs[0];

    const userSnapshot = await firestore
      .collection("users")
      .where("isDeleted", "==", false)
      .where("document.number", "==", dni)
      .limit(1)
      .get();

    if (userSnapshot.empty) {
      return res.status(404).json({
        success: false,
        error: "El usuario asociado a este documento no fue encontrado.",
      });
    }

    const userDoc = userSnapshot.docs[0];
    const userData = userDoc.data();

    const firebaseUid = userData.firebaseAuthUid || userDoc.id;

    await validCodeDoc.ref.update({
      isUsed: true,
      updatedAt: now,
    });

    const customToken = await admin.auth().createCustomToken(firebaseUid);

    console.log(
      `「OTP & Custom Token Verified successfully」DNI: ${dni} | UID: ${firebaseUid}`,
    );

    return res.status(200).json({
      success: true,
      message: "Identidad verificada con éxito.",
      token: customToken,
    });
  } catch (e) {
    console.error("「OTP Verification Error」", e);
    return res.status(500).json({
      success: false,
      error: "Error interno al validar el código de seguridad.",
    });
  }
};
