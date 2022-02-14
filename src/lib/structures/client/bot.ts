import { SapphireClient } from "@sapphire/framework";
import { CLIENT_OPTIONS, ENV } from "../../../config";
import { initializeTypeGooseConnection } from "../../database/connect";
import { GuildConfigHandler } from "../ORM/mongodb.guild.handler";

class coreBotClient extends SapphireClient {
  public constructor() {
    super(CLIENT_OPTIONS);
    this.guildSettingsManager = new GuildConfigHandler();
  }

  public async startClient(): Promise<void> {
    this.validateEnviroment();
    await initializeTypeGooseConnection(ENV.database.useDefault);
    await this.login(ENV.bot.token);
  }

  /** Kills the node process and all its components */
  public async destroy() {
    this.logger.warn("Destroying node process...");
    super.destroy();
    process.exit(0);
  }

  /**
   * Checks to make sure you have filled out the required enviroment variables
   * @private
   */
  validateEnviroment(): void {
    if (!ENV.bot.token) {
      throw new Error(
        "No bot token provided. Please fill out the ENV.bot.token variable in the config.ts file."
      );
    } else if (!ENV.bot.test_guild_id || ENV.bot.test_guild_id.length !== 18) {
      throw new Error(
        "No test guild id provided. Please fill out the ENV.bot.test_guild_id variable in the config.ts file."
      );
    } else if (
      ENV.database.useDefault === true &&
      ENV.database.connection_url.length === 0
    ) {
      throw new Error(
        "No database connection url provided. Please fill out the ENV.database.connection_url variable in the config.ts file."
      );
    }
  }
}

/** Type over-writes, so we get typings in our client extensions. */
declare module "discord.js" {
  interface Client {
    guildSettingsManager: GuildConfigHandler;
  }
}

/** Over-writes the default types for the Preconditions */
declare module "@sapphire/framework" {
  interface Preconditions {
    OwnerOnly: never;
  }
}

export const Client = new coreBotClient();
