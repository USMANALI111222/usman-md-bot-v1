const tiktok = {
  name: "tiktok",
  alias: ["tt", "tiktok2", "tiktok3"],
  description: "Download TikTok video",
  category: "download",
  async execute({ args, sock, jid, msg, reply }) {
    if (!args[0]) return reply("❌ Usage: .tiktok <url>");
    await reply("⏳ *Downloading TikTok...*");
    try {
      const res = await fetch(`https://api.tiklydown.eu.org/api/download?url=${encodeURIComponent(args[0])}`);
      const data = await res.json();
      if (!data?.video?.noWatermark) return reply("❌ Could not fetch video!");
      await sock.sendMessage(
        jid,
        { video: { url: data.video.noWatermark }, caption: `✅ *TikTok Video*\n📝 ${data.title || ""}`, mimetype: "video/mp4" },
        { quoted: msg }
      );
    } catch (e) {
      reply("❌ Error downloading. Make sure the URL is valid!");
    }
  },
};

const ytv = {
  name: "ytv",
  description: "Download YouTube video",
  category: "download",
  async execute({ args, reply }) {
    if (!args[0]) return reply("❌ Usage: .ytv <youtube-url>");
    reply(
      `📥 *YouTube Downloader*\n\n` +
      `🔗 URL: ${args[0]}\n\n` +
      `💡 *Note:* Use yt-dlp in Termux:\n` +
      `\`yt-dlp -f best "${args[0]}"\``
    );
  },
};

const song = {
  name: "song",
  alias: ["play", "music"],
  description: "Search and get song",
  category: "download",
  async execute({ args, reply }) {
    if (!args[0]) return reply("❌ Usage: .song song name");
    await reply(`🎵 *Searching:* ${args.join(" ")}...\n\n💡 Feature coming soon! Use YouTube for now.`);
  },
};

const fb = {
  name: "fb",
  description: "Download Facebook video",
  category: "download",
  async execute({ args, reply }) {
    if (!args[0]) return reply("❌ Usage: .fb <facebook-url>");
    reply(`📥 *Facebook Downloader*\n\n💡 Use Termux:\n\`yt-dlp "${args[0]}"\``);
  },
};

const igdl = {
  name: "igdl",
  alias: ["igdl2", "igdl3"],
  description: "Download Instagram media",
  category: "download",
  async execute({ args, reply }) {
    if (!args[0]) return reply("❌ Usage: .igdl <instagram-url>");
    try {
      const res = await fetch(`https://instagram-downloader-download-instagram-videos-stories.p.rapidapi.com/index?url=${encodeURIComponent(args[0])}`, {
        headers: { "X-RapidAPI-Host": "instagram-downloader-download-instagram-videos-stories.p.rapidapi.com" }
      });
      reply("📥 Instagram download feature - Please add RapidAPI key in config!");
    } catch {
      reply("❌ Could not download. Try: https://snapinsta.app");
    }
  },
};

const pinterest = {
  name: "pinterest",
  description: "Download Pinterest image",
  category: "download",
  async execute({ args, reply }) {
    if (!args[0]) return reply("❌ Usage: .pinterest <url>");
    reply(`📥 *Pinterest:* ${args[0]}\n\n💡 Use: https://www.pinterestdownloader.com`);
  },
};

const tts = {
  name: "tts",
  alias: ["ttmp3", "ttmag"],
  description: "TikTok to MP3",
  category: "download",
  async execute({ args, reply }) {
    if (!args[0]) return reply("❌ Usage: .tts <tiktok-url>");
    reply("📥 *TikTok MP3:* Feature coming soon!");
  },
};

const gitclone = {
  name: "gitclone",
  description: "Download GitHub repo as ZIP",
  category: "download",
  async execute({ args, reply }) {
    if (!args[0]) return reply("❌ Usage: .gitclone <github-url>");
    const url = args[0].replace("github.com", "github.com").replace(/\/$/, "");
    const zipUrl = `${url}/archive/refs/heads/main.zip`;
    reply(`📦 *GitHub Clone*\n\n🔗 ${zipUrl}\n\nTermux:\n\`git clone ${args[0]}\``);
  },
};

module.exports = [tiktok, ytv, song, fb, igdl, pinterest, tts, gitclone];
