import Telegraf from 'telegraf';
import {DockerWatcher} from "./DockerWatcher";


async function main() {
  const bot = new Telegraf(process.env.BOT_TOKEN as string);
  const globalPw = process.env.GLOBAL_PW;

  const logInMessage = 'Please log in';
  const welcomeMessage = 'Welcome to the Docker Monitor Bot! You will receive notifications if a container stops in your deployment!';

  const loggedIn: number[] = [];

  console.log('Starting bot!');
  bot.start((ctx) => {
    if (ctx.message && ctx.message.from && loggedIn[ctx.message.from.id]) {
      ctx.reply('Welcome back!');
      ctx.reply(welcomeMessage);
    } else {
      ctx.reply(logInMessage)
    }
  });
  bot.help((ctx) => ctx.reply('FAZ+ link'));
  await bot.on('message', async (ctx) => {
    if (ctx.message && ctx.message.from && ctx.message.text) {
      if (!loggedIn.includes(ctx.message.from.id)) {
        if (ctx.message.text == globalPw) {
          loggedIn.push(ctx.message.from.id);
          await ctx.reply(welcomeMessage);
        } else {
          await ctx.reply('Wrong password');
          await ctx.reply(logInMessage);
        }
      }
    } else {
      await ctx.reply('An error occurred!');
    }
  });

  await bot.launch();
  console.log('Everything set up!');

  const dockerWatcher = new DockerWatcher(bot);
  setInterval(() => dockerWatcher.update(loggedIn), 10000);
}

(async () => {
  try {
    await main();
  } catch (ex) {
    console.error(ex);
    process.exit(1);
  }
})();
