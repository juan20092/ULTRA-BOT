import { WAMessageStubType } from '@whiskeysockets/baileys'
import PhoneNumber from 'awesome-phonenumber'
import chalk from 'chalk'
import { appendFileSync, watchFile } from 'fs'
import { join } from 'path'

const terminalImage = global.opts['img'] ? require('terminal-image') : ''
const urlRegex = (await import('url-regex-safe')).default({ strict: false })

const LOG_PATH = join(process.cwd(), 'logs.txt') // Ruta del log

// 🟥 Palabras clave para alertas
const ALERT_WORDS = ['@admin', 'error', 'fallo', 'ayuda', 'problema']

// 🟧 Lista de chats o comandos que no quieres registrar (filtro)
const IGNORE_CHATS = [
  'status@broadcast',
  '55123456789-111111@g.us' // ejemplo: grupo silenciado
]
const IGNORE_COMMANDS = [
  /^\/ping$/i,
  /^\/estado$/i
]

export default async function (m, conn = { user: {} }) {
  if (IGNORE_CHATS.includes(m.chat)) return // filtro de chat
  if (typeof m.text === 'string' && IGNORE_COMMANDS.some(rx => rx.test(m.text))) return // filtro de comando

  let _name = await conn.getName(m.sender)
  let sender = PhoneNumber('+' + m.sender.replace('@s.whatsapp.net', '')).getNumber('international') + (_name ? ' ~' + _name : '')
  let chat = await conn.getName(m.chat)
  let img
  try {
    if (global.opts['img'])
      img = /sticker|image/gi.test(m.mtype) ? await terminalImage.buffer(await m.download()) : false
  } catch (e) {
    console.error(e)
  }

  let filesize = (m.msg ?
    m.msg.vcard ? m.msg.vcard.length :
    m.msg.fileLength ? (m.msg.fileLength.low || m.msg.fileLength) :
    m.msg.axolotlSenderKeyDistributionMessage ? m.msg.axolotlSenderKeyDistributionMessage.length :
    m.text ? m.text.length : 0
    : m.text ? m.text.length : 0) || 0

  let user = global.DATABASE.data.users[m.sender]
  let me = PhoneNumber('+' + (conn.user?.jid).replace('@s.whatsapp.net', '')).getNumber('international')
  let isP = global.conn.user.jid === conn.user.jid

  const header = `
${chalk.bold.red('╔═══════════════════════════════════════════════════════════════════════════╗')}
${chalk.bold.cyan('║')} ${chalk.bold.white('⚡ ULRA BOT')} ${chalk.bold.yellow('━')} ${chalk.bold.magenta('SISTEMA DE MONITOREO ULTRA INSTINTO')} ${chalk.bold.cyan('                 ║')}
${chalk.bold.red('╠═══════════════════════════════════════════════════════════════════════════╣')}
${chalk.bold.cyan('║')} ${chalk.bold.white('🤖 Bot:')} ${chalk.cyan(me + ' ' + (isP ? chalk.green('(Principal)') : chalk.yellow('(SubBot)')))}
${chalk.bold.cyan('║')} ${chalk.bold.white('🕐 Hora:')} ${chalk.black(chalk.bgCyan(' ' + new Date().toLocaleTimeString() + ' '))}
${chalk.bold.cyan('║')} ${chalk.bold.white('📊 Estado:')} ${chalk.black(chalk.bgGreen(' ' + (m.messageStubType ? WAMessageStubType[m.messageStubType] : 'ACTIVO') + ' '))}
${chalk.bold.cyan('║')} ${chalk.bold.white('💾 Tamaño:')} ${chalk.magenta(`${filesize === 0 ? '0B' : (filesize / 1009 ** Math.floor(Math.log(filesize) / Math.log(1000))).toFixed(1)}${['', ...'KMGTP'][Math.floor(Math.log(filesize) / Math.log(1000))] || ''}B`)}
${chalk.bold.red('╠═══════════════════════════════════════════════════════════════════════════╣')}
${chalk.bold.cyan('║')} ${chalk.bold.yellow('👤 Usuario:')} ${chalk.redBright(sender)}
${chalk.bold.cyan('║')} ${chalk.bold.yellow('📈 Stats:')} ${chalk.green('EXP:')} ${chalk.white(m.exp || '0')} ${chalk.blue('│')} ${chalk.green('Total:')} ${chalk.white(user?.exp || '0')} ${chalk.blue('│')} ${chalk.green('💎:')} ${chalk.white(user?.diamond || '0')} ${chalk.blue('│')} ${chalk.green('Lvl:')} ${chalk.white(user?.level || '1')}
${chalk.bold.cyan('║')} ${chalk.bold.yellow('💬 Chat:')} ${chalk.green(m.chat + (chat ? ' ➜ ' + chat : ''))}
${chalk.bold.cyan('║')} ${chalk.bold.yellow('📝 Tipo:')} ${chalk.black(chalk.bgYellow(' ' + (m.mtype ? m.mtype.replace(/message$/i, '').replace(/^./, v => v.toUpperCase()) : 'Texto') + ' '))}
${chalk.bold.red('╚═══════════════════════════════════════════════════════════════════════════╝')}
`

  console.log(header)
  if (img) console.log(img.trimEnd())

  let log = ''
  if (typeof m.text === 'string' && m.text) {
    log = m.text.replace(/\u200e+/g, '')
    let mdRegex = /(?<=(?:^|[\s\n])\S?)(?:([*_~])(.+?)\1|```((?:.||[\n\r])+?)```)(?=\S?(?:[\s\n]|$))/g
    let mdFormat = (depth = 4) => (_, type, text, monospace) => {
      let types = { _: 'italic', '*': 'bold', '~': 'strikethrough' }
      text = text || monospace
      return !types[type] || depth < 1 ? text : chalk[types[type]](text.replace(mdRegex, mdFormat(depth - 1)))
    }
    if (log.length < 1024)
      log = log.replace(urlRegex, url => chalk.blueBright(url))

    log = log.replace(mdRegex, mdFormat(4))
    if (m.mentionedJid) {
      const names = await Promise.all(m.mentionedJid.map(jid => conn.getName(jid)))
      for (let i = 0; i < m.mentionedJid.length; i++) {
        log = log.replace('@' + m.mentionedJid[i].split`@`[0], chalk.blueBright('@' + names[i]))
      }
    }

    const isAlert = ALERT_WORDS.some(word => log.toLowerCase().includes(word.toLowerCase()))
    if (isAlert) {
      console.log(chalk.bold.red('╔═══════════════════════════════════════════════════════════════════════════╗'))
      console.log(chalk.bold.red('║') + chalk.bgRed.white.bold(' ⚠️  ALERTA DETECTADA ⚠️  ') + chalk.bold.red('                                              ║'))
      console.log(chalk.bold.red('╚═══════════════════════════════════════════════════════════════════════════╝'))
      console.log(chalk.bold.yellow('➜ ') + chalk.redBright(log))
    } else {
      console.log(chalk.bold.cyan('┃ ') + (m.error != null ? chalk.bold.red('❌ ERROR: ') + chalk.red(log) : m.isCommand ? chalk.bold.green('⚡ COMANDO: ') + chalk.yellow(log) : chalk.bold.blue('💬 MENSAJE: ') + chalk.white(log)))
    }

    // Guardar en archivo
    const logRaw = `[${new Date().toLocaleString()}] ${sender} > ${log}\n`
    appendFileSync(LOG_PATH, logRaw)
  }

  if (m.messageStubParameters) {
    console.log(chalk.bold.cyan('┃ ') + chalk.bold.magenta('👥 Participantes: ') + m.messageStubParameters.map(jid => {
      jid = conn.decodeJid(jid)
      let name = conn.getName(jid)
      return chalk.yellow(PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international') + (name ? ' ~' + name : ''))
    }).join(chalk.gray(', ')))
  }

  if (/document/i.test(m.mtype)) console.log(chalk.bold.cyan('┃ ') + chalk.bold.blue('📄 Documento: ') + chalk.white(m.msg.fileName || m.msg.displayName || 'Sin nombre'))
  else if (/ContactsArray/i.test(m.mtype)) console.log(chalk.bold.cyan('┃ ') + chalk.bold.green('👨‍👩‍👧‍👦 Contactos múltiples'))
  else if (/contact/i.test(m.mtype)) console.log(chalk.bold.cyan('┃ ') + chalk.bold.green('👤 Contacto: ') + chalk.white(m.msg.displayName || 'Sin nombre'))
  else if (/audio/i.test(m.mtype)) {
    const duration = m.msg.seconds
    console.log(chalk.bold.cyan('┃ ') + chalk.bold.magenta(`${m.msg.ptt ? '🎤 Audio de voz' : '🎵 Audio'}: `) + chalk.yellow(`${Math.floor(duration / 60).toString().padStart(2, 0)}:${(duration % 60).toString().padStart(2, 0)}`))
  }

  console.log(chalk.bold.red('╚═══════════════════════════════════════════════════════════════════════════╝\n'))
}

let file = global.__filename(import.meta.url)
watchFile(file, () => console.log(chalk.bold.cyan('╔═══════════════════════════════════════════════════════════════════════════╗\n') + chalk.bold.green('║ ') + chalk.bgGreen.black(' ✅ ACTUALIZADO ') + chalk.green(' lib/print.js recargado con éxito') + chalk.bold.cyan('                ║\n') + chalk.bold.cyan('╚═══════════════════════════════════════════════════════════════════════════╝\n')))
