import {collection, doc} from "firebase/firestore";
import {db} from "../config";
import {
    deleteDocument,
    fetchCollection,
    fetchDocument,
    mergeDocument,
    setDocument,
    updateDocument,
    type WhereClause,
} from "../firestore";

export const usersRef = collection(db, "users");

export const getUserId = (): string => doc(usersRef).id;

export const fetchUsers = async (whereClauses?: WhereClause[]): Promise<any[]> =>
    fetchCollection<any>(usersRef, whereClauses);

export const fetchUser = async (userId: string): Promise<any | undefined> =>
    fetchDocument<any>(usersRef, userId);

export const addUser = async (userId: string, userData: any): Promise<void> =>
    setDocument<any>(usersRef, userId, userData);

export const mergeUser = async (userId: string, userData: any): Promise<void> =>
    mergeDocument<any>(usersRef, userId, userData);

export const updateUser = async (userId: string, userData: any): Promise<void> =>
    updateDocument<any>(usersRef, userId, userData);

export const deleteUser = async (userId: string): Promise<void> =>
    deleteDocument(usersRef, userId);