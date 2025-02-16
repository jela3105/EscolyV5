import { envs } from "./config";
import { Server } from "./presentation/server";

(() => {
    main();
})();

async function  main() {
   // TODO: Await for database connection 

   new Server({
        port: envs.PORT,
   }).start();    
}