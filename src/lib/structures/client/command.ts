import {
  Command as SapphireCommand,
  type Args,
  type Piece,
  UserError,
} from "@sapphire/framework";
import { PermissionFlagsBits } from "discord-api-types/v9";
import { Permissions, TextChannel } from "discord.js";
import { ENV } from "../../../config";
import { TOptions } from "i18next";
import { fetchCurrentLanguage, translate } from "../../i18n/translate";
import { GuildMessage } from "../../typings/discord";

export abstract class ICommand<
  O extends Command.Options = Command.Options
> extends SapphireCommand<Args, O> {
  public constructor(context: Piece.Context, options: O) {
    super(context, {
      // All commands use embeds and thus require this permissions
      requiredClientPermissions: new Permissions(
        options.requiredClientPermissions
      ).add([
        PermissionFlagsBits.EmbedLinks,
        PermissionFlagsBits.UseApplicationCommands,
        PermissionFlagsBits.SendMessages,
      ]),
      generateDashLessAliases: true,
      ...options,
      runIn: ["GUILD_TEXT"],
    });

    // If this command is owner only:
    if (this.category === "dev") {
      // Enable it only if there is a development server on the assumption
      // it would've been registered guild wide otherwise.
      this.enabled &&= Boolean(ENV.bot.test_guild_id);

      // Automatically enable the OwnerOnly precondition.
      this.preconditions.append("OwnerOnly");
    }

    // If this command is disabled:
    if (this.category === "disabled") {
      // Disable it.
      this.enabled = false;
    }
  }
  public onLoad() {
    this.container.logger.info(`[COMMAND]`, `Loaded ${this.name}.`);
  }

  public onUnload() {
    this.container.logger.info(`[COMMAND]`, `Unloaded ${this.name}.`);
  }

  /**
   * Customized function to translate objects in our bot
   * @param x The TextChannel instance
   * @param path of the key to translate
   * @param _options from i18next to pass to the translation function
   */
  public async translate(
    x: TextChannel,
    path: string,
    _options?: TOptions
  ): Promise<string> {
    return await translate(x, path, _options);
  }

  /**
   * Returns the current language of the guild
   * @param x
   */
  public async fetchLanguage(x: TextChannel | GuildMessage): Promise<string> {
    return await fetchCurrentLanguage(x);
  }

  protected error(identifier: string | UserError, context?: unknown): never {
    throw typeof identifier === "string"
      ? new UserError({ identifier, context })
      : identifier;
  }
}

export namespace Command {
  // Convenience type to save imports.
  export type Options = SapphireCommand.Options;
}
