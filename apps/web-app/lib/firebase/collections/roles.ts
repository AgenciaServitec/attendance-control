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

export const rolesRef = collection(db, "roles");

export const getRoleId = (): string => doc(rolesRef).id;

export const fetchRoles = async (whereClauses?: WhereClause[]): Promise<any[]> =>
    fetchCollection<any>(rolesRef, whereClauses);

export const fetchRole = async (roleId: string): Promise<any | undefined> =>
    fetchDocument<any>(rolesRef, roleId);

export const addRole = async (roleId: string, roleData: any): Promise<void> =>
    setDocument<any>(rolesRef, roleId, roleData);

export const mergeRole = async (roleId: string, roleData: any): Promise<void> =>
    mergeDocument<any>(rolesRef, roleId, roleData);

export const updateRole = async (roleId: string, roleData: any): Promise<void> =>
    updateDocument<any>(rolesRef, roleId, roleData);

export const deleteRole = async (roleId: string): Promise<void> =>
    deleteDocument(rolesRef, roleId);