import { NextFunction, Request, Response } from "express";
import { firestore } from "../../../_firebase";
import { defaultFirestoreProps } from "../../../utils";

export const putAccessControl = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const { assignUpdateProps } = defaultFirestoreProps();
    const { id } = req.params;
    const body = req.body;

    console.log(`「Update Access Control」Initialize ID: ${id}`, body);

    try {
        const docRef = firestore.collection("accessControl").doc(id);
        const doc = await docRef.get();

        if (!doc.exists) {
            res.status(404).json({ error: "Control de acceso no encontrado" });
            return;
        }

        await docRef.update(assignUpdateProps({ ...body }));

        res.sendStatus(200).end();
    } catch (error) {
        console.error("Error al actualizar control de acceso:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};