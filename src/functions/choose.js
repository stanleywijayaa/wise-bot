function getPrefix() {
  const Prefix = [
    "After some careful consideration, I have come to a decision:",
    "After weighing the options, I believe the answer is:",
    "Destiny has spoken, and the answer is:",
    "The stars have aligned, and the answer is:",
    "I feel like choosing:",
    "Like a sword pulled from stone, the chosen one is:",
    "setelah berpikir panjang, saya memilih:",
  ];
  const randomIndex = Math.floor(Math.random() * Prefix.length);
  return Prefix[randomIndex];
}

export async function handleChooseCommand(interaction) {
  const options = interaction.data.options?.find(
    (opt) => opt.name === "options"
  )?.value;

  // Follow-up webhook URL
  const followupUrl = `https://discord.com/api/v10/webhooks/${interaction.application_id}/${interaction.token}`;

  // Schedule the follow-up using waitUntil
  const delay = Math.floor(Math.random() * 2000) + 1000; // 1–3s
  await new Promise((r) => setTimeout(r, delay));
  const optionsArray = options.split(",").map((opt) => opt.trim());
  const chosen = optionsArray[Math.floor(Math.random() * optionsArray.length)];
  const response = `${getPrefix()} **${chosen}**`;
  await fetch(followupUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      content: response,
    }),
  });
}
