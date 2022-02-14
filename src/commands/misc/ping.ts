import { ENV } from "../../config";
import {
  ApplicationCommandRegistry,
  BucketScope,
  ChatInputCommand,
  RegisterBehavior,
} from "@sapphire/framework";
import { seconds } from "../../lib/structures/util/time";
import { ApplyOptions } from "@sapphire/decorators";
import { ICommand } from "../../lib/structures/client/command";
import { SubCommandPluginCommandOptions } from "@sapphire/plugin-subcommands";
import { Message, MessageEmbed, TextChannel } from "discord.js";
import { BrandingColors } from "../../lib/structures/util/colors";
import ms from "ms";

@ApplyOptions<SubCommandPluginCommandOptions>({
  description: "Check the bot latency with discords api.",
  detailedDescription:
    "Returns helpful and quick statistics on the bot latency.",
  cooldownDelay: seconds(5),
  cooldownScope: BucketScope.User,
  cooldownLimit: 2,
  runIn: "GUILD_TEXT",
  nsfw: false,
  chatInputCommand: {
    register: ENV.bot.register_commands,
    guildIds: [ENV.bot.test_guild_id],
    behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
    idHints: [],
  },
})
export class UserCommand extends ICommand {
  public override async chatInputRun(
    ...[interaction]: Parameters<ChatInputCommand["chatInputRun"]>
  ) {
    const embed = new MessageEmbed().setTitle("Pinging...");

    const message = (await interaction.reply({
      embeds: [embed],
      fetchReply: true,
    })) as Message;

    const botLatency: number = Math.round(this.container.client.ws.ping);
    const apiLatency: number =
      message.createdTimestamp - message.createdTimestamp;

    const updatedEmbed = embed
      .setColor(BrandingColors.Primary)
      .setTitle("Pong! 🏓")
      .setDescription(
        await this.translate(
          interaction.channel as TextChannel,
          "commands/misc:ping_response",
          {
            replace: {
              latency: `${ms(botLatency)}`,
              apiLatency: `${ms(apiLatency)}`,
            },
          }
        )
      )
      .setTimestamp();

    await interaction.editReply({ embeds: [updatedEmbed] });
  }

  /**
   * Uploads our data to discord, and creates a slash command.
   * @param registry
   */
  public override registerApplicationCommands(
    registry: ApplicationCommandRegistry
  ) {
    registry.registerChatInputCommand(
      {
        name: this.name,
        description: this.description,
      },
      {
        registerCommandIfMissing: ENV.bot.register_commands,
        behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
      }
    );
  }
}
