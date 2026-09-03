import { NextFunction, Request, Response } from "express";
import { getCompanyDataByRuc } from "../../../client-api/api-peru-devs";

interface Params {
  documentNumber: string;
}

export const getDataByRuc = async (
  req: Request<Params, unknown, unknown, unknown>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const {
    params: { documentNumber },
  } = req;

  console.log("「Get entity data」Initialize", documentNumber, {
    params: req.params,
  });

  try {
    const entityData = await getCompanyDataByRuc({ documentNumber });

    res.send(entityData).end();
  } catch (error) {
    console.error(error);
    next(error);
  }
};
