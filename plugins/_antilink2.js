let linkRegex = /\b((https?:\/\/|www\.)?[\w-]+\.[\w-]+(?:\.[\w-]+)*(\/[\w\.\-\/]*)?)\b/i;

export async function before(m, { isAdmin, isBotAdmin, text }) {
  if (m.isBaileys && m.fromMe) return true; 
  if (!m.isGroup) return false; 

  const chat = global.db.data.chats[m.chat];
  const delet = m.key.participant;
  const bang = m.key.id;
  const bot = global.db.data.settings[this.user.jid] || {};
  const user = `@${m.sender.split`@`[0]}`;
  const isGroupLink = linkRegex.exec(m.text);

  if (chat.antiLink2 && isGroupLink && !isAdmin) {
    if (isBotAdmin) {
      const linkThisGroup = `https://chat.whatsapp.com/${await this.groupInviteCode(m.chat)}`;
      if (m.text.includes(linkThisGroup)) return true; 
    }

    await this.sendMessage(
      m.chat,
      {
        text: `*「 𝐀𝐍𝐓𝐈𝐋𝐈𝐍𝐊𝐒 」*\n${user}, has compartido un enlace prohibido y has roto las reglas del grupo. Serás eliminado/a... 🙄`,
        mentions: [m.sender],
      },
      { quoted: m }
    );

    if (!isBotAdmin) {
      return m.reply('[🚫] No soy administrador, por lo tanto, no puedo expulsar a nadie.');
    }

    await conn.sendMessage(m.chat, {
      delete: { remoteJid: m.chat, fromMe: false, id: bang, participant: delet },
    });
    const responseb = await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove');
    if (responseb[0]?.status === '404') {
      return m.reply('[❗] No se pudo expulsar al usuario. Verifica los permisos del bot.');
    }
  }
  return true;
}