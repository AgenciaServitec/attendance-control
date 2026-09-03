import { get } from "./fetchApi";
import { environmentConfig } from "../../config";
import { logger } from "../../utils";

type Response = Person;

interface Props {
  documentNumber: string;
}

interface PersonData {
  firstName: string;
  paternalSurname: string;
  maternalSurname: string;
  fullName: string;
  gender: string;
  birthdate: string;
  verificationCode: string;
}

const { token } = environmentConfig["api-peru-devs"];

export const getPersonDataByDni = async ({
  documentNumber,
}: Props): Promise<PersonData> => {
  const { data } = await get<Response>(
    `/dni/complete?document=${documentNumber}&key=${token}`,
    {
      headers: {
        "Content-type": "application/json",
      },
    }
  );

  const dataJson = { ...data };

  logger.info("DATA_JSON: ", dataJson);

  return mapPerson(data.resultado);
};

const mapPerson = (resultado: Person["resultado"]): PersonData => ({
  firstName: resultado.nombres,
  paternalSurname: resultado.apellido_paterno,
  maternalSurname: resultado.apellido_materno,
  fullName: resultado.nombre_completo,
  gender: resultado.genero,
  birthdate: resultado.fecha_nacimiento,
  verificationCode: resultado.codigo_verificacion,
});
