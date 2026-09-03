import { Request, Response } from "express";
import moment from "moment-timezone";
import {firestore } from "../../../_firebase";
import { Timestamp } from "firebase-admin/firestore";
import { defaultFirestoreProps } from "../../../utils";

interface Params {
    documentNumber: string;
}

interface Body {
    backdatedDate?: string;
}

const { assignCreateProps, assignUpdateProps } = defaultFirestoreProps();

export const putFingerprintAssistance = async (
    req: Request<Params, unknown, Body, unknown>,
    res: Response
): Promise<void> => {
    const { documentNumber } = req.params;
    const { backdatedDate } = req.body;

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

        const userDoc = usersSnapshot.docs[0];
        const userData = userDoc.data();
        const userId = userDoc.id;
        const subCompanyId = userData.subCompanyId || userData.tenantId || "default";

        let targetMoment: moment.Moment;
        if (backdatedDate) {
            targetMoment = moment.tz(backdatedDate, "YYYY-MM-DD HH:mm:ss", "America/Lima");
        } else {
            targetMoment = moment().tz("America/Lima");
        }

        const dateString = targetMoment.format("YYYY-MM-DD");
        const actionTimestamp = Timestamp.fromDate(targetMoment.toDate());

        const settingsSnap = await firestore.collection("settings").doc("assistance").get();
        const settings = settingsSnap.exists ? settingsSnap.data() : null;

        let isLate = false;

        const todayAssistanceSnap = await firestore
            .collection("assistances")
            .where("userId", "==", userId)
            .where("dateString", "==", dateString)
            .where("isDeleted", "==", false)
            .limit(1)
            .get();

        let assistanceResult;

        if (!todayAssistanceSnap.empty) {
            const activeLogDoc = todayAssistanceSnap.docs[0];

            const updatePayload = assignUpdateProps({
                exitDateTime: actionTimestamp,
                status: "outside",
                updatedBy: "biometric_desktop_app"
            }) as any;

            await activeLogDoc.ref.update(updatePayload);
            assistanceResult = { id: activeLogDoc.id, ...activeLogDoc.data(), ...updatePayload };

        } else {
            if (settings && settings.entryTime) {
                const [hours, minutes] = settings.entryTime.split(":");
                let limitTime = moment(targetMoment).hour(Number(hours)).minute(Number(minutes)).second(0);

                if (settings.toleranceMinutes) {
                    limitTime = limitTime.add(settings.toleranceMinutes, "minutes");
                }

                if (targetMoment.isAfter(limitTime)) {
                    isLate = true;
                }
            }

            const newAssistanceRef = firestore.collection("assistances").doc();

            const newAssistanceData = assignCreateProps({
                id: newAssistanceRef.id,
                subCompanyId: subCompanyId,
                userId: userId,
                dateString: dateString,
                entryDateTime: actionTimestamp,
                exitDateTime: null,
                status: "inside",
                similarityScore: 100,
                isLate: isLate,
                createdBy: "biometric_desktop_app"
            });

            await newAssistanceRef.set(newAssistanceData);
            assistanceResult = newAssistanceData;
        }

        res.json(assistanceResult);
    } catch (error) {
        console.error("Error al registrar asistencia biométrica:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};