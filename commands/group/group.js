const kick = {
  name: "kick",
  description: "Kick a member from group",
  category: "group",
  groupOnly: true,
  adminOnly: true,
  async execute({ sock, jid, msg, args, reply, isOwner, isBotAdmin }) {
    if (!isBotAdmin) return reply("❌ Bot must be admin to kick members!");
    const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
    const target = mentioned[0] || (args[0] ? args[0].replace(/[^0-9]/g, "") + "@s.whatsapp.net" : null);
    if (!target) return reply("❌ Tag a member to kick!\nUsage: .kick @user");
    await sock.groupParticipantsUpdate(jid, [target], "remove");
    reply(`✅ *Kicked:* @${target.split("@")[0]}`);
  },
};

const promote = {
  name: "promote",
  description: "Promote member to admin",
  category: "group",
  groupOnly: true,
  adminOnly: true,
  async execute({ sock, jid, msg, args, reply, isBotAdmin }) {
    if (!isBotAdmin) return reply("❌ Bot must be admin!");
    const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
    const target = mentioned[0] || (args[0] ? args[0].replace(/[^0-9]/g, "") + "@s.whatsapp.net" : null);
    if (!target) return reply("❌ Tag a member!\nUsage: .promote @user");
    await sock.groupParticipantsUpdate(jid, [target], "promote");
    reply(`✅ *Promoted to Admin:* @${target.split("@")[0]}`);
  },
};

const demote = {
  name: "demote",
  description: "Demote admin to member",
  category: "group",
  groupOnly: true,
  adminOnly: true,
  async execute({ sock, jid, msg, args, reply, isBotAdmin }) {
    if (!isBotAdmin) return reply("❌ Bot must be admin!");
    const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
    const target = mentioned[0] || (args[0] ? args[0].replace(/[^0-9]/g, "") + "@s.whatsapp.net" : null);
    if (!target) return reply("❌ Tag a member!\nUsage: .demote @user");
    await sock.groupParticipantsUpdate(jid, [target], "demote");
    reply(`✅ *Demoted:* @${target.split("@")[0]}`);
  },
};

const add = {
  name: "add",
  description: "Add member to group",
  category: "group",
  groupOnly: true,
  adminOnly: true,
  async execute({ sock, jid, args, reply, isBotAdmin }) {
    if (!isBotAdmin) return reply("❌ Bot must be admin!");
    if (!args[0]) return reply("❌ Usage: .add 923XXXXXXXXX");
    const num = args[0].replace(/[^0-9]/g, "") + "@s.whatsapp.net";
    const res = await sock.groupParticipantsUpdate(jid, [num], "add");
    reply(`✅ *Added:* ${args[0]}`);
  },
};

const tagall = {
  name: "tagall",
  description: "Tag all group members",
  category: "group",
  groupOnly: true,
  adminOnly: true,
  async execute({ sock, jid, msg, args, isBotAdmin }) {
    const groupMeta = await sock.groupMetadata(jid);
    const members = groupMeta.participants.map((p) => p.id);
    const text = args.join(" ") || "📢 Attention everyone!";
    let tagText = `╭┈───〔 *TAG ALL* 〕┈───⊷\n`;
    tagText += `├▢ 📢 ${text}\n`;
    tagText += `├▢ 👥 Members: ${members.length}\n`;
    tagText += `╰───────────────────⊷\n\n`;
    members.forEach((m) => { tagText += `@${m.split("@")[0]}\n`; });
    await sock.sendMessage(jid, { text: tagText, mentions: members }, { quoted: msg });
  },
};

const tagadmins = {
  name: "tagadmins",
  description: "Tag all admins",
  category: "group",
  groupOnly: true,
  async execute({ sock, jid, msg, args }) {
    const groupMeta = await sock.groupMetadata(jid);
    const admins = groupMeta.participants.filter((p) => p.admin).map((p) => p.id);
    const text = args.join(" ") || "📢 Attention admins!";
    let tagText = `╭┈───〔 *TAG ADMINS* 〕┈───⊷\n`;
    tagText += `├▢ 📢 ${text}\n`;
    tagText += `╰───────────────────⊷\n\n`;
    admins.forEach((a) => { tagText += `@${a.split("@")[0]}\n`; });
    await sock.sendMessage(jid, { text: tagText, mentions: admins }, { quoted: msg });
  },
};

const mute = {
  name: "mute",
  description: "Mute group (only admins can send)",
  category: "group",
  groupOnly: true,
  adminOnly: true,
  async execute({ sock, jid, reply, isBotAdmin }) {
    if (!isBotAdmin) return reply("❌ Bot must be admin!");
    await sock.groupSettingUpdate(jid, "announcement");
    reply("🔇 *Group Muted!* Only admins can send messages.");
  },
};

const unmute = {
  name: "unmute",
  description: "Unmute group",
  category: "group",
  groupOnly: true,
  adminOnly: true,
  async execute({ sock, jid, reply, isBotAdmin }) {
    if (!isBotAdmin) return reply("❌ Bot must be admin!");
    await sock.groupSettingUpdate(jid, "not_announcement");
    reply("🔊 *Group Unmuted!* Everyone can send messages.");
  },
};

const ginfo = {
  name: "ginfo",
  description: "Get group info",
  category: "group",
  groupOnly: true,
  async execute({ sock, jid, msg }) {
    const meta = await sock.groupMetadata(jid);
    const admins = meta.participants.filter((p) => p.admin).length;
    const members = meta.participants.length;
    await sock.sendMessage(jid, {
      text:
        `╭┈───〔 *GROUP INFO* 〕┈───⊷\n` +
        `├▢ 📛 *Name:* ${meta.subject}\n` +
        `├▢ 🆔 *ID:* ${jid}\n` +
        `├▢ 👥 *Members:* ${members}\n` +
        `├▢ 👑 *Admins:* ${admins}\n` +
        `├▢ 📅 *Created:* ${new Date(meta.creation * 1000).toLocaleDateString()}\n` +
        `├▢ 📝 *Desc:* ${meta.desc || "None"}\n` +
        `╰───────────────────⊷`,
    }, { quoted: msg });
  },
};

const link = {
  name: "link",
  description: "Get group invite link",
  category: "group",
  groupOnly: true,
  adminOnly: true,
  async execute({ sock, jid, reply, isBotAdmin }) {
    if (!isBotAdmin) return reply("❌ Bot must be admin!");
    const code = await sock.groupInviteCode(jid);
    reply(`🔗 *Group Link:*\nhttps://chat.whatsapp.com/${code}`);
  },
};

const revoke = {
  name: "revoke",
  description: "Revoke group invite link",
  category: "group",
  groupOnly: true,
  adminOnly: true,
  async execute({ sock, jid, reply, isBotAdmin }) {
    if (!isBotAdmin) return reply("❌ Bot must be admin!");
    await sock.groupRevokeInvite(jid);
    reply("✅ *Group invite link revoked!*");
  },
};

const join = {
  name: "join",
  description: "Join group via invite link",
  category: "group",
  ownerOnly: true,
  async execute({ sock, args, reply }) {
    if (!args[0]) return reply("❌ Usage: .join https://chat.whatsapp.com/XXXXXX");
    const code = args[0].split("chat.whatsapp.com/")[1];
    if (!code) return reply("❌ Invalid invite link!");
    await sock.groupAcceptInvite(code);
    reply("✅ *Joined group successfully!*");
  },
};

const out = {
  name: "out",
  description: "Bot leaves the group",
  category: "group",
  groupOnly: true,
  ownerOnly: true,
  async execute({ sock, jid, reply }) {
    await reply("👋 *Leaving group...*");
    await sock.groupLeave(jid);
  },
};

const poll = {
  name: "poll",
  description: "Create a poll",
  category: "group",
  groupOnly: true,
  async execute({ sock, jid, msg, args, reply }) {
    if (args.length < 3) return reply("❌ Usage: .poll Question | Option1 | Option2 | ...");
    const full = args.join(" ").split("|");
    const question = full[0].trim();
    const options = full.slice(1).map((o) => ({ optionName: o.trim() }));
    if (options.length < 2) return reply("❌ At least 2 options needed!");
    await sock.sendMessage(jid, {
      poll: { name: question, values: options.map((o) => o.optionName), selectableCount: 1 },
    }, { quoted: msg });
  },
};

const broadcast = {
  name: "broadcast",
  description: "Broadcast message to all groups",
  category: "group",
  ownerOnly: true,
  async execute({ sock, args, reply }) {
    if (!args[0]) return reply("❌ Usage: .broadcast Message");
    const text = args.join(" ");
    const groups = await sock.groupFetchAllParticipating();
    const groupIds = Object.keys(groups);
    let sent = 0;
    for (const gid of groupIds) {
      try {
        await sock.sendMessage(gid, { text });
        sent++;
        await new Promise((r) => setTimeout(r, 1000));
      } catch (e) {}
    }
    reply(`✅ *Broadcast sent to ${sent}/${groupIds.length} groups!*`);
  },
};

const updategname = {
  name: "updategname",
  description: "Update group name",
  category: "group",
  groupOnly: true,
  adminOnly: true,
  async execute({ sock, jid, args, reply, isBotAdmin }) {
    if (!isBotAdmin) return reply("❌ Bot must be admin!");
    if (!args[0]) return reply("❌ Usage: .updategname New Name");
    await sock.groupUpdateSubject(jid, args.join(" "));
    reply("✅ *Group name updated!*");
  },
};

const updategdesc = {
  name: "updategdesc",
  description: "Update group description",
  category: "group",
  groupOnly: true,
  adminOnly: true,
  async execute({ sock, jid, args, reply, isBotAdmin }) {
    if (!isBotAdmin) return reply("❌ Bot must be admin!");
    if (!args[0]) return reply("❌ Usage: .updategdesc New Description");
    await sock.groupUpdateDescription(jid, args.join(" "));
    reply("✅ *Group description updated!*");
  },
};

const hidetag = {
  name: "hidetag",
  description: "Tag all without showing names",
  category: "group",
  groupOnly: true,
  adminOnly: true,
  async execute({ sock, jid, msg, args }) {
    const meta = await sock.groupMetadata(jid);
    const members = meta.participants.map((p) => p.id);
    const text = args.join(" ") || "📢";
    await sock.sendMessage(jid, { text, mentions: members }, { quoted: msg });
  },
};

module.exports = [
  kick, promote, demote, add, tagall, tagadmins, mute, unmute,
  ginfo, link, revoke, join, out, poll, broadcast,
  updategname, updategdesc, hidetag
];
