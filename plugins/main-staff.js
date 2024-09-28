let handler = async (m, { conn, usedPrefix, isOwner }) => {
let vcard = `BEGIN:VCARD\nVERSION:3.0\nN:;Daniel;;\nFN:Daniel\nORG: Daniel\nTITLE:\nitem1.TEL;waid=5493834226050:5218261000681\nitem1.X-ABLabel:Daniel\nX-WA-BIZ-DESCRIPTION:\nX-WA-BIZ-NAME:Daniel⁩\nEND:VCARD`
await conn.sendMessage(m.chat, { contacts: { displayName: 'Daniel staff', contacts: [{ vcard }] }}, {quoted: m})
}
handler.help = ['owner']
handler.tags = ['main']
handler.command = ['staff', 'mod', 'admin'] 

export default handler