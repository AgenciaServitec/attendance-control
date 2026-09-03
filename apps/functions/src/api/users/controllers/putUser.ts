import assert from "assert";
import { NextFunction, Request, Response } from "express";
import lodash from "lodash";

import {
  auth,
  fetchCollection,
  fetchDocument,
  firestore,
} from "../../../_firebase";
import { User } from "../../../globalTypes";
import { defaultFirestoreProps } from "../../../utils";

type Params = { userId: string };

const { isEmpty } = lodash;
const { assignUpdateProps } = defaultFirestoreProps();

export const putUser = async (
  req: Request<Params, unknown, any, unknown>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const {
    body,
    params: { userId },
  } = req;

  console.log(userId, "「Update user」Initialize", {
    params: req.params,
    body: req.body,
  });

  try {
    const userFirestore = await fetchUser(userId);

    const changeEmail = userFirestore.email !== body.email;
    const changePhoneNumber = userFirestore.phone?.number !== body.phoneNumber;

    if (changeEmail) {
      const emailExists = await isEmailExists(body.email);
      if (emailExists) {
        res.status(412).send("user/email_already_exists").end();
        return;
      }
    }

    if (changePhoneNumber) {
      const phoneNumberExists = await isPhoneNumberExists(body.phoneNumber);
      if (phoneNumberExists) {
        res.status(412).send("user/phone_number_already_exists").end();
        return;
      }
    }

    const updatedUser: any = {
      ...userFirestore,
      firstName: body.firstName,
      paternalSurname: body.paternalSurname,
      maternalSurname: body.maternalSurname,
      email: body.email,
      document: {
        type: body.documentType,
        number: body.documentNumber,
      },
      profilePhoto: body.profilePhoto,
      phone: {
        ...userFirestore.phone,
        number: body.phoneNumber,
      },
      gender: body.gender,
      vehicle: {
        ...userFirestore.vehicle,
        plateNumber: body.plateNumber,
        model: body.vehicleModel,
        color: body.vehicleColor,
      },
    };

    const finalizedUser = assignUpdateProps(updatedUser);

    await updateUser(userId, finalizedUser);
    await updateUserAuth(userId, body, changeEmail, changePhoneNumber);

    res.sendStatus(200).end();
  } catch (e) {
    console.error(e);
  }
};

const updateUser = async (userId: string, user: any): Promise<void> => {
  await firestore
    .collection("users")
    .doc(userId)
    .update({ ...user });
};

const updateUserAuth = async (
  userId: string,
  body: any,
  changeEmail: boolean,
  changePhoneNumber: boolean,
): Promise<void> => {
  await auth.updateUser(userId, {
    ...(changeEmail && { email: body.email || undefined }),
    ...(changePhoneNumber && {
      phoneNumber: body.phoneNumber
        ? `${body.phonePrefix || "+51"}${body.phoneNumber}`
        : undefined,
    }),
  });
};

const isEmailExists = async (email: string | null): Promise<boolean> => {
  const users = await fetchCollection<User>(
    firestore
      .collection("users")
      .where("isDeleted", "==", false)
      .where("email", "==", email),
  );
  return !isEmpty(users);
};

const isPhoneNumberExists = async (
  phoneNumber: string | null,
): Promise<boolean> => {
  const users = await fetchCollection<User>(
    firestore
      .collection("users")
      .where("isDeleted", "==", false)
      .where("phone.number", "==", phoneNumber),
  );
  return !isEmpty(users);
};

const fetchUser = async (userId: string): Promise<User> => {
  const user = await fetchDocument<User>(
    firestore.collection("users").doc(userId),
  );
  assert(user, `User doesn't exist: ${userId}`);
  return user;
};
