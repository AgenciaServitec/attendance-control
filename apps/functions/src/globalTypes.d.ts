export type Timestamp = FirebaseFirestore.Timestamp;

type OmitDefaultFirestoreProps<T> = Omit<T, keyof PickDefaultFirestoreProps>;

type PickDefaultFirestoreProps = Pick<
  DefaultFirestoreProps,
  "createAt" | "isDeleted" | "updateAt"
>;

interface DefaultFirestoreProps {
  createAt: Timestamp;
  updateAt: Timestamp;
  updateBy: string;
  isDeleted: boolean;
}

export type RoleCode = "super_admin" | "owner" | "admin" | "user";
export type CurrencyCode = "PEN" | "USD";

export interface _Image {
  createAt: Timestamp;
  name: string;
  status?: string;
  thumbUrl: string;
  uid: string;
  url: string;
}

export type Image = Omit<_Image, "createAt"> & { createAt: Date };

export interface Archive {
  name: string;
  status?: string;
  uid: string;
  url: string;
}

interface Phone {
  prefix: string;
  number: string;
}

interface Document {
  type: "DNI" | "RUC" | "CE";
  number: string;
}

type Gender = "male" | "female" | "other";
type Status = "active" | "inactive" | "suspended";

interface User extends DefaultFirestoreProps {
  id: string;
  firstName: string;
  paternalSurname: string;
  maternalSurname: string;
  email: string;
  document: Document;
  phone: Phone;
  profilePhoto?: Image;
  birthDate?: string;
  gender?: "male" | "female" | "other";
  fingerprintTemplate: string | "";
  vehicle: {
    plateNumber: string;
    model: string;
    color: string;
    status: string;
  };
}

interface CompanyCore {
  name: string;
  ruc: string;
  size: string;
  address: {
    street: string;
    city: string;
    country: string;
  };
  status: Status;
}

interface RegisterTenantPayload {
  firstName: string;
  paternalSurname: string;
  maternalSurname: string;
  email: string;
  password?: string;
  phone: Phone;
  gender?: Gender;
  company: CompanyCore;
}
