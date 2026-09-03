import { User } from "../../globalTypes";
import {
  fetchCollection,
  fetchDocument,
  firestore,
  setDocument,
} from "../index";

export const usersRef = firestore.collection("users");

export const getUserId = (): string => usersRef.doc().id;

export const fetchUser = async (userId: string): Promise<User | undefined> =>
  fetchDocument<User>(usersRef.doc(userId));

export const addUser = async (
  user: User
): Promise<FirebaseFirestore.WriteResult> =>
  setDocument<User>(usersRef.doc(user.id), user);

export const fetchUserByDocument = async (
  userDocument: string
): Promise<User[] | undefined> =>
  fetchCollection<User>(
    usersRef
      .where("isDeleted", "==", false)
      .where("document.number", "==", userDocument)
      .limit(1)
  );

export const fetchUsers = async (): Promise<User[] | undefined> =>
  fetchCollection(usersRef.where("isDeleted", "==", false));

export const updateUser = (userId: string, user: Partial<User>) =>
  usersRef.doc(userId).update(user);
