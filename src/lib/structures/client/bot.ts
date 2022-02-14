import { SapphireClient } from "@sapphire/framework";
import { CLIENT_OPTIONS, ENV } from "../../../config";

class coreBotClient extends SapphireClient {
  public constructor() {
    super(CLIENT_OPTIONS);
  }

  public async startClient(): Promise<void> {
    await this.login(ENV.bot.token);
  }

  /** Kills the node process and all its components */
  public async destroy() {
    this.logger.warn("Destroying node process...");
    super.destroy();
    process.exit(0);
  }
}

/** Type over-writes, so we get typings in our client extensions. */
declare module "discord.js" {
  interface Client {
    // options here
  }
}

/** Over-writes the default types for the Preconditions */
declare module "@sapphire/framework" {
  interface Preconditions {
    OwnerOnly: never;
  }
}

export const Client = new coreBotClient();
