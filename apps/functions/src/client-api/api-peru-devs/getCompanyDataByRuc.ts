import { get } from "./fetchApi";
import { environmentConfig } from "../../config";
import { logger } from "../../utils";

type Response = Company;

interface Props {
  documentNumber: string;
}

interface CompanyData {
  companyName: string;
  type: string;
  address: string;
  department: string | null;
  province: string | null;
  district: string | null;
}

const { token } = environmentConfig["api-peru-devs"];

export const getCompanyDataByRuc = async ({
  documentNumber,
}: Props): Promise<CompanyData> => {
  const { data } = await get<Response>(
    `/ruc?document=${documentNumber}&key=${token}`,
    {
      headers: {
        "Content-type": "application/json",
      },
    }
  );

  const dataJson = { ...data };

  logger.info("DATA_JSON: ", dataJson);

  return mapCompany(data.resultado);
};

const mapCompany = (resultado: Company["resultado"]): CompanyData => ({
  companyName: resultado.razon_social,
  type: resultado.tipo,
  address: resultado.direccion,
  department: resultado.departamento,
  province: resultado.provincia,
  district: resultado.distrito,
});
