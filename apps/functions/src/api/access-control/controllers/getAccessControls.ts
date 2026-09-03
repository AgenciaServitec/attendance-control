import { NextFunction, Request, Response } from "express";
import { firestore } from "../../../_firebase";

export const getAccessControls = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    console.log("「Get access controls」Initialize");

    try {
        const accessControlsSnapshot = await firestore
            .collection("accessControl")
            .orderBy("entryDateTime", "desc")
            .get();

        const accessControls = accessControlsSnapshot.docs.map((doc) => doc.data());
        res.json(accessControls);
    } catch (error) {
        console.error("Error al obtener controles de acceso:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};