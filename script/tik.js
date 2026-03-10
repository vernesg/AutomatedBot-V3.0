module.exports.config = {
  name: "tiktok",
  version: "1.0.0",
  permission: "0",
  credits: "Kim Joseph DG Bien", //REMAKE BY JONELL
  description: "tiktok search",
  prefix: false,
  premium: false,
  category: "without prefix",
  usage: "[Tiktok <search>]",
  cooldowns: 5
};

const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.run = async function({ api, event, args }) {
  try {
    const searchQuery = args.join(" ");
    if (!searchQuery) {
      api.sendMessage("usage : tiktok <search text>", event.threadID);
      return;
    }

  const gg = await api.sendMessage("Searching, hintay...", event.threadID);

    const response = await axios.get(`https://ccprojectapis.ddns.net/api/tiktok/searchvideo?keywords=${encodeURIComponent(searchQuery)}`);
    const videos = response.data.data.videos;

    if (!videos || videos.length === 0) {
      api.sendMessage("No videos found for the given search query.", event.threadID);
      return;
    }

    const videoData = videos[0];
    const videoUrl = videoData.play;

    const message = `tiktok result :\n\nposted by : ${videoData.author.nickname}\nusername : ${videoData.author.unique_id}\n\ntitle: ${videoData.title}`;
           api.unsendMessage(gg.messageID);
    const filePath = path.join(__dirname, `/cache/tiktok_video.mp4`);
    const writer = fs.createWriteStream(filePath);

    const videoResponse = await axios({
      method: 'get',
      url: videoUrl,
      responseType: 'stream'
    });

    videoResponse.data.pipe(writer);

    writer.on('finish', () => {
      api.sendMessage(
        { body: message, attachment: fs.createReadStream(filePath) },
        event.threadID,
        () => fs.unlinkSync(filePath)
      );
    });
  } catch (error) {
    api.sendMessage("bawal ma send kasi ang cute mo.", event.threadID);
  }
};