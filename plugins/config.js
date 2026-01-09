import fetch from 'node-fetch'

export async function before(m, { conn, isAdmin, isBotAdmin }) {
  if (!m.isGroup) return
  
  const text = m.text?.trim().toLowerCase()
  
  // Procesar comandos con o sin punto
  const isAbrir = text === '.abrir' || text === 'abrir'
  const isCerrar = text === '. cerrar' || text === 'cerrar'
  
  if (!isAbrir && !isCerrar) return
  
  // Validaciones de permisos
  if (!isAdmin) return m.reply('❌ Solo admins pueden usar este comando')
  if (!isBotAdmin) return m.reply('❌ El bot no es admin')

  const usuario = `@${m.sender.split('@')[0]}`
  
  // 🖼️ Imágenes diferentes para cada acción
  const imgAbrir = 'https://files.catbox.moe/o4ly6o.jpg' // Imagen para grupo abierto (🔓)
  const imgCerrar = 'https://files.catbox.moe/ri6obb.jpg' // Imagen para grupo cerrado (🔒)

  try {
    // 🔓 ABRIR GRUPO
    if (isAbrir) {
      // Reacción de candado abierto
      await conn.sendMessage(m.chat, {
        react: {
          text:  '🔓',
          key: m.key
        }
      })

      const thumbAbrir = await (await fetch(imgAbrir)).buffer()

      const fkontakAbrir = {
        key: { 
          participants: '0@s.whatsapp.net', 
          remoteJid: 'status@broadcast', 
          fromMe:  false, 
          id: 'ULTRA BOT' 
        },
        message: {
          locationMessage: {
            name: '🔓 GRUPO ABIERTO',
            jpegThumbnail: thumbAbrir,
            thumbnailUrl:  imgAbrir,  
            vcard: `BEGIN:VCARD\nVERSION: 3.0\nN: Meliodas;;;;\nFN:Meliodas\nORG:  Boar Hat\nTITLE:Demon King\nitem1.TEL;waid=0000000000:+0 000-000-0000\nitem1.X-ABLabel:Oficial\nX-WA-BIZ-DESCRIPTION:  Todos pueden escribir ahora\nX-WA-BIZ-NAME:Meliodas\nEND: VCARD`
          }
        },
        participant: '0@s.whatsapp.net'
      }

      await conn.groupSettingUpdate(m. chat, 'not_announcement')

      await conn.sendMessage(m.chat, {
        text: `> ➤ 𝖮𝖱𝖣𝖤𝖭 𝖤𝖩𝖤𝖢𝖴𝖳𝖠𝖣𝖠 ✅

𝖤𝗅 𝗀𝗋𝗎𝗉𝗈 𝗁𝖺 𝗌𝗂𝖽𝗈 𝖺𝖻𝗂𝖾𝗋𝗍𝗈, 𝖺𝗁𝗈𝗋𝖺 𝗍𝗈𝖽𝗈𝗌 𝗉𝗎𝖾𝖽𝖾𝗇 𝗆𝖺𝗇𝖽𝖺𝗋 𝗆𝖾𝗇𝗌𝖺𝗃𝖾𝗌 🔓

𝖠𝖼𝖼𝗂𝗈́𝗇 𝗋𝖾𝖺𝗅𝗂𝗓𝖺𝖽𝖺 𝗉𝗈𝗋: 
${usuario}`,
        mentions: [m.sender]
      }, { quoted: fkontakAbrir })
    }

    // 🔒 CERRAR GRUPO
    if (isCerrar) {
      // Reacción de candado cerrado
      await conn.sendMessage(m.chat, {
        react: {
          text: '🔒',
          key: m.key
        }
      })

      const thumbCerrar = await (await fetch(imgCerrar)).buffer()

      const fkontakCerrar = {
        key:  { 
          participants: '0@s.whatsapp.net', 
          remoteJid: 'status@broadcast', 
          fromMe: false, 
          id: 'ULTRA BOT' 
        },
        message: {
          locationMessage: {
            name: '🔒 GRUPO CERRADO',
            jpegThumbnail: thumbCerrar,
            thumbnailUrl: imgCerrar,  
            vcard:  `BEGIN:VCARD\nVERSION:3.0\nN:Meliodas;;;;\nFN: Meliodas\nORG: Boar Hat\nTITLE:Demon King\nitem1.TEL;waid=0000000000:+0 000-000-0000\nitem1.X-ABLabel:Oficial\nX-WA-BIZ-DESCRIPTION: Solo admins pueden escribir\nX-WA-BIZ-NAME:Meliodas\nEND:VCARD`
          }
        },
        participant: '0@s. whatsapp.net'
      }

      await conn.groupSettingUpdate(m.chat, 'announcement')

      await conn.sendMessage(m.chat, {
        text: `> ➤ 𝖮𝖱𝖣𝖤𝖭 𝖤𝖩𝖤𝖢𝖴𝖳𝖠𝖣𝖠 ✅

𝖤𝗅 𝗀𝗋𝗎𝗉𝗈 𝗁𝖺 𝗌𝗂𝖽𝗈 𝖼𝖾𝗋𝗋𝖺𝖽𝗈, 𝖺𝗁𝗈𝗋𝖺 𝗌𝗈𝗅𝗈 𝗅𝗈𝗌 𝖺𝖽𝗆𝗂𝗇𝗌 𝗉𝗎𝖾𝖽𝖾𝗇 𝗆𝖾𝗇𝗌𝖺𝗃𝖾𝗌 🔒

𝖠𝖼𝖼𝗂𝗈́𝗇 𝗋𝖾𝖺𝗅𝗂𝗓𝖺𝖽𝖺 𝗉𝗈𝗋:
${usuario}`,
        mentions: [m.sender]
      }, { quoted: fkontakCerrar })
    }
  } catch (error) {
    console.error('Error en config.js:', error)
    await m.reply('❌ Error al cambiar configuración del grupo')
  }
}
