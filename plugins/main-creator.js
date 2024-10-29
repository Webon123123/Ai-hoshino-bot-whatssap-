let handler = async (m, { conn, usedPrefix, isOwner }) => {
let vcard = `BEGIN:VCARD\nVERSION:3.0\nN:;Ai hoshino⁩;;\nFN:Ai hoshino\nORG:Ai hoshino\nTITLE:\nitem1.TEL;waid=595976230899:5218261000681\nitem1.X-ABLabel:Ai hoshino\nX-WA-BIZ-DESCRIPTION:\nX-WA-BIZ-NAME:Ai hoshino⁩\nEND:VCARD`
await conn.sendMessage(m.chat, { contacts: { displayName: 'Ai hoshino developer', contacts: [{ vcard }] }}, {quoted: m})
}
handler.help = ['owner']
handler.tags = ['main']
handler.command = ['owner', 'creator', 'creador', 'dueño', 'masha', 'Masha', 'Masha_OFC'] 

export default handler
