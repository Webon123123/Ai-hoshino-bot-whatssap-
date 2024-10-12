let handler = async (m, { conn, usedPrefix, command, text }) => {
  try {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || '';

    if (!mime || !/webp/.test(mime)) throw 'Envía o responde a un sticker para convertirlo en imagen.';
    let sticker = await q.download();
    if (!sticker) throw 'No se pudo descargar el sticker.';
    const imageBuffer = Buffer.from(sticker, 'base64');
    await conn.sendMessage(m.chat, { image: imageBuffer }, { quoted: m });
  } catch (e) {
    console.error(e);
    m.reply(`Ocurrió un error: ${e}`);
  }
};

handler.help = ['toimg'].map(v => v + ' (responde a un sticker)');
handler.tags = ['tools'];
handler.command = ['toimg']

export default handler;
