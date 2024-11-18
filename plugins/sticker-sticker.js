import { downloadContentFromMessage } from '@whiskeysockets/baileys';
import { sticker } from '../lib/sticker.js';

let stickerMeta = {};

let handler = async (m, { conn, args, command }) => {
  if (['setmeta', 'setstickerpack', 'setstickermeta'].includes(command)) {
    const input = args.join(' ');
    const [name, author] = input.split('|').map(part => part.trim());

    if (!name || !author) {
      return conn.reply(
        m.chat,
        '⛧✦ ᴱʳʳᵒʳ✦⛧\n☾ *𝐅𝐨𝐫𝐦𝐚𝐭𝐨 𝐢𝐧𝐜𝐨𝐫𝐫𝐞𝐜𝐭𝐨* ☽\n\n☾ ᵁˢᵃ, ᵉʲᵉᵐᵖˡᵒ: `.setmeta ᴺᵃᵐᵉ | ᴬᵘᵗʰᵒʳ` ☽',
        m
      );
    }

    stickerMeta[m.sender] = {
      name: name,
      author: author
    };

    return conn.reply(
      m.chat,
      `✧ ᴾᵃᶜᵏ ᵈᵉ ˢᵗⁱᶜᵏᵉʳˢ ᶜᵒⁿᶠⁱᵍᵘʳᵃᵈᵒ ✧\n☾ *Nombre:* ${name} ☽\n☾ *Autor:* ${author} ☽`,
      m
    );
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
        let media = await downloadContentFromMessage(
          msg[type],
          type === 'imageMessage' ? 'image' : 'video'
        );

        let buffer = Buffer.from([]);
        for await (const chunk of media) {
          buffer = Buffer.concat([buffer, chunk]);
        }

        if (/video/.test(type) && msg[type].seconds > 21) {
          throw new Error('☾ *ᴱˡ ᵛⁱᵈᵉᵒ ᵈᵉᵇᵉ ˢᵉʳ ᵐᵉⁿᵒʳ ᵃ ²⁰ ˢᵉᵍᵘⁿᵈᵒˢ* ☽');
        }

        img = buffer;
      } else if (m.quoted && m.quoted.mimetype && /image|video|sticker/.test(m.quoted.mimetype)) {
        if (m.quoted.mimetype.includes('video') && m.quoted.seconds > 21) {
          throw new Error('☾ *ᴱˡ ᵛⁱᵈᵉᵒ ᵈᵉᵇᵉ ˢᵉʳ ᵐᵉⁿᵒʳ ᵃ ²⁰ ˢᵉᵍᵘⁿᵈᵒˢ* ☽');
        }
        img = await m.quoted.download();
      } else if (m.mimetype && /image|video|sticker/.test(m.mimetype)) {
        if (m.mimetype.includes('video') && m.seconds > 21) {
          throw new Error('☾ *ᴱˡ ᵛⁱᵈᵉᵒ ᵈᵉᵇᵉ ˢᵉʳ ᵐᵉⁿᵒʳ ᵃ ²⁰ ˢᵉᵍᵘⁿᵈᵒˢ* ☽');
        }
        img = await m.download();
      } else if (/^https?:\/\//.test(args[0])) {
        const res = await fetch(args[0]);
        if (res.status !== 200) throw new Error('☾ *ᴺᵒ ˢᵉ ᵖᵘᵈᵒ ᵈᵉˢᶜᵃʳᵍᵃʳ ᵈᵉˡ ˡⁱⁿᵏ ᵖʳᵒᵛⁱˢᵗᵒ* ☽');
        img = await res.buffer();
      }

      if (!img) {
        throw new Error('☾ *ᵖʳᵒᵛⁱᵈᵉ ᵘⁿ ᶜᵒⁿᵗᵉⁿⁱᵈᵒ ᵛᵃˡⁱᵈᵒ ᵖᵃʳᵃ ᵍᵉⁿᵉʳᵃʳ ᵉˡ ˢᵗⁱᶜᵏᵉʳ*☽');
      }

      let stickerBuffer = await sticker(img, '', meta.name, meta.author);

      if (stickerBuffer) {
        await conn.sendMessage(m.chat, { sticker: stickerBuffer }, { quoted: m });
      } else {
        throw new Error('☾ *ᴱʳʳᵒʳ ᵃˡ ᵍᵉⁿᵉʳᵃʳ ᵉˡ ˢᵗⁱᶜᵏᵉʳ*☽');
      }
    } catch (e) {
      conn.reply(m.chat, `✧✦ *ᴱʳʳᵒʳ:* ${e.message || '☾ ᴵⁿᵗᵉⁿᵗᵃ ⁿᵘᵉᵛᵃᵐᵉⁿᵗᵉ ☽'}`, m);
    }
  }
};

handler.command = /^(setstickerpack|setmeta|setstickermeta|sticker|s)$/i;

export default handler;
