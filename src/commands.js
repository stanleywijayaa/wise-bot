/**
 * Share command metadata from a common spot to be used for both runtime
 * and registration.
 */

export const INVITE_COMMAND = {
  name: 'invite',
  description: 'Get an invite link to add the bot to your server',
};

export const DECIDE_COMMAND = {
  name: 'decide',
  description: 'Assist one\'s decision making',
  type: 1, // CHAT_INPUT type
  integration_types: [0, 1],
  contexts: [0, 1, 2],
  options: [
    {
      name: 'question',
      description: 'The question to ask the bot',
      type: 3, // STRING type
    }
  ]
}

export const CHOOSE_COMMAND = {
  name: 'choose',
  description: 'assist one\'s to choose between options',
  type: 1, // CHAT_INPUT type
  integration_types: [0, 1],
  contexts: [0, 1, 2],
  options: [
    {
      name: 'options',
      description: 'the options to choose from',
      type: 3,
      required: true,
    }
  ]
}