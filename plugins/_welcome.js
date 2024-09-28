import {WAMessageStubType} from '@whiskeysockets/baileys'
import fetch from 'node-fetch'

export async function before(m, {conn, participants, groupMetadata}) {
  if (!m.messageStubType || !m.isGroup) return !0;
  let pp = await conn.profilePictureUrl(m.messageStubParameters[0], 'image').catch(_ => 'https://tinyurl.com/ylgu47w3')
  let img = await (await fetch(`${pp}`)).buffer()
  let chat = global.db.data.chats[m.chat]

  if (chat.bienvenida && m.messageStubType == 27) {
    let bienvenida = `╔═══✦ ✯ *Ai Hoshino - MD* ✯ ✦═══╗

║ 🎉 ¡Bienvenido! 🎉             

╟─➤ 「 @${m.messageStubParameters[0].split`@`[0]}」    

║  

║ ✨ *Únete a la experiencia exclusiva* ✨

║ en    *Ｓｔａｒｌｉｇｈｔ ｔｅａｍ*

║ 

║ 🔗 *Canal oficial de HoshinoBot*: 

║ [https://whatsapp.com/channel/0029Vak9Hmd1iUxdfDUdCK1w]

║  

╚═► 💼 *TK-HOST*:

      🎯 *Adquiere tu propio Bot y usa Ai Hoshino - MD*. 

      💥 *Soporte premium* solo en *TK-HOST*.

🔗 *TK-HOST* (Ventas): 

https://chat.whatsapp.com/FmuetN8qqTx2vEVPmZLc6v`
    
await conn.sendAi(m.chat, botname, textbot, bienvenida, img, img, estilo)
  }
  
  if (chat.bienvenida && m.messageStubType == 28) {
    let bye = `┌─★ *${botname}* \n│「 ADIOS 👋 」\n└┬★ 「 @${m.messageStubParameters[0].split`@`[0]} 」\n   │✑  Se fue\n   │✑ Jamás te quisimos aquí\n   └───────────────┈ ⳹`
await conn.sendAi(m.chat, botname, textbot, bye, img, img, estilo)
  }
  
  if (chat.bienvenida && m.messageStubType == 32) {
    let kick = `┌─★ *${botname}* \n│「 ADIOS 👋 」\n└┬★ 「 @${m.messageStubParameters[0].split`@`[0]} 」\n   │✑  Se fue\n   │✑ Jamás te quisimos aquí\n   └───────────────┈ ⳹`
await conn.sendAi(m.chat, botname, textbot, kick, img, img, estilo)
}}