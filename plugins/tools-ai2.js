import Starlights from '@StarlightsTeam/Scraper'
import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return conn.reply(m.chat, `\u200B*🚩 Ingrese su petición*\n*🪼 Ejemplo de uso:* ${usedPrefix + command} como follar con peruanos`, m)
  await m.react('🥵')
  
  try {
    let { msg } = await Starlights.openAi(text)
    await conn.reply(m.chat, `\u200B${msg}`, m)
  } catch {
    try {
      let { result } = await Starlights.ChatGpt(text)
      await conn.reply(m.chat, `\u200B${result}`, m)
    } catch {
      try {
        let { result } = await Starlights.ChatGptV2(text)
        await conn.reply(m.chat, `\u200B${result}`, m)
      } catch {
        try {
          let api = await fetch(`https://apis-starlights-team.koyeb.app/starlight/chatgpt?text=${text}`)
          let json = await api.json()

          if (json.result) {
            await conn.reply(m.chat, `\u200B${json.result}`, m)
          } else {
            await m.react('✖️')
          }
        } catch {
          await m.react('✖️')
        }
      }
    }
  }
}

handler.help = ['ai *<petición>*']
handler.tags = ['tools']
handler.command = /^(miku|ai|ia|chatgpt|gpt|inteligencia-artificial)$/i
handler.register = true

export default handler
