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

  // Step 1: Send a DEFERRED response (safe for Workers, no timeout issue)
  const deferredResponse = {
    type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
  };

  // Step 2: Send follow-up after a random delay
  (async () => {
    const delay = Math.floor(Math.random() * 2000) + 1000; // 1–3s
    await new Promise(resolve => setTimeout(resolve, delay));

    const followupUrl = `https://discord.com/api/v10/webhooks/${interaction.application_id}/${interaction.token}`;
    await fetch(followupUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: `🤔 You asked: **${question}**\n🎲 Answer: **${getDecision()}**`
      }),
    });
  })();

  return deferredResponse;
}