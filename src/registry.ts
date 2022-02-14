import "@sapphire/plugin-logger/register";
import "@sapphire/plugin-i18next/register";
import "@sapphire/plugin-hmr/register";

import { Client } from "./lib/structures/client/bot";

async function initializeServer(): Promise<void> {
  await Client.startClient();
}

initializeServer().then(() => {});
