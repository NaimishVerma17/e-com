import { app } from "./app";
import { appConfig } from "./configs/app.config";

const port = appConfig.port;

app.listen(port, () => {
  console.log(`Server is running on port ${String(port)}`);
  console.log(`Environment: ${appConfig.env}`);
});
