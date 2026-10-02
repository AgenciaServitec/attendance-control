import {
    type CollectionReference,
    deleteDoc,
    doc,
    type DocumentData,
    getDoc,
    getDocs,
    query,
    setDoc,
    updateDoc,
    where,
    type WhereFilterOp,
} from "firebase/firestore";
import {getDownloadURL, getStorage, ref, uploadBytes} from "firebase/storage";

export type WhereClause = [string, WhereFilterOp, unknown];

// Convertir QuerySnapshot a un arreglo de objetos con ID
export const querySnapshotToArray = <T = any>(
    querySnapshot: any
): (T & { id: string })[] => {
    const documents: (T & { id: string })[] = [];
    querySnapshot.forEach((docSnap: any) => {
        documents.push({ id: docSnap.id, ...(docSnap.data() as T) });
    });
    return documents;
};

// Obtener colección con filtros opcionales (where)
export const fetchCollection = async <T = any>(
    colRef: CollectionReference<DocumentData>,
    whereClauses?: WhereClause[]
): Promise<(T & { id: string })[]> => {
    let q = query(colRef);

    if (whereClauses && whereClauses.length > 0) {
        const conditions = whereClauses.map(([field, op, value]) =>
            where(field, op, value)
        );
        q = query(colRef, ...conditions);
    }

    const querySnapshot = await getDocs(q);
    return querySnapshotToArray<T>(querySnapshot);
};

// Obtener un documento por ID
export const fetchDocument = async <T = any>(
    colRef: CollectionReference<DocumentData>,
    id: string
): Promise<(T & { id: string }) | undefined> => {
    const docRef = doc(colRef, id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return undefined;
    return { id: docSnap.id, ...(docSnap.data() as T) };
};

// Crear/Reemplazar un documento
export const setDocument = async <T = any>(
    colRef: CollectionReference<DocumentData>,
    id: string,
    data: T
): Promise<void> => {
    const docRef = doc(colRef, id);
    return setDoc(docRef, data as DocumentData);
};

// Fusionar/Actualizar campos de un documento existente
export const mergeDocument = async <T = any>(
    colRef: CollectionReference<DocumentData>,
    id: string,
    data: Partial<T>
): Promise<void> => {
    const docRef = doc(colRef, id);
    return setDoc(docRef, data as DocumentData, { merge: true });
};

// Actualizar parcialmente un documento existente
export const updateDocument = async <T = any>(
    colRef: CollectionReference<DocumentData>,
    id: string,
    data: Partial<T>
): Promise<void> => {
    const docRef = doc(colRef, id);
    return updateDoc(docRef, data as DocumentData);
};

// Eliminar un documento
export const deleteDocument = async (
    colRef: CollectionReference<DocumentData>,
    id: string
): Promise<void> => {
    const docRef = doc(colRef, id);
    return deleteDoc(docRef);
};

// Subida de archivos a Firebase Storage
export const uploadToFirebase = async (
    file: File,
    folderPath: string = "uploads"
): Promise<string> => {
    const storage = getStorage();
    const storageRef = ref(storage, `${folderPath}/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
};