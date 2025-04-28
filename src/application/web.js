import express from "express";
import { publicRouter } from "../route/public-api.js";
import { errorMiddleware } from "../middleware/error-middleware.js";
import { userRouter } from "../route/api.js";
import swaggerUi from "swagger-ui-express";
import apiDocumentation from "../../docs/apidocs.json" assert { type: "json" };
import cors from "cors";
import helmet from "helmet";
import bodyParser from "body-parser";

export const web = express();

//SWAGGER
web.use("/api-docs", swaggerUi.serve, swaggerUi.setup(apiDocumentation));
web.use(express.json());
web.use(cors());
web.use(helmet());
web.use(express.urlencoded({ extended: true }));
web.set("view engine", "ejs");
web.use("/public/", express.static("./public"));
web.use(bodyParser.json());
web.use(publicRouter);
web.use(userRouter);

web.use(errorMiddleware);
