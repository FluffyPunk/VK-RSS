const subList = require("../schemas/subListSchema");

module.exports = {
  name: "unsub",
  async execute(msg, easyvk, vk) {
    groupInfo = await subList.findOne({
      groupId: vk.session.group_id,
    });
    let subs = groupInfo.subList;
    if (subs.includes(msg.from_id)) {
      subs.splice(subs.lastIndexOf(msg.from_id), 1);
      let update = await subList.updateOne(
        {
          groupId: vk.session.group_id,
        },
        { subList: subs }
      );
      vk.call("messages.send", {
        user_id: msg.from_id,
        message: `Вы отписались от рассылки`,
        random_id: easyvk.randomId(),
      });
    } else {
      vk.call("messages.send", {
        user_id: msg.from_id,
        message: `Вы и так не подписаны`,
        random_id: easyvk.randomId(),
      });
    }
  },
};
