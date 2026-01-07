const handler = async (m, { conn, participants, usedPrefix, command, rcanal }) => {
  if (!m.mentionedJid[0] && !m.quoted) {
    return conn.reply(m.chat, `> 🔊 *𝘔𝘦𝘯𝘤𝘪𝘰𝘯𝘢 𝘰 𝘳𝘦𝘴𝘱𝘰𝘯𝘥𝘦 𝘢𝘭 𝘶𝘴𝘶𝘢𝘳𝘪𝘰*\n> 𝘘𝘶𝘦 𝘥𝘦𝘴𝘦𝘢𝘴 𝘥𝘦𝘨𝘳𝘢𝘥𝘢𝘳`, m, { contextInfo: rcanal?.contextInfo || {} })
  }

  let user = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted.sender
  
  // Asegurar formato correcto del JID
  if (!user.includes('@')) {
    user = user + '@s.whatsapp.net'
  }
  
  const bot = conn.user.jid
  const isBot = user === bot

  if (isBot) {
    return conn.reply(m.chat, `> 🚫 *𝘕𝘰 𝘱𝘶𝘦𝘥𝘰 𝘥𝘦𝘨𝘳𝘢𝘥𝘢𝘳𝘮𝘦 𝘢 𝘮𝘪 𝘮𝘪𝘴𝘮𝘰*\n> 𝘚𝘦𝘭𝘦𝘤𝘤𝘪𝘰𝘯𝘢 𝘰𝘵𝘳𝘰 𝘶𝘴𝘶𝘢𝘳𝘪𝘰`, m, { contextInfo: rcanal?. contextInfo || {} })
  }

  await conn.sendMessage(m.chat, {
    react: { text: '👤', key: m.key }
  })

  await conn.groupParticipantsUpdate(m. chat, [user], 'demote')

  await conn.sendMessage(m.chat, {
    text: `> 🥶 *𝘜𝘴𝘶𝘢𝘳𝘪𝘰 𝘥𝘦𝘨𝘳𝘢𝘥𝘢𝘥𝘰 𝘦𝘹𝘪𝘵𝘰𝘴𝘢𝘮𝘦𝘯𝘵𝘦*\n> @${user. split('@')[0]} 𝘠𝘢 𝘯𝘰 𝘦𝘴 𝘢𝘥𝘮𝘪𝘯`,
    mentions: [user]
  }, { quoted: m })
}

handler.help = ['demote']
handler.tags = ['group']
handler.customPrefix = /^\.?demote(\s|$)/i;
handler.command = new RegExp();
handler.admin = true
handler. botAdmin = true

export default handler
