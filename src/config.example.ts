import { env_types } from "./lib/typings/env";
import { ClientOptions, Message } from "discord.js";
import { container, LogLevel } from "@sapphire/framework";
import { TOptions } from "i18next";
import { InternationalizationOptions } from "@sapphire/plugin-i18next";

export const ENV: env_types = {
  bot: {
    token: "",
    prefix: "",
    dev: true,
    test_guild_id: "",
    register_commands: true,
  },
  database: {
    useDefault: true,
    dev: true,
    connection_url: "",
  },
  developer: {
    support_server: "",
    developer_id: "",
  },
};

export const CLIENT_OPTIONS: ClientOptions = {
  shards: "auto",
  shardCount: 1,
  caseInsensitiveCommands: true,
  caseInsensitivePrefixes: true,
  defaultPrefix: ENV.bot.prefix,
  logger: {
    level: ENV.bot.dev ? LogLevel.Debug : LogLevel.Warn,
  },
  regexPrefix: /^(hey +)?yoru[,! ]/i,
  intents: ["GUILDS", "GUILD_MEMBERS"],
  loadDefaultErrorListeners: true,
  loadMessageCommandListeners: true,
  partials: ["CHANNEL"],
  // Default global cool down settings.
  defaultCooldown: {
    // Ignored by Cooldown.
    filteredUsers: [ENV.developer.developer_id],
  },
  disableMentionPrefix: false,
  // Hot Module Replacement
  // @see https://github.com/sapphiredev/plugins/tree/main/packages/hmr
  hmr: {
    enabled: ENV.bot.dev,
  },
  i18n: parseInternationalizationOptions(),
};

function parseInternationalizationOptions(): InternationalizationOptions {
  return {
    defaultName: "en-US",
    defaultMissingKey: "default:key_error",
    i18next: (_: string[], languages: string[]) => ({
      supportedLngs: languages,
      preload: languages,
      returnObjects: true,
      returnEmptyString: false,
      returnNull: false,
      load: "all",
      lng: "en-US",
      fallbackLng: "en-US",
      defaultNS: "globals",
      overloadTranslationOptionHandler: (args: any[]): TOptions => ({
        defaultValue: args[1] ?? "globals:default",
      }),
      initImmediate: false,
    }),
  };
}
