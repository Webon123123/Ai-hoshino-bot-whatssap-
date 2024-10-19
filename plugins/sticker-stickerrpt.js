import { sticker } from '../lib/sticker.js'

let handler = async (m, { conn, args }) => {
  let img
  const author = '𓆩 atom.bio/masha_ofc 𓆪' 

  try {
    
    if (m.quoted && m.quoted.mimetype && (/image|video|gif/.test(m.quoted.mimetype))) {
      if (/video/.test(m.quoted.mimetype) && m.quoted.seconds && m.quoted.seconds > 10) {
        throw new Error('El video debe ser menor de 10 segundos.')
      }
      img = await m.quoted.download()
    } 
    
    else if (m.quoted && m.quoted.isViewOnce && m.quoted.mtype === 'imageMessage') {
      img = await m.quoted.download()
    }
    else if (/^https?:\/\//.test(args[0])) {
      const res = await fetch(args[0])
      if (res.status !== 200) throw new Error('No se pudo descargar la imagen, video o GIF desde la URL.')
      img = await res.buffer()
    } 
    else {
      throw new Error('Por favor, responde a una imagen, GIF o video válido de menos de 10 segundos.')
    }

    
    let stickerBuffer = await sticker(
      img, 
      '', 
      '★彡[Sticker]彡★',  
      author
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

handler.command = /^sticker2|s2$/i

export default handler
