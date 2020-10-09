import Telegraf from "telegraf";

const {exec} = require('child_process');

export class DockerWatcher {
  private bot: Telegraf<any>;
  private containers: any[] = [];

  constructor(bot: Telegraf<any>) {
    this.bot = bot;
  }

  update(users: number[]): void {
    exec("docker ps --format \'{{json . }}\'", async (err, stdout, stderr) => {
      if (err) {
        console.log(`Couldn't fetch docker status: ${stderr}`)
        return;
      }

      const containerStrings = stdout.split("\n");
      const containers: any[] = [];
      for (const containerString of containerStrings) {
        if(!!containerString && containerString != "") {
          containers.push(JSON.parse(containerString));
        }
      }


      for (const container of this.containers) {
        let isContained = false;
        for (const activeContainer of containers) {
          if (activeContainer.ID == container.ID) {
            isContained = true;
            break;
          }
        }
        if (!isContained) {
          for (const user of users) {
            await this.bot.telegram.sendMessage(user, `Container ${container.Names}`);
          }
          const index = this.containers.indexOf(container)
          this.containers = this.containers.splice(index, 1);
        }
      }


      for (const activeContainer of containers) {
        let isContained = false;
        for (const container of this.containers) {
          if (activeContainer.ID == container.ID) {
            isContained = true;
            break;
          }
        }
        if (!isContained) {
          this.containers.push(activeContainer);
        }
      }

    });

  }
}