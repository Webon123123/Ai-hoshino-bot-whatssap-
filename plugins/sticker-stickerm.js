import { sticker } from '../lib/sticker.js'

let handler = async (m, { conn, args }) => {
  let img
  try {
    // Si hay un video o GIF en el mensaje citado
    if (m.quoted && m.quoted.mimetype && (/image|video|gif/.test(m.quoted.mimetype))) {
      // Comprobar si el tipo es video y la duración se pasa de 10 segundos
      if (/video/.test(m.quoted.mimetype)) {
        if (m.quoted.seconds && m.quoted.seconds > 10) {
          throw new Error('El video debe ser menor de 10 segundos.')
        }
      }

      img = await m.quoted.download()
    }
    // Si el primer argumento es una URL válida
    else if (/^https?:\/\//.test(args[0])) {
      const res = await fetch(args[0])
      if (res.status !== 200) throw new Error('No se pudo descargar la imagen, video o GIF desde la URL.')
      img = await res.buffer()
    } 
    // Si no hay ni imagen, GIF ni video
    else {
      throw new Error('Por favor, responde a una imagen, GIF o video válido de menos de 10 segundos.')
    }

    // Llamar a la función sticker para generar el sticker
    let stickerBuffer = await sticker(
      img, 
      args[0], 
      global.stickerName || '★彡[ᴬⁱ ᴴᵒˢʰⁱⁿᵒ - ᴹᴰ]彡★', 
      global.stickerAuthor || '𓆩 atom.bio/masha_ofc 𓆪'
    )

    // Si se genera el sticker correctamente
    if (stickerBuffer) {
      await conn.sendMessage(m.chat, { sticker: stickerBuffer }, { quoted: m })
    } else {
      throw new Error('No se pudo generar el sticker.')
    }

  } catch (e) {
    console.error(e)
    let errMessage = e.message ? e.message : 'Error al generar el sticker. Intenta nuevamente.'
    conn.reply(m.chat, errMessage, m)
  }
}

handler.command = /^sticker|s|hacersticker$/i
export default handler
