const handler = async (msg, { conn, rcanal }) => {
  const chatId = msg.key.remoteJid
  const ctx = msg.message?.extendedTextMessage?.contextInfo

  if (!ctx?.stanzaId) {
    await conn.sendMessage(chatId, {
      text: "🔪 𝖱𝖾𝗌𝗉𝗈𝗇𝖽𝖾 𝖺𝗅 𝗆𝖾𝗇𝗌𝖺𝗃𝖾 𝗊𝗎𝖾 𝖽𝖾𝗌𝖾𝖺𝗌 𝖾𝗅𝗂𝗆𝗂𝗇𝖺𝗋.",
      contextInfo: rcanal?.contextInfo || {}
    }, { quoted: msg })
    return
  }

  // Reacción de confirmación
  await conn.sendMessage(chatId, {
    react: { text: '🗑️', key: msg.key }
  })

  try {
    await conn.sendMessage(chatId, {
      delete: {
        remoteJid: chatId,
        fromMe: false,
        id: ctx.stanzaId,
        participant: ctx.participant
      }
    })

    await conn.sendMessage(chatId, {
      delete: {
        remoteJid: chatId,
        fromMe: msg.key.fromMe || false,
        id: msg.key.id,
        participant: msg.key.participant || undefined
      }
    })

  } catch (e) {
    console.error("🚫 𝖾𝗋𝗋𝗈𝗋 𝖺𝗅 𝖾𝗅𝗂𝗆𝗂𝗇𝖺𝗋:", e)
    await conn.sendMessage(chatId, {
      text: "🚫 𝖭𝗈 𝗌𝖾 𝗉𝗎𝖽𝗈 𝖾𝗅𝗂𝗆𝗂𝗇𝖺𝗋.",
      contextInfo: rcanal?.contextInfo || {}
    }, { quoted: msg })
  }
}

handler.help = ["𝖣𝖾𝗅𝖾𝗍𝖾"];
handler.tags = ["𝖦𝖱𝖴𝖯𝖮𝖲"];
handler.customPrefix = /^\.?(del|delete)$/i;
handler.command = new RegExp();
handler.group = true;
handler.admin = true;
handler.botAdmin = true;
export default handler
