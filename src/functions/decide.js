function getDecision() {
  const answers = [
    "👍Yes",
    "👎No",
    "🙅🏾hellnaw",
    "GASKAN!!!🔥🔥🔥",
    "🙂‍↔️jangan bang",
    "🏃🏾‍♀️💨tanya lagi nanti",
  ];
  const randomIndex = Math.floor(Math.random() * answers.length);
  return answers[randomIndex];
}

export async function handleDecideCommand(interaction) {
  const question = interaction.data.options?.find(
    (opt) => opt.name === "question"
  )?.value;

  // Follow-up webhook URL
  const followupUrl = `https://discord.com/api/v10/webhooks/${interaction.application_id}/${interaction.token}`;

  let response;
  const delay = Math.floor(Math.random() * 2000) + 1000; // 1–3s
  if (!question) {
    response = `Answer: **${getDecision()}**`;
  } else {
    response = `Answer to "${question}": **${getDecision()}**`;
  }
  await new Promise((r) => setTimeout(r, delay));
  await fetch(followupUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      content: response,
    }),
  });
}
