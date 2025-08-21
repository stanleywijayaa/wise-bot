import { InteractionResponseType } from 'discord-interactions';

function getDecision() {
  const answers = [
    '👍Yes', 
    '👎No', 
    '🙅🏾hellnaw', 
    'GASKAN!!!🔥🔥🔥'
    ];
  const randomIndex = Math.floor(Math.random() * answers.length);
  return answers[randomIndex];
}

export async function handleDecideCommand(interaction, env, ctx) {
  const question = interaction.data.options?.find(opt => opt.name === "question")?.value;

  // Immediate response (within 3s)
  const thinkingResponse = {
    type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: `🤔 You asked: **${question}**\n> Sundabot is thinking...`,
    },
  };

  // Follow-up webhook URL
  const followupUrl = `https://discord.com/api/v10/webhooks/${interaction.application_id}/${interaction.token}`;

  // Schedule the follow-up using waitUntil
  ctx.waitUntil((async () => {
    const delay = Math.floor(Math.random() * 2000) + 1000; // 1–3s
    await new Promise(r => setTimeout(r, delay));
    await fetch(followupUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: `🎲 Answer: **${getDecision()}**`,
      }),
    });
  })());

  return thinkingResponse; // reply immediately
}