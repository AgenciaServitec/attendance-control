import { Request, Response } from "express";
import { defaultFirestoreProps } from "../../../utils";
import { sendMailVerificationCode } from "../../../mailer/servitec-peru";
import { firestore } from "../../../_firebase";

export const postSendVerificationCode = async (req: Request, res: Response) => {
  const { body } = req;
  const { assignCreateProps } = defaultFirestoreProps();

  try {
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();

    const createdAt = new Date();
    const expiresAt = new Date(createdAt.getTime() + 5 * 60 * 1000);

    const newAuthCode = {
      dni: body.dni,
      code: verificationCode,
      email: body.email,
      logoUrl:
        "https://storage.googleapis.com/gob-regional-callao.firebasestorage.app/logo-region-callao.png",
      isUsed: false,
      expiresAt,
    };

    console.log(
      `「OTP Generated」DNI: ${body.dni} | Channel: email | Expires: ${expiresAt.toISOString()}`,
    );

    const oldCodesSnapshot = await firestore
      .collection("verificationCodes")
      .where("dni", "==", body.dni)
      .where("isUsed", "==", false)
      .get();

    if (!oldCodesSnapshot.empty) {
      const batch = firestore.batch();
      oldCodesSnapshot.docs.forEach((doc) => {
        batch.update(doc.ref, { isUsed: true });
      });
      await batch.commit();
    }

    const codeRef = firestore.collection("verificationCodes").doc();
    await codeRef.set(assignCreateProps(newAuthCode));

    await sendMailVerificationCode({
      email: body.email,
      fullName: body.fullName,
      verificationCode,
      logoUrl: newAuthCode.logoUrl,
    }).catch((mailError) => {
      console.error("「Background OTP Mail Error」", mailError);
    });

    return res.status(200).json({
      success: true,
      message: "Código de seguridad enviado correctamente al correo.",
    });
  } catch (e) {
    console.error("「OTP Send Error」", e);
    return res.status(500).json({
      success: false,
      error: "Error interno al procesar el código de verificación.",
    });
  }
};
