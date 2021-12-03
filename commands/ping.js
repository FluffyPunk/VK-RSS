module.exports = {
  name: "ping",
  async execute(msg, easyvk, vk) {
    vk.call("messages.send", {
      user_id: msg.from_id,
      message: `pong`,
      random_id: easyvk.randomId(),
    });
  },
};
