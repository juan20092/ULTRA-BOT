import fetch from 'node-fetch'

const handler = async (m, { conn, rcanal }) => {
  if (!m.isGroup) return

  await conn.sendMessage(m.chat, {
    react: { text: '🔗', key: m.key }
  })

  try {
    const code = await conn.groupInviteCode(m.chat)
    const link = `https://chat.whatsapp.com/${code}`
    
    let groupImg
    try {
      groupImg = await conn.profilePictureUrl(m.chat, 'image')
    } catch {
      groupImg = 'https://i.imgur.com/jZRS95N.jpg' // Imagen por defecto si no tiene
    }

    const groupMetadata = await conn.groupMetadata(m.chat)
    const groupName = groupMetadata.subject

    const buffer = await (await fetch(groupImg)).buffer()

    await conn.sendMessage(m.chat, {
      image: buffer,
      caption: `> 🔗 𝗟𝗜𝗡𝗞 𝗗𝗘𝗟 𝗚𝗥𝗨𝗣𝗢

> ${groupName}
> ${link}

> 𝗖𝗼𝗺𝗽𝗮𝗿𝘁𝗲 𝗰𝗼𝗻 𝗰𝘂𝗶𝗱𝗮𝗱𝗼`,
      contextInfo: rcanal?.contextInfo || {}
    }, { quoted: m })

  } catch (error) {
    console.error('Error en group-link:', error)
    await conn.sendMessage(m.chat, {
      text: '> ❌ 𝗘𝗿𝗿𝗼𝗿 𝗮𝗹 𝗼𝗯𝘁𝗲𝗻𝗲𝗿 𝗲𝗹 𝗹𝗶𝗻𝗸\n> 𝗩𝗲𝗿𝗶𝗳𝗶𝗰𝗮 𝗾𝘂𝗲 𝘀𝗼𝘆 𝗮𝗱𝗺𝗶𝗻',
      contextInfo: rcanal?.contextInfo || {}
    }, { quoted: m })
  }
}

handler.help = ['link']
handler.tags = ['group']
handler.customPrefix = /^\.?link$/i
handler.command = new RegExp()
handler.group = true
handler.botAdmin = true

export default handler
