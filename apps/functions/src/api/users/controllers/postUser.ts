import { NextFunction, Request, Response } from "express";
import lodash from "lodash";

import { auth, fetchCollection, firestore } from "../../../_firebase";
import { getUserId } from "../../../_firebase/collections";
import { User } from "../../../globalTypes";
import { defaultFirestoreProps } from "../../../utils";

const { isEmpty } = lodash;

export const postUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { body: user } = req;

  console.log("「Add user」Initialize", user, {
    params: req.params,
    body: req.body,
  });

  try {
    const _isEmailExists = await isEmailExists(user?.email);
    if (_isEmailExists) {
      res.status(412).send("user/email_already_exists").end();
      return;
    }

    const _isDniExists = await isDniExists(user?.document.number);
    if (_isDniExists) {
      res.status(412).send("user/dni_already_exists").end();
      return;
    }

    const _isPhoneNumberExists = await isPhoneNumberExists(user?.phone.number);
    if (_isPhoneNumberExists) {
      res.status(412).send("user/phone_number_already_exists").end();
      return;
    }

    const userId = getUserId();

    await addUser({ ...user, id: userId });
    await addUserAuth({ ...user, id: userId });

    res.sendStatus(200).end();
  } catch (e) {
    console.error(e);
    next(e);
  }
};

const addUser = async (user: User): Promise<void> => {
  const { assignCreateProps } = defaultFirestoreProps();

  await firestore
    .collection("users")
    .doc(user.id)
    .set(
      assignCreateProps({
        ...user,
      })
    );
};

const addUserAuth = async (user: User): Promise<void> => {
  await auth.createUser({
    uid: user.id,
    email: user?.email || undefined,
    phoneNumber: user?.phone
      ? `${user.phone?.prefix || "+51"}${user.phone.number}`
      : undefined,
  });
};

const isEmailExists = async (email: string | null): Promise<boolean> => {
  const users = await fetchCollection<User>(
    firestore
      .collection("users")
      .where("isDeleted", "==", false)
      .where("email", "==", email)
  );

  return !isEmpty(users);
};

const isDniExists = async (dni: string | null): Promise<boolean> => {
  const users = await fetchCollection<User>(
    firestore
      .collection("users")
      .where("isDeleted", "==", false)
      .where("dni", "==", dni)
  );

  return !isEmpty(users);
};

const isPhoneNumberExists = async (number: string | null): Promise<boolean> => {
  const users = await fetchCollection<User>(
    firestore
      .collection("users")
      .where("isDeleted", "==", false)
      .where("phone.number", "==", number)
  );

  return !isEmpty(users);
};
