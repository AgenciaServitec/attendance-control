import { fetchDocument, firestore, setDocument } from "../index";
import { fetchCollection } from "../firestore";
import { Quotation, Site } from "../../globalTypes";

export const sitesRef = firestore.collection("sites");

export const getSiteId = (): string => sitesRef.doc().id;

export const fetchSite = async (
  siteId: string
): Promise<Quotation | undefined> =>
  fetchDocument<Quotation>(sitesRef.doc(siteId));

export const addSite = async (
  site: Site
): Promise<FirebaseFirestore.WriteResult> =>
  setDocument<Site>(sitesRef.doc(site.id), site);

export const fetchSites = async (): Promise<Site[] | undefined> =>
  fetchCollection(
    sitesRef.where("isDeleted", "==", false).orderBy("createAt", "desc")
  );

export const updateSite = (siteId: string, site: Partial<Site>) =>
  sitesRef.doc(siteId).update(site);

export const fetchSiteByHostname = async (
  hostname: string
): Promise<Site | undefined> => {
  const snapshot = await sitesRef
    .where("hostname", "==", hostname)
    .where("isDeleted", "==", false)
    .limit(1)
    .get();

  if (snapshot.empty) return undefined;

  return snapshot.docs[0].data() as Site;
};
