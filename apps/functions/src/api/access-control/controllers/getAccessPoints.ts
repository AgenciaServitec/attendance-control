import { NextFunction, Request, Response } from "express";
import { firestore } from "../../../_firebase";

export const getAccessPoints = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    console.log("「Get access points」Initialize");

    try {
        const accessPointsSnapshot = await firestore
            .collection("accessPoints")
            .where("isDeleted", "==", false)
            .where("type", "==", "pedestrian")
            .get();

        const accessPoints = accessPointsSnapshot.docs.map((doc) => doc.data());
        res.json(accessPoints);
    } catch (error) {
        console.error("Error al obtener puntos de acceso:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};