let handler = async (m, { conn, isAdmin, isROwner }) => {
    if (!(isAdmin || isROwner)) return dfail('admin', m, conn)
    global.db.data.chats[m.chat].isBanned = true
    await conn.reply(m.chat, `╭━━━✦❘༻༺❘✦━━━╮\n   🚩 *𝐁𝐨𝐭 𝐀𝐩𝐚𝐠𝐚𝐝𝐨* 🚩\n╰━━━✦❘༻༺❘✦━━━╯\n\nEl bot ha sido *desactivado* en este grupo con éxito.`, m, rcanal)
    await m.react('✅')
}

handler.help = ['banearbot']
handler.tags = ['group']
handler.command = ['banearbot', 'botoff', 'offbot' , 'bot-off']
handler.group = true 
export default handler
