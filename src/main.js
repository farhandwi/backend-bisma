import { web } from "./application/web.js";
import { logger } from "./application/logging.js";

const port = 8000;
// const port = 33068;
web.listen(port, () => {
  logger.info(`App start on Port ${port}`);
});
