import { connect } from "mongoose";
import { container } from "@sapphire/framework";
import { ENV } from "../../config";

export async function initializeTypeGooseConnection(enabled: boolean) {
  if (enabled) {
    await connect(ENV.database.connection_url);
    container.logger.info(`Connection to database established.`);
  } else {
    container.logger.info(`Connection to database disabled.`);
  }
}
