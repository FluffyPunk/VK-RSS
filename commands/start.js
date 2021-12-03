const subList = require("../schemas/subListSchema");

module.exports = {
  name: "start",
  async execute(msg, easyvk, vk) {
    let groupInfo = await subList.findOne({
      groupId: vk.session.group_id,
    });
    async function getMods() {
      let ids = new Array();
      let obj = await vk.call("groups.getMembers", {
        group_id: vk.session.group_id,
        filter: "managers",
      });
      obj.items.forEach((user) => ids.push(user.id));
      return ids;
    }
    let modList = await getMods();
    if (!groupInfo) {
      subList.create({
        groupId: vk.session.group_id,
        modList,
        busyStatus: false,
      });
      vk.call("messages.send", {
        user_id: msg.from_id,
        message: "Создана запись вашей группы",
        random_id: easyvk.randomId(),
      });
    } else
      vk.call("messages.send", {
        user_id: msg.from_id,
        message: "Запись в БД уже создана",
        random_id: easyvk.randomId(),
      });
  },
};
