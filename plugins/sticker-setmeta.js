import { sticker } from '../lib/sticker.js'

let handler = async (m, { conn, args }) => {

  const input = args.join(' ') // Unir todos los argumentos en una sola cadena

  const [name, author] = input.split('|').map(part => part.trim()) // Separar por '|'

  if (!name || !author) {

    return conn.reply(m.chat, 'Por favor, proporciona un nombre y un autor              Ejemplo : *.setmeta Ai hoshino| MD*',m)


  }

  // Guardar el nombre y autor del pack de stickers en variables globales

  global.stickerName = name

  global.stickerAuthor = author

  conn.reply(m.chat, `Pack de stickers configurado:\nNombre: ${global.stickerName}\nAutor: ${global.stickerAuthor}`, m)

}

handler.command = /^setstickerpack|setmeta|setstickermeta$/i

export default handler