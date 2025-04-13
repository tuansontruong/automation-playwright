const { App } = require('@slack/bolt');
const axios = require('axios');

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
});

// GitHub repository details
const GITHUB_OWNER = 'your-org';
const GITHUB_REPO = 'your-repo';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

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
  await ack();
  
  const [testSuite, environment] = command.text.split(' ');
  
  if (!testSuite || !COMMANDS[testSuite]) {
    await say(`Invalid test suite. Available options: ${Object.keys(COMMANDS).join(', ')}`);
    return;
  }
  
  if (!environment || !ENVIRONMENTS.includes(environment)) {
    await say(`Invalid environment. Available options: ${ENVIRONMENTS.join(', ')}`);
    return;
  }
  
  try {
    await say(`Starting ${testSuite} tests on ${environment} environment...`);
    
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
    
    await say(`Test run initiated! You'll be notified when it completes.`);
  } catch (error) {
    console.error(error);
    await say('Failed to start test run. Please try again later.');
  }
});

// Start the app
(async () => {
  await app.start(process.env.PORT || 3000);
  console.log('⚡️ Bolt app is running!');
})(); 