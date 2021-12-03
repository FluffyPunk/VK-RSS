const subList = require("../schemas/subListSchema");

async function attachToString(attachArr = []) {
  let result = new String();
  attachArr.forEach((media) => {
    if (media.type === "photo") {
      console.log(true);
      result += `photo${media.photo.owner_id}_${media.photo.id}_${media.photo.access_key},`;
    }
    if (media.type === "video") {
      console.log(true);
      result += `video${media.video.owner_id}_${media.video.id}_${media.video.access_key},`;
    }
    if (media.type === "audio") {
      console.log(true);
      if (!media.audio.access_key) {
        result += `audio${media.audio.owner_id}_${media.audio.id},`;
      } else
        result += `audio${media.audio.owner_id}_${media.audio.id}_${media.audio.access_key},`;
    }
    if (media.type === "audio_message") {
      console.log(true);
      result += `audio_message${media.audio_message.owner_id}_${media.audio_message.id}_${media.audio_message.access_key},`;
    }
  });
  return result.slice(0, -1);
}

module.exports = {
  name: "post",
  async execute(msg, easyvk, vk, conn) {
    async function getMessage(msgArray = []) {
      const MESSAGE_ID__INDEX = 1;
      return vk.call("messages.getById", {
        message_ids: msgArray[MESSAGE_ID__INDEX],
      });
    }
    groupInfo = await subList.findOne({
      groupId: vk.session.group_id,
    });
    let askId = msg.conversation_message_id;
    if (groupInfo.modList.includes(msg.from_id)) {
      let busyStatus = groupInfo.busyStatus;
      if (busyStatus) {
        vk.call("messages.send", {
          user_id: msg.from_id,
          message: `Кто-то из модерации занимается публикацией`,
          random_id: easyvk.randomId(),
        });
      } else {
        vk.call("messages.send", {
          peer_ids: msg.from_id,
          message: `Отправьте текст для последующей рассылки`,
          random_id: easyvk.randomId(),
        }).then(async (msg) => {
          let busy = await subList.findOneAndUpdate(
            { groupId: vk.session.group_id },
            { busyStatus: true, announcerId: msg.from_id }
          );
          conn.on("message", async (input) => {
            let postArr = await getMessage(input);
            post = postArr.items[0];

            if (askId + 2 !== post.conversation_message_id)
              return await subList.findOneAndUpdate(
                { groupId: vk.session.group_id },
                {
                  busyStatus: false,
                  announcerId: msg.from_id,
                }
              );
            let skrepka = await attachToString(post.attachments);
            console.log(post.attachments);
            groupInfo.subList.forEach((id) => {
              setTimeout(
                () =>
                  vk.call("messages.send", {
                    user_id: id,
                    message: `Отвечаю ${post.text}`,
                    attachment: skrepka,
                    random_id: easyvk.randomId(),
                  }),
                100
              );
            });
          });
        });
      }
    }
  },
};
