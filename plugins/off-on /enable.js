const handler = async (m, { conn, usedPrefix, command, args, isOwner, isAdmin, isROwner, rcanal }) => {
  const chat = global.db.data.chats[m.chat]
  const user = global.db.data.users[m.sender]
  const bot = global.db.data.settings[conn.user.jid] || {}
  const isEnable = /^on$/i.test(command)
  
  const type = (args[0] || '').toLowerCase()
  let isAll = false, isUser = false
  
  switch (type) {
    case 'welcome':
    case 'bienvenida':
      if (!m.isGroup) {
        if (!isOwner) {
          await conn.sendMessage(m.chat, { text: '> Solo para grupos', mentions: [m.sender] }, { quoted: m })
          return
        }
      }
      chat.welcome = isEnable
      break
      
    case 'detect':
    case 'avisos':
      if (!m.isGroup) {
        if (!isOwner) {
          await conn.sendMessage(m.chat, { text: '> Solo para grupos', mentions: [m.sender] }, { quoted: m })
          return
        }
      }
      chat.detect = isEnable
      break
      
    case 'autolevelup':
    case 'autonivel':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          await conn.sendMessage(m.chat, { text: '> Solo admins', mentions: [m.sender] }, { quoted: m })
          return
        }
      }
      chat.autolevelup = isEnable
      break
      
    case 'restrict':
    case 'restringir':
      isAll = true
      if (!isOwner) {
        await conn.sendMessage(m.chat, { text: '> Solo owner', mentions: [m.sender] }, { quoted: m })
        return
      }
      bot.restrict = isEnable
      break
      
    case 'antilink':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          await conn.sendMessage(m.chat, { text: '> Solo admins', mentions: [m.sender] }, { quoted: m })
          return
        }
      }
      chat.antiLink = isEnable
      break
      
    case 'nsfw':
    case 'modohorny':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          await conn.sendMessage(m.chat, { text: '> Solo admins', mentions: [m.sender] }, { quoted: m })
          return
        }
      }
      chat.nsfw = isEnable
      break
      
    case 'autosticker':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          await conn.sendMessage(m.chat, { text: '> Solo admins', mentions: [m.sender] }, { quoted: m })
          return
        }
      }
      chat.autosticker = isEnable
      break
      
    case 'antidelete':
    case 'antieliminar':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          await conn.sendMessage(m.chat, { text: '> Solo admins', mentions: [m.sender] }, { quoted: m })
          return
        }
      }
      chat.delete = isEnable
      break
      
    case 'document':
    case 'documento':
      if (!isOwner) {
        await conn.sendMessage(m.chat, { text: '> Solo owner', mentions: [m.sender] }, { quoted: m })
        return
      }
      chat.useDocument = isEnable
      break
      
    case 'autoread':
    case 'autoleer':
      isAll = true
      if (!isOwner) {
        await conn.sendMessage(m.chat, { text: '> Solo owner', mentions: [m.sender] }, { quoted: m })
        return
      }
      bot.autoread = isEnable
      break
      
    case 'public':
    case 'publico':
      isAll = true
      if (!isROwner) {
        await conn.sendMessage(m.chat, { text: '> Solo creador', mentions: [m.sender] }, { quoted: m })
        return
      }
      bot.public = isEnable
      break
      
    case 'anticall':
    case 'antillamada':
      isAll = true
      if (!isOwner) {
        await conn.sendMessage(m.chat, { text: '> Solo owner', mentions: [m.sender] }, { quoted: m })
        return
      }
      bot.antiCall = isEnable
      break
      
    case 'antiprivado':
    case 'antiprivate':
      isAll = true
      if (!isOwner) {
        await conn.sendMessage(m.chat, { text: '> Solo owner', mentions: [m.sender] }, { quoted: m })
        return
      }
      bot.antiPrivate = isEnable
      break
      
    case 'modeadmin':
    case 'modoadmin':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          await conn.sendMessage(m.chat, { text: '> Solo admins', mentions: [m.sender] }, { quoted: m })
          return
        }
      }
      chat.modeAdmin = isEnable
      break
      
    case 'antitoxic':
    case 'antitoxico':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          await conn.sendMessage(m.chat, { text: '> Solo admins', mentions: [m.sender] }, { quoted: m })
          return
        }
      }
      chat.antiToxic = isEnable
      break
      
    case 'reaction':
    case 'reaccion':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          await conn.sendMessage(m.chat, { text: '> Solo admins', mentions: [m.sender] }, { quoted: m })
          return
        }
      }
      chat.reaction = isEnable
      break
      
    case 'audios':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          await conn.sendMessage(m.chat, { text: '> Solo admins', mentions: [m.sender] }, { quoted: m })
          return
        }
      }
      chat.audios = isEnable
      break
      
    case 'autodownload':
    case 'autodl':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          await conn.sendMessage(m.chat, { text: '> Solo admins', mentions: [m.sender] }, { quoted: m })
          return
        }
      }
      chat.autodownload = isEnable
      break
      
    default:
      if (!/[01]/.test(command)) {
        let text = `
*╭─〔 𝐎𝐏𝐂𝐈𝐎𝐍𝐄𝐒 𝐃𝐈𝐒𝐏𝐎𝐍𝐈𝐁𝐋𝐄𝐒 〕─╮*

  ╰➤ 👋 *welcome* ⸺ bienvenidas
  ╰➤ 🔔 *detect* ⸺ detección cambios
  ╰➤ 🚫 *antilink* ⸺ anti enlaces
  ╰➤ 🔞 *nsfw* ⸺ contenido +18
  ╰➤ 🎨 *autosticker* ⸺ stickers auto
  ╰➤ 🗑️ *antidelete* ⸺ anti eliminar
  ╰➤ 🌐 *public* ⸺ modo público
  ╰➤ 💬 *antiprivado* ⸺ anti privados
  ╰➤ 👑 *modeadmin* ⸺ modo admin
  ╰➤ ☠️ *antitoxic* ⸺ anti tóxicos
  ╰➤ 💫 *reaction* ⸺ reacciones
  ╰➤ 🎵 *audios* ⸺ audios bot
  ╰➤ 📥 *autodownload* ⸺ descargas auto

*╰───────────────────────────────╯*`
        
        await conn.sendMessage(m.chat, { 
          text: text.trim(),
          mentions: [m.sender],
          contextInfo: rcanal?.contextInfo || {}
        }, { quoted: m })
      }
      return
  }
  
  await conn.sendMessage(m.chat, { 
    react: { text: isEnable ? '✅' : '🚫', key: m.key }
  })
  
  let msg = `
*${isEnable ? '✅' : '🚫'}* ${type.toUpperCase()}
  
> ${isEnable ? '𝖠𝖼𝗍𝗂𝗏𝖺𝖽𝗈' : '𝖣𝖾𝗌𝖺𝖼𝗍𝗂𝗏𝖺𝖽𝗈'} ${isAll ? 'para el bot' : isUser ? '' : '𝖾𝗇 𝖾𝗌𝗍𝖾 𝖼𝗁𝖺𝗍'}`

  await conn.sendMessage(m.chat, { 
    text: msg.trim(),
    mentions: [m.sender],
    contextInfo: rcanal?.contextInfo || {}
  }, { quoted: m })
}

handler.help = ['on', 'off']
handler.tags = ['group', 'owner']
handler.command = /^(on|off)$/i

export default handler
