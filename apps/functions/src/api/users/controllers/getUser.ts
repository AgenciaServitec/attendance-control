import { NextFunction, Request, Response } from "express";

import { fetchUser } from "../../../_firebase/collections";

interface Params {
  userId: string;
}

export const getUser = async (
  req: Request<Params, unknown, unknown, unknown>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const {
    params: { userId },
  } = req;

  console.log(userId, "「Get user data」Initialize", {
    params: req.params,
  });

  try {
    const user = await fetchUser(userId);

    res.json(user);
  } catch (e) {
    console.error(e);
  }
};
