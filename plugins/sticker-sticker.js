import { sticker } from '../lib/sticker.js'
let stickerMeta = {}

let handler = async (m, { conn, args, command }) => {
  if (command === 'setmeta', 'st', 'setpack') {
  
    const input = args.join(' ') 
    const [name, author] = input.split('|').map(part => part.trim()) 

    if (!name || !author) {
      return conn.reply(m.chat, '⚠️ *Formato incorrecto.*\n\nDebes proporcionar un nombre y un autor para el pack de stickers.\n\n*Ejemplo:* `.setmeta Ai Hoshino | MD`', m)
    }


    stickerMeta[m.sender] = {
      name: name,
      author: author
    }

    return conn.reply(m.chat, `✅ *Pack de stickers configurado correctamente.*\n\n*Nombre:* ${name}\n*Autor:* ${author}`, m)

  } else if (command === 's', 'sticker') {
    let img
    let meta = stickerMeta[m.sender] || {
      name: '★彡[ᴬⁱ ᴴᵒˢʰⁱⁿᵒ - ᴹᴰ]彡★', 
      author: '𓆩 atom.bio/masha_ofc 𓆪'
    }

    try {
      
      if (m.quoted && m.quoted.mimetype && (/image|video|gif/.test(m.quoted.mimetype))) {
        if (/video/.test(m.quoted.mimetype) && m.quoted.seconds && m.quoted.seconds > 10) {
          throw new Error('El video debe ser menor de 10 segundos.')
        }
        img = await m.quoted.download()
      }
    
      else if (m.quoted && m.quoted.isViewOnce && m.quoted.mtype === 'imageMessage') {
        img = await m.quoted.download()
  
      else if (/^https?:\/\//.test(args[0])) {
        const res = await fetch(args[0])
        if (res.status !== 200) throw new Error('No se pudo descargar la imagen, video o GIF desde la URL.')
        img = await res.buffer()
      } else {
        throw new Error('Por favor, responde a una imagen, GIF o video válido de menos de 10 segundos.')
      }

      let stickerBuffer = await sticker(
        img, 
        '', 
        meta.name, 
        meta.author
      )

      if (stickerBuffer) {
        await conn.sendMessage(m.chat, { sticker: stickerBuffer }, { quoted: m })
      } else {
        throw new Error('No se pudo generar el sticker.')
      }
    } catch (e) {
      console.error(e)
      let errMessage = e.message ? e.message : 'Error al generar el sticker. Intenta nuevamente.'
      conn.reply(m.chat, `⚠️ ${errMessage}`, m)
    }
  }
}

handler.command = /^(setstickerpack|setmeta|setstickermeta|sticker|s)$/i

export default handler
