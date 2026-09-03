import { Request, Response } from "express";
import { firestore } from "../../../_firebase";
import { defaultFirestoreProps } from "../../../utils";

type FingerName =
  | "leftThumb"
  | "leftIndex"
  | "leftMiddle"
  | "leftRing"
  | "leftPinky"
  | "rightThumb"
  | "rightIndex"
  | "rightMiddle"
  | "rightRing"
  | "rightPinky";

interface FingerData {
  template: string;
  image?: string;
}

interface Body {
  biometrics: Partial<Record<FingerName, FingerData>>;
}

interface Params {
  documentNumber: string;
}

const { assignUpdateProps } = defaultFirestoreProps();

export const putUserFingerprintTemplate = async (
  req: Request<Params, unknown, Body, unknown>,
  res: Response,
): Promise<void> => {
  const { documentNumber } = req.params;
  const { biometrics: newBiometrics } = req.body;

  try {
    const usersSnapshot = await firestore
      .collection("users")
      .where("isDeleted", "==", false)
      .where("document.number", "==", documentNumber)
      .limit(1)
      .get();

    if (usersSnapshot.empty) {
      res
        .status(404)
        .json({ error: "Usuario no encontrado en la base de datos." });
      return;
    }

    const userDoc = usersSnapshot.docs[0];
    const userData = userDoc.data();

    const currentBiometrics = userData.biometrics || {};
    const updatedBiometrics = {
      ...currentBiometrics,
      ...newBiometrics,
    };

    const payload = assignUpdateProps({
      biometrics: updatedBiometrics,
    });

    await userDoc.ref.update(payload as any);

    res.json({
      success: true,
      message: "Huellas biométricas sincronizadas correctamente.",
    });
  } catch (error) {
    console.error("Error actualizando huellas:", error);
    res
      .status(500)
      .json({ error: "Error interno del servidor al procesar huellas." });
  }
};
