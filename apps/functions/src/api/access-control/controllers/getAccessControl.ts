import { NextFunction, Request, Response } from "express";
import { firestore } from "../../../_firebase";

export const getAccessControl = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const { id } = req.params;

    try {
        const docRef = await firestore.collection("accessControl").doc(id).get();

        if (!docRef.exists) {
            res.status(404).json({ error: "Control de acceso no encontrado" });
            return;
        }

        res.json(docRef.data());
    } catch (error) {
        console.error("Error al obtener control de acceso:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};