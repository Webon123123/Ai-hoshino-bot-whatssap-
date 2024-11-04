import { downloadContentFromMessage } from '@whiskeysockets/baileys';
import { sticker } from '../lib/sticker.js';

let stickerMeta = {};
const cost = 5;

let = async (m, { conn, args, command }) => {
  if (['setmeta', 'st', 'setpack'].includes(command)) {
    const input = args.join(' ');
    const [name, author] = input.split('|').map(part => part.trim());

    if (!name || !author) {
      return conn.reply(m.chat, 'Formato incorrecto.\n\nDebes proporcionar un nombre y un autor para el pack de stickers.\n\nEjemplo: `.setmeta Ai Hoshino | MD`', m);
    }

    stickerMeta[m.sender] = {
      name: name,
      author: author
    };

    return conn.reply(m.chat, `Pack de stickers configurado correctamente.\n\nNombre: ${name}\nAutor: ${author}`, m);

  } else if (['s', 'sticker'].includes(command)) {
    let img;
    let meta = stickerMeta[m.sender] || {
      name: '★彡[ᴬⁱ ᴴᵒˢʰⁱⁿᵒ - ᴹᴰ]彡★',
      author: '𓆩 atom.bio/masha_ofc 𓆪'
    };

    try {
      if (m.quoted && m.quoted.mtype === 'viewOnceMessageV2') {
        const msg = m.quoted.message;
        const type = Object.keys(msg)[0];
        let media = await downloadContentFromMessage(msg[type], type === 'imageMessage' ? 'image' : 'video');

        let buffer = Buffer.from([]);
        for await (const chunk of media) {
          buffer = Buffer.concat([buffer, chunk]);
        }

        if (/video/.test(type) && msg[type].seconds > 21) {
          throw new Error('El video debe ser menor de 20 segundos.');
        }
        
        img = buffer;

      } else if (m.quoted && m.quoted.mimetype && (/image|video|gif/.test(m.quoted.mimetype))) {
        if (/video/.test(m.quoted.mimetype) && m.quoted.seconds && m.quoted.seconds > 21) {
          throw new Error('El video debe ser menor de 20 segundos.');
        }
        img = await m.quoted.download();

      } else if (/^https?:\/\//.test(args[0])) {
        const res = await fetch(args[0]);
        if (res.status !== 200) throw new Error('No se pudo descargar la imagen, video o GIF desde la URL.');
        img = await res.buffer();
      } else {
        throw new Error('Por favor, responde a una imagen, GIF o video válido de menos de 20 segundos.');
      }

      let user = global.db.data.users[m.sender];
      if (user.stars < cost) {
        return conn.reply(m.chat, `No tienes suficientes estrellas. Necesitas ${cost} estrellas para crear un sticker.`, m);
      }
      user.stars -= cost;

      let stickerBuffer = await sticker(img, '', meta.name, meta.author);

      if (stickerBuffer) {
        await conn.sendMessage(m.chat, { sticker: stickerBuffer }, { quoted: m });
      } else {
        throw new Error('No se pudo generar el sticker.');
      }

    } catch (e) {
      console.error(e);
      let errMessage = e.message ? e.message : 'Error al generar el sticker. Intenta nuevamente.';
      conn.reply(m.chat, `${errMessage}`, m);
    }
  }
}

handler.command = /^(setstickerpack|setmeta|setstickermeta|sticker|s)$/i;

export default handler;
