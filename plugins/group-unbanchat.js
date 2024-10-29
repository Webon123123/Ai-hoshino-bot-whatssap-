let handler = async (m, { conn, isAdmin, isROwner }) => {
    if (!(isAdmin || isROwner)) return dfail('admin', m, conn)
    global.db.data.chats[m.chat].isBanned = false
    await conn.reply(m.chat, `╭━━━✦❘༻༺❘✦━━━╮\n   🚩 *𝐁𝐨𝐭 𝐀𝐜𝐭𝐢𝐯𝐨* 🚩\n╰━━━✦❘༻༺❘✦━━━╯\n\nEl bot ha sido *activado* en este grupo con éxito.`, m, rcanal)
    await m.react('✅')
}

handler.help = ['desbanearbot']
handler.tags = ['group']
handler.command = ['desbanearbot', 'unbanchat', 'boton', 'bot-on', 'onbot']
handler.group = true 
export default handler
