const { App } = require('@slack/bolt');
const axios = require('axios');
const ConfigurationManager = require('../core/helper/ConfigurationManager');


const app = new App({
  token: ConfigurationManager.getProperty('SLACK_BOT_TOKEN'),
  signingSecret: ConfigurationManager.getProperty('SLACK_SIGNING_SECRET')
});

// GitHub repository details
const GITHUB_OWNER = ConfigurationManager.getProperty('GITHUB_OWNER');
const GITHUB_REPO = ConfigurationManager.getProperty('GITHUB_REPO');
const GITHUB_TOKEN = ConfigurationManager.getProperty('GITHUB_TOKEN');

// Available commands
const COMMANDS = {
  regression: 'Run regression tests',
  smoke: 'Run smoke tests',
  carrier: 'Run carrier overview tests',
  return: 'Run return overview tests',
  shipment: 'Run shipment overview tests'
};

// Available environments
const ENVIRONMENTS = ['apollo', 'bruno'];

app.command('/run-tests', async ({ command, ack, say }) => {
  // Acknowledge the command immediately
  await ack({
    response_type: 'ephemeral',
    text: 'Starting test run...'
  });
  
  const [testSuite, environment] = command.text.split(' ');
  
  if (!testSuite || !COMMANDS[testSuite]) {
    await say({
      text: `Invalid test suite. Available options: ${Object.keys(COMMANDS).join(', ')}`,
      channel: command.channel_id
    });
    return;
  }
  
  if (!environment || !ENVIRONMENTS.includes(environment)) {
    await say({
      text: `Invalid environment. Available options: ${ENVIRONMENTS.join(', ')}`,
      channel: command.channel_id
    });
    return;
  }
  
  try {
    // Send initial message
    await say({
      text: `Starting ${testSuite} tests on ${environment} environment...`,
      channel: command.channel_id
    });
    
    // Trigger GitHub Actions workflow
    await axios.post(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/dispatches`,
      {
        event_type: 'slack-command',
        client_payload: {
          command: testSuite,
          environment: environment,
          channel_id: command.channel_id
        }
      },
      {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          Accept: 'application/vnd.github.v3+json'
        }
      }
    );
    
    // Send confirmation message
    await say({
      text: `Test run initiated! You'll be notified when it completes.`,
      channel: command.channel_id
    });
  } catch (error) {
    console.error(error);
    await say({
      text: 'Failed to start test run. Please try again later.',
      channel: command.channel_id
    });
  }
});

// Start the app
(async () => {
  await app.start(process.env.PORT || 3000);
  console.log('⚡️ Bolt app is running!');
})(); 