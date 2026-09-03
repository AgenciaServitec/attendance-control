import { Request, Response } from "express";
import { firestore } from "../../../_firebase";

interface Params {
    documentNumber: string;
}

export const getUserByDocument = async (
    req: Request<Params>,
    res: Response
): Promise<void> => {
    const { documentNumber } = req.params;

    try {
        const usersSnapshot = await firestore
            .collection("users")
            .where("isDeleted", "==", false)
            .where("document.number", "==", documentNumber)
            .limit(1)
            .get();

        if (usersSnapshot.empty) {
            res.status(404).json({ error: "Usuario no encontrado" });
            return;
        }

        const userData = usersSnapshot.docs[0].data();

        res.json({
            user: {
                firstName: userData.firstName || "",
                paternalSurname: userData.paternalSurname || "",
                maternalSurname: userData.maternalSurname || ""
            },
            message: "Usuario encontrado"
        });

    } catch (error) {
        console.error("Error al buscar usuario por documento:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};