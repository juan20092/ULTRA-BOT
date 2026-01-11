const GROUP_LINK_REGEX = /chat\.whatsapp\.com\/(?:invite\/)?([0-9A-Za-z]{20,24})/i;
const CHANNEL_LINK_REGEX = /whatsapp\.com\/channel\/([0-9A-Za-z]+)/i;
if (!global.antifloodLinks) global.antifloodLinks = new Map();

function ALERT_MESSAGE(senderId, isChannelLink, botIsAdmin) {
  return '> 🚫 𝖤𝗇𝗅𝖺𝖼𝖾𝗌 𝖽𝖾 𝖶𝗁𝖺𝗍𝗌𝖠𝗉𝗉 𝖾𝗌𝗍𝖺́𝗇 𝗉𝗋𝗈𝗁𝗂𝖻𝗂𝖽𝗈𝗌.';
}

export async function before(m, { conn, isAdmin, isBotAdmin, rcanal }) {
  if (!m || !m.text) return;
  if (m.isBaileys && m.fromMe) return true;
  if (!m.isGroup) return false;

  const chat = global.db?.data?.chats?.[m.chat];
  if (!chat || !chat.antiLink) return true;
  if (isAdmin) return true;

  const text = String(m.text);
  const isGroupLink = GROUP_LINK_REGEX.test(text);
  const isChannelLink = CHANNEL_LINK_REGEX.test(text);

  if (!isGroupLink && !isChannelLink) return true;

  try {
    if (isBotAdmin) await conn.sendMessage(m.chat, { delete: m.key });
  } catch (e) {}

  const last = global.antifloodLinks.get(m.sender) || 0;
  const now = Date.now();
  if (now - last > 5000) {
    global.antifloodLinks.set(m.sender, now);
    try {
      await conn.reply(m.chat, ALERT_MESSAGE(m.sender, isChannelLink, isBotAdmin), null, { 
        mentions: [m.sender],
        contextInfo: rcanal?.contextInfo || {}
      });
    } catch (e) {}
  }

  if (isBotAdmin) {
    try {
      await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove');
    } catch (e) {}
  }

  return true;
}
