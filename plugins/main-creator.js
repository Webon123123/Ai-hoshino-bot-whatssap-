let handler = async (m, { conn, usedPrefix, isOwner }) => {
let vcard = `BEGIN:VCARD\nVERSION:3.0\nN:;Masha⁩;;\nFN:Masha\nORG:Masha⁩\nTITLE:\nitem1.TEL;waid=595976230899:5218261000681\nitem1.X-ABLabel:Masha⁩\nX-WA-BIZ-DESCRIPTION:\nX-WA-BIZ-NAME:Masha⁩\nEND:VCARD`
await conn.sendMessage(m.chat, { contacts: { displayName: 'Masha⁩', contacts: [{ vcard }] }}, {quoted: m})
}
handler.help = ['owner']
handler.tags = ['main']
handler.command = ['owner', 'creator', 'creador', 'dueño'] 

export default handler
