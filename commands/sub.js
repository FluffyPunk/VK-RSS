const subList = require("../schemas/subListSchema");

module.exports = {
  name: "sub",
  async execute(msg, easyvk, vk) {
    groupInfo = await subList.findOne({
      groupId: vk.session.group_id,
    });
    let subs = groupInfo.subList;
    if (subs.includes(msg.from_id)) {
      vk.call("messages.send", {
        user_id: msg.from_id,
        message: `Вы уже подписаны`,
        random_id: easyvk.randomId(),
      });
    } else {
      subs.push(msg.from_id);
      let update = await subList.updateOne(
        {
          groupId: vk.session.group_id,
        },
        { subList: subs }
      );
      vk.call("messages.send", {
        user_id: msg.from_id,
        message: `Поздравляем с подпиской на рассылку`,
        random_id: easyvk.randomId(),
      });
    }
  },
};
