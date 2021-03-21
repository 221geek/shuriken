import { app } from "./app";
import * as http from "http";

const server = http.createServer(app).listen(3000);
server.on(`listening`, async () => {
    console.log("logger");
});
console.log(`🚀🚀 Server is listening on ${JSON.stringify(server.address())}`)
