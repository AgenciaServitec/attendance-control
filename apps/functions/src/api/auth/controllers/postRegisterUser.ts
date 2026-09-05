import {NextFunction, Request, Response} from "express";
import lodash from "lodash";
import {auth, fetchCollection, firestore} from "../../../_firebase";
import {getUserId} from "../../../_firebase/collections";
import {Status, User} from "../../../globalTypes";
import {defaultFirestoreProps} from "../../../utils";

const { isEmpty } = lodash;

export const postRegisterUser = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const payload = req.body;

    console.log("「Register User」Initialize Official Identity", {
        documentType: payload?.document?.type,
        documentNumber: payload?.document?.number,
        email: payload?.email,
    });

    try {
        const _isEmailExists = await isEmailExists(payload?.email);
        if (_isEmailExists) {
            res.status(412).send("auth/email_already_exists").end();
            return;
        }

        const _isPhoneNumberExists = await isPhoneNumberExists(payload?.phone?.number);
        if (_isPhoneNumberExists) {
            res.status(412).send("auth/phone_number_already_exists").end();
            return;
        }

        const _isDocumentExists = await isDocumentExists(payload?.document?.number);
        if (_isDocumentExists) {
            res.status(412).send("auth/document_number_already_exists").end();
            return;
        }

        const userId = getUserId();

        await createUserAuth(payload, userId);

        const { assignCreateProps } = defaultFirestoreProps();

        const userData = assignCreateProps({
            id: userId,
            document: {
                type: payload.document?.type || "dni",
                number: payload.document?.number,
            },
            firstName: payload.firstName,
            paternalSurname: payload.paternalSurname,
            maternalSurname: payload.maternalSurname,
            fullName: `${payload.firstName} ${payload.paternalSurname} ${payload.maternalSurname}`.toLowerCase().trim(),
            gender: payload.gender,
            email: payload.email,
            phone: payload.phone,
            role: {
                code: "user",
                name: "Usuario"
            },
            status: "active" as Status,
            extraPermissions: [],
        });

        await firestore.collection("users").doc(userId).set(userData);

        res.status(201).json({
            success: true,
            message: "Usuario institucional registrado correctamente en el sistema.",
            userId,
        });

    } catch (e) {
        console.error("Error en Register User:", e);
        next(e);
    }
};

const createUserAuth = async (payload: any, userId: string): Promise<void> => {
    await auth.createUser({
        uid: userId,
        email: payload.email,
        password: payload.password,
        displayName: `${payload.firstName} ${payload.paternalSurname}`.toUpperCase().trim(),
        phoneNumber: payload.phone
            ? `${payload.phone.prefix || "+51"}${payload.phone.number}`
            : undefined,
    });
};

const isEmailExists = async (email: string): Promise<boolean> => {
    const users = await fetchCollection<User>(
        firestore
            .collection("users")
            .where("isDeleted", "==", false)
            .where("email", "==", email)
    );
    return !isEmpty(users);
};

const isPhoneNumberExists = async (number: string): Promise<boolean> => {
    const users = await fetchCollection<User>(
        firestore
            .collection("users")
            .where("isDeleted", "==", false)
            .where("phone.number", "==", number)
    );
    return !isEmpty(users);
};

const isDocumentExists = async (docNumber: string): Promise<boolean> => {
    if (!docNumber) return false;
    const users = await fetchCollection<User>(
        firestore
            .collection("users")
            .where("isDeleted", "==", false)
            .where("document.number", "==", docNumber)
    );
    return !isEmpty(users);
};