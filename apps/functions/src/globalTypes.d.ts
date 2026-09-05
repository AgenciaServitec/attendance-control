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
  fingerprintTemplate?: string | "";
}

interface Quotation {
  id: string;
  client: {
    firstName?: string;
    paternalSurname?: string;
    maternalSurname?: string;
    companyName?: string;
    document: {
      type: string;
      number: string;
    };
    phone: Phone;
  };
  device: {
    type: string;
    brand: string;
    model: string;
    color: string;
  };
  analysis: string;
  solutions: string;
  recommendations: string;
  serieNumber: string;
}

interface Assistance extends DefaultFirestoreProps {
  id: string;
  createAtString: string;
  entry: { date: string; dateTimestamp: FirebaseFirestore.Timestamp } | null;
  outlet: { date: string } | null;
  userId: string;
  user: User;
  workPlace: string | null;
  status: "delay" | "attended" | null;
  minutesWorked: number | 0;
}

export interface ServiceRequest extends DefaultFirestoreProps {
  id: string;
  status: "pending" | "inProgress" | "completed" | "cancelled";
  client: {
    firstName?: string;
    paternalSurname?: string;
    maternalSurname?: string;
    companyName?: string;
    document: {
      type: "dni" | "ruc";
      number: string;
    };
    phone: {
      prefix: "+51";
      number: string;
    };
    email: string;
  };
  location: {
    address: string;
    geoPoint: {
      lat: number;
      lng: number;
    };
  };
  technicianLocation: {
    lat: number;
    lng: number;
  };
  problemDescription: string;
  device: string;
  estimatedPrice: number;
  serviceType: string;
  userId: string;
  assignment?: string | null;
}

export interface WebServiceRequest extends DefaultFirestoreProps {
  id: string;
  documentType: "DNI" | "RUC" | "CE";
  documentNumber: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  deviceCategory: string;
  deviceBrand: string;
  deviceModel: string;
  serialNumber?: string;
  issueDescription: string;
  serviceMode: "technical-visit" | "store-visit";
  department: string;
  province: string;
  district: string;
  exactAddress?: string;
  apartmentNumber?: string;
  reference?: string;
}

interface Site extends DefaultFirestoreProps {
  id: string;
  name: string;
  hostname: string;
  status: "active" | "inactive" | "suspended";

  branding: {
    primaryColor: string;
    textColor: string;
    logo: Image;
    isotype?: Image;
  };

  notifications: {
    mainReceiver: string;
    bccEmails: string;
    phone: Phone;
  };
  customSmtp: boolean;
  smtpConfig?: {
    service: string;
    user: string;
    pass: string;
  };
}

interface BaseEntry extends DefaultFirestoreProps {
  id: string;
  hostname: string;
  status: "pending" | "attended";
  message: string;
  client: {
    fullName: string;
    firstName?: string;
    paternalSurname?: string;
    maternalSurname?: string;
    email: string;
    phone: Phone;
    document?: Document;
  };
  siteId: string;
}

interface ContactEntry extends BaseEntry {
  category: "contacts";
  subject?: string;
}

interface SuggestionEntry extends BaseEntry {
  category: "suggestion";
  area: "web" | "service" | "product";
}

interface ClaimEntry extends BaseEntry {
  category: "claim";
  orderId?: string;
}

interface ComplaintsBookEntry extends BaseEntry {
  category: "complaints_book";
  details: {
    type: "queja" | "reclamo";
    isMinor: boolean;
    parentDocument?: string;
    claimedAmount: number;
    consumerRequest: string;
  };
}

type Entry = ContactEntry | SuggestionEntry | ClaimEntry | ComplaintsBookEntry;

interface Contact extends DefaultFirestoreProps {
  id: string;
  email: string;
  fullName: string;
  firstName?: string;
  paternalSurname?: string;
  maternalSurname?: string;
  phone: Phone;
  secondaryPhones?: string[];
  siteId?: string;
}
