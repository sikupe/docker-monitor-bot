# Docker Monitor Bot
## What does it do?
This bot monitors all your docker containers and sends notifications, if a container was stopped.

## How to deploy?
Create a `credentials.env` file with your Telegram Bot token as `BOT_TOKEN` and your login password to protect your bot from unauthorized access as `GLOBAL_PW`

To start the bot, just run `docker-compose up -d`.

## How to use?
Start the chat with your bot and send it your login password defined in `GLOBAL_PW`, than you will receive notifications whenever a docker container stops.