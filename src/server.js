import { AutoRouter } from 'itty-router';
import {
  InteractionResponseType,
  InteractionType,
  verifyKey,
} from 'discord-interactions';
import { DECIDE_COMMAND, CHOOSE_COMMAND } from './commands.js';
import { handleDecideCommand } from './functions/decide.js';
import { handleChooseCommand } from './functions/choose.js';

class JsonResponse extends Response {
  constructor(body, init) {
    const jsonBody = JSON.stringify(body);
    init = init || {
      headers: {
        'content-type': 'application/json;charset=UTF-8',
      },
    };
    super(jsonBody, init);
  }
}

const router = AutoRouter();

/**
 * A simple :wave: hello page to verify the worker is working.
 */
router.get('/', (request, env) => {
  return new Response(`👋 ${env.DISCORD_APPLICATION_ID}`);
});

router.post('/', async (request, env, ctx) => {
  const { isValid, interaction } = await verifyDiscordRequest(
    request,
    env,
  );
  if (!isValid || !interaction) {
    return new Response('Bad request signature.', { status: 401 });
  }

  // Handle the interaction based on its type
  if (interaction.type === InteractionType.PING) {
    return new JsonResponse({
      type: InteractionResponseType.PONG,
    });
  }

  if (interaction.type === InteractionType.APPLICATION_COMMAND) {
    // Most user commands will come as `APPLICATION_COMMAND`.
    switch (interaction.data.name.toLowerCase()) {    
      case DECIDE_COMMAND.name.toLowerCase():
        ctx.waitUntil(
          handleDecideCommand(interaction)
        );
        return new JsonResponse({type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE});
      
      case CHOOSE_COMMAND.name.toLowerCase():
        ctx.waitUntil(
          handleChooseCommand(interaction)
        );
        return new JsonResponse({type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE});
        
      default:
        return new JsonResponse({ error: 'Unknown command' }, { status: 400 });
    }
}

  console.error('Unknown Type');
  return new JsonResponse({ error: 'Unknown Type' }, { status: 400 });
});
router.all('*', () => new Response('Not Found.', { status: 404 }));

async function verifyDiscordRequest(request, env) {
  const signature = request.headers.get('x-signature-ed25519');
  const timestamp = request.headers.get('x-signature-timestamp');
  const body = await request.text();
  const isValidRequest =
    signature &&
    timestamp &&
    (await verifyKey(body, signature, timestamp, env.DISCORD_PUBLIC_KEY));
  if (!isValidRequest) {
    return { isValid: false };
  }

  return { interaction: JSON.parse(body), isValid: true };
}

export default {
  //Get discord request
  async fetch(request, env, ctx) {
    try {
      return await router.fetch(request, env, ctx);
    } catch (err) {
      console.error("Worker error:", err);
      return new Response("Internal error", { status: 500 });
    }
  },
};
