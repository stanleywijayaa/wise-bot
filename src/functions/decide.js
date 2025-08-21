import { InteractionResponseType } from 'discord-interactions';

function getDecision() {
  const answers = [
    '👍Yes', 
    '👎No', 
    '🙅🏾hellnaw', 
    'GASKAN🔥🔥🔥'
    ];
  const randomIndex = Math.floor(Math.random() * answers.length);
  return answers[randomIndex];
}

export async function handleDecide(interaction) {
  const question = interaction.data.options?.find(opt => opt.name === "question")?.value;

  // Step 1: Reply immediately with "Bot is thinking..."
  const thinkingResponse = {
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: `🤔 You asked: **${question}**\n> Sundabot is thinking...`,
    },
  };

  // Step 2: After a delay, follow up with the decision
  // Workers don't allow sleep, so we use a scheduled task via fetch webhook
  const followupUrl = `https://discord.com/api/v10/webhooks/${interaction.application_id}/${interaction.token}`;

  // Schedule the follow-up
  (async () => {
    const delay = Math.floor(Math.random() * 2000) + 1000; // 1000–3000ms
    await new Promise(r => setTimeout(r, delay));
    await fetch(followupUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: `🎲 Answer: **${getDecision()}**`,
      }),
    });
  })();

  return thinkingResponse;
}