import { envs } from "./config";
import { MysqlDatabase } from "./data/mysql";
import { AppRoutes } from "./presentation/routes";
import { Server } from "./presentation/server";

(() => {
  main();
})();

async function main() {

  // Start the server
  new Server({
    port: envs.PORT,
    routes: AppRoutes.routes,
  }).start();
}
