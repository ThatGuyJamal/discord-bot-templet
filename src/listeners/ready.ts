import { Events, Listener, ListenerOptions } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";

@ApplyOptions<ListenerOptions>({
  event: Events.ClientReady,
})
export class UserEvent extends Listener {
  public run(): void {
    const { client, logger } = this.container;

    client.user?.setPresence({
      activities: [
        {
          name: "/help",
          type: "WATCHING",
        },
      ],
    });

    logger.info(
      `${client.user?.tag} is online and ready to battle in ${client.guilds.cache.size} guilds!`
    );
  }
}
