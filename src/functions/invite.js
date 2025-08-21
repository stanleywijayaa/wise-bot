import { InteractionResponseType, InteractionResponseFlags } from 'discord-interactions';

export function handleInviteCommand(env) {
  const applicationId = env.DISCORD_APPLICATION_ID;
  const INVITE_URL = `https://discord.com/oauth2/authorize?client_id=${applicationId}&scope=applications.commands`;

  return {
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: INVITE_URL,
      flags: InteractionResponseFlags.EPHEMERAL,
    },
  };
}