import { NextFunction, Request, Response } from "express";
import { firestore } from "../../../_firebase";
import { defaultFirestoreProps } from "../../../utils";
import { fetchUserByDocument } from "../../../_firebase/collections";

interface AccessPointPayload {
    id: string;
    method: string;
    name: string;
    origin: string;
    type: string;
}

interface PostAccessControlBody {
    documentNumber: string;
    name?: string;
    timestamp: string;
    type?: string;
    accessPoint: AccessPointPayload;
}

export const postAccessControl = async (
    req: Request<unknown, unknown, PostAccessControlBody>,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const { assignCreateProps, assignUpdateProps } = defaultFirestoreProps();

    const {
        documentNumber,
        name,
        timestamp,
        accessPoint,
        type,
    } = req.body;

    console.log("「Add/Update Access Control」Initialize", req.body);

    try {
        const dateObj = new Date(timestamp.replace(" ", "T") + "-05:00");
        const dbFormattedDate = dateObj.toISOString();

        const activeLogsSnapshot = await firestore
            .collection("accessControl")
            .where("documentNumber", "==", documentNumber)
            .where("status", "==", "inside")
            .limit(1)
            .get();

        if (!activeLogsSnapshot.empty) {
            const activeLogRef = activeLogsSnapshot.docs[0].ref;

            await activeLogRef.update(
                assignUpdateProps({
                    exitDateTime: dbFormattedDate,
                    status: "outside",
                    exitAccessPoint: {
                        id: accessPoint.id,
                        method: accessPoint.method,
                        name: accessPoint.name,
                        origin: accessPoint.origin,
                        type: accessPoint.type,
                    },
                }) as { [key: string]: any }
            );

            res.status(200).json({ message: "Salida registrada con éxito" });
            return;
        }

        const existingUsers = await fetchUserByDocument(documentNumber);

        let userId = null;
        let finalName = name || "Desconocido";
        let finalType = type || "visitor_pedestrian";

        if (existingUsers && existingUsers.length > 0) {
            const userData = existingUsers[0];
            userId = userData.id;

            finalName = `${userData.firstName} ${userData.paternalSurname}`.trim();
            finalType = "worker_pedestrian";
        } else {
            finalType = "visitor_pedestrian";
        }

        const newDocRef = firestore.collection("accessControl").doc();
        const newAccessId = newDocRef.id;

        const accessData = assignCreateProps({
            id: newAccessId,
            driverName: finalName,
            plateNumber: "N/A",
            entryDateTime: dbFormattedDate,
            exitDateTime: null,
            status: "inside",
            type: finalType,
            entryAccessPoint: {
                id: accessPoint.id,
                method: accessPoint.method,
                name: accessPoint.name,
                origin: accessPoint.origin,
                type: accessPoint.type,
            },
            documentNumber: documentNumber,
            ...(userId && { userId }),
        });

        await newDocRef.set(accessData);

        res.status(200).json({
            message: "Entrada registrada con éxito",
            data: accessData,
        });
    } catch (error) {
        console.error("Error procesando control de acceso:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};