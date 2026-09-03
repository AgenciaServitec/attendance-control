import { NextFunction, Request, Response } from "express";

import { fetchUsers } from "../../../_firebase/collections";

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  console.log("「Get users data」Initialize", {
    params: req.params,
  });

  try {
    const users = await fetchUsers();

    res.json(users);
  } catch (e) {
    console.error(e);
  }
};
