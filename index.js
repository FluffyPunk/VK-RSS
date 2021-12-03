const easyvk = require("easyvk");
const fs = require("fs");
const mongoose = require("mongoose");
const subList = require("./schemas/subListSchema");
require("dotenv").config();

async function main() {
  let commands = new Map();
  const commandFiles = fs
    .readdirSync("./commands/")
    .filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.set(command.name, command);
  }
  let vk = await easyvk({
    token: process.env.TOKEN,
    utils: { longpoll: true },
  });
  mongoose
    .connect(process.env.MONGO, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("DB Connected"))
    .catch((err) => console.log(err));
  async function getMessage(msgArray = []) {
    const MESSAGE_ID__INDEX = 1;
    return vk.call("messages.getById", {
      message_ids: msgArray[MESSAGE_ID__INDEX],
    });
  }
  let conn = await vk.longpoll.connect({
    forGetLongPollServer: {
      group_id: vk.session.group_id,
    },
  });

  conn.on("message", async (msg) => {
    let prefix = "!";
    let fullMessageArr = await getMessage(msg);

    fullMessage = fullMessageArr.items[0];
    let input = fullMessage.text;
    if (!fullMessage.out) {
      if (input.startsWith(prefix)) {
        const args = input.slice(prefix.length).split(/ +/);
        const command = args.shift().toLowerCase();
        if (command === "пинг") {
          commands.get("ping").execute(fullMessage, easyvk, vk);
        }
        if (command === "подписка") {
          commands.get("sub").execute(fullMessage, easyvk, vk);
        }
        if (command === "отписка") {
          commands.get("unsub").execute(fullMessage, easyvk, vk);
        }
        if (command === "старт") {
          commands.get("start").execute(fullMessage, easyvk, vk);
        }
        if (command === "рассылка") {
          commands.get("post").execute(fullMessage, easyvk, vk, conn);
        }
      }
    }
  });
}

main();
