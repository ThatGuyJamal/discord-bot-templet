# Discord Bot Template

A quick template for creating a Discord bot using the Discord.js library and typescript.

Read the instructions below to get started with this project.

## Features

- Slash Command Handler: A customisable slash command handler.
- Language Support: A customisable language support and translator.
  - English (default)
- Quality Event support
- OwnerOnly System

## Setup and Information

Everything is set up in the `src` directory. The `src` directory contains the following files:

- `registy.ts`: The entry point for the bot.
- `config.example.ts`: The configuration for the bot.
- `commands/`: The commands for the bot.
- `listeners/`: The events for the bot.
- `preconditions/`: The utility functions for the bot.
- `languges/`: The language files for the bot.
- `lib/`: The structure files for the bot.

This project uses the `tsconfig.json` file to compile the typescript files. All the files in the `src` directory are compiled into javascript files that output
to the `./out` directory. The `tsconfig.json` file contains the configuration for the typescript compiler.

**NOTE**: After compiling the bot, you will need to move the `./languages` directory to the `./out` directory before it starts or else the translation features will
not work.

### Config.ts

If you left everything to the default, the `config.example.ts` file should be in the root of your project.
Rename this file to `config.ts` or else the bot will not work without some import changes.

After renaming this file, fill out the missing data in the `config.ts` file.

_While everything is not required to be filled out to launch the bot, it is required to fill in these variables:_

```ts
bot: {
    // The token for the bot.
  token: "",
  // The prefix for the bot.
  prefix: "",
  // is dev mode enabled?
  dev: true,
  // The test guild id for the bot.
  test_guild_id: "",
  // If slash commands should be registered or not.
  register_commands: true,
},
```

After filling out these options, the bot will come online.

## Support

While this template is not meant to be a full-featured bot, it is meant to be a starting point for creating a bot. If you need support or someting is outdated, please join
the [support server.](https://discord.com/invite/N79DZsm3m2)
