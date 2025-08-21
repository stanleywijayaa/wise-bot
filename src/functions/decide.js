import { InteractionResponseType } from 'discord-interactions';

export function handleDecideCommand() {
  const answers = ['Yes', 'No', 'Absolutely not'];
  const randomIndex = Math.floor(Math.random() * answers.length);
  const answer = answers[randomIndex];

  return {
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: answer,
    },
  };
}