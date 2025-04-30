import swaggerUi from "swagger-ui-express";
import { Express } from "express";
import { openApiSpec } from "../docs/swaggerDocs";

export default function swaggerDocs(app: Express, port: number) {

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openApiSpec));

  app.get("/api-docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(openApiSpec);
  });

  console.log(`Docs available at http://localhost:${port}/api-docs`);
}
