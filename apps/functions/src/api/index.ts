import cors from "cors";
import express from "express";
import usersRoutes from "./users/routes/users.routes";
import authRoutes from "./auth/routes/auth.routes";
import identitiesRoutes from "./identities/routes/identities.routes";
import assistancesRoutes, {
  legacyCSharpRouter,
} from "./assistances/routes/assistances.routes";
import accessControlRoutes from "./access-control/routers/accessControl.routes";

const app: express.Application = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

app.get("/", (req, res) =>
  res.status(200).send("Welcome to Gobierno Regional del Callao API!").end(),
);

const v1Router = express.Router();

v1Router.use("/auth", authRoutes);
v1Router.use("/users", usersRoutes);
v1Router.use("/identities", identitiesRoutes);
v1Router.use("/assistances", assistancesRoutes);
v1Router.use("/access-controls", accessControlRoutes);

v1Router.use("/fingerprint", legacyCSharpRouter);

app.use("/v1", v1Router);

/*
const v2Router = express.Router();
v2Router.use("/users", v2UsersRoutes_Modificados);
app.use("/api/v2", v2Router);
*/

export { app };
