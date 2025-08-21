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

export async function handleDecideCommand(interaction, env) {
  const question = interaction.data.options?.find(opt => opt.name === "question")?.value;

  // Immediate response (must be <3s)
  const thinkingResponse = {
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: `🤔 You asked: **${question}**\n> Sundabot is thinking...`,
    },
  };

  // Fire off a follow-up request in the background
  (async () => {
    const delay = Math.floor(Math.random() * 2000) + 1000; // 1–3s
    await new Promise(resolve => setTimeout(resolve, delay)); // ⚠️ won't block initial response

    const followupUrl = `https://discord.com/api/v10/webhooks/${interaction.application_id}/${interaction.token}`;
    await fetch(followupUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: `🎲 Answer: **${getDecision()}**`
      }),
    });
  })();

  return thinkingResponse;
}