/**
 * ╔═══════════════════════════════════════╗
 * ║     👢 SISTEMA DE EXPULSIÓN V2.0     ║
 * ╚═══════════════════════════════════════╝
 */

let handler = async (m, { conn, participants, usedPrefix, command, rcanal }) => {
  try {
    // Mensaje de instrucción con diseño mejorado
    let kickte = `
> 👢 *EXPULSAR USUARIO*  

> 💡 *También puedes:*
> • Mencionar al usuario
> • Responder a su mensaje
`

    if (!m.mentionedJid[0] && !m.quoted) {
      return conn.reply(m.chat, kickte, m, rcanal)
    }
    
    // Identificar al usuario a expulsar
    let user = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted.sender
    
    // Ejecutar expulsión
    await conn.groupParticipantsUpdate(m.chat, [user], 'remove')
    
    // Mensaje de confirmación con diseño elegante
    let successMsg = `
> ✅ *USUARIO EXPULSADO*  

> 👤 *Usuario:* @${user.split('@')[0]}
> 🥾 *Acción:* Eliminado del grupo
> 👮 *Por:* @${m.sender.split('@')[0]}`

    // Enviar confirmación con mentions
    await conn.reply(m.chat, successMsg, m, {
      contextInfo: {
        ...rcanal.contextInfo,
        mentionedJid: [user, m.sender]
      }
    })
    
  } catch (err) {
    console.error('❌ Error en comando kick:', err)
    
    let errorMsg = `
> ❌ *ERROR AL EXPULSAR*  

> ⚠️ No se pudo expulsar al usuario`

    return conn.reply(m.chat, errorMsg, m, rcanal)
  }
}

handler.help = ['kick @usuario']
handler.tags = ["𝖦𝖱𝖴𝖯𝖮𝖲"];
handler.customPrefix = /^\.?kick(\s|$)/i;
handler.command = new RegExp();
handler.group = true;
handler.admin = true
export default handler;
