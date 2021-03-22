import { EventEmitter } from "events";
import { Logger } from "../lib/logger";
import { createConnection } from "typeorm";
import dbConfig from "./dbconfig";

class DatabaseService {
  public static emitter: EventEmitter = new EventEmitter();
  public static isConnected: boolean = false;
  public static logger: any = new Logger();

  public static async getConnection(callback = null, wait = false) {
    DatabaseService.handleConnectionError();
    return await DatabaseService.createConnection();
  }
  public static async createConnection() {
    const config = dbConfig[`${process.env.ENV}`];
    return await createConnection({
      type: "mysql",
      host: config.host,
      port: parseInt(config.port),
      username: config.username,
      password: config.password,
      database: config.database,
      logging: true,
      entities: [
      ],
      subscribers: [],
    })
      .then(() => {
        DatabaseService.isConnected = true;
        DatabaseService.logger.log("info", "database connected successfully");
      })
      .catch((err: Error) => {
        console.log(`⛔ ${err.message}`);
        DatabaseService.logger.log(
          "info",
          "database connection error...retrying"
        );
        DatabaseService.emitter.emit("DB_CONNECT_ERROR");
      });
  }

  public static async handleConnectionError() {
    DatabaseService.emitter.on("DB_CONNECT_ERROR", async () => {
      DatabaseService.logger.log(
        "info",
        "database connection error...retrying"
      );
      setTimeout(async () => {
        await DatabaseService.createConnection();
      }, 3000);
    });
  }
}

export { DatabaseService }