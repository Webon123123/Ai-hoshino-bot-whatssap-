let handler = async (m, { conn, participants }) => {
    
    let users = participants.map(u => u.id).filter(v => v !== conn.user.jid)
    
    if (!m.quoted) return m.reply(`🚩 Responde a un mensaje.`)
 let invisibleChar = '\u200B'
    let message = invisibleChar + m.quoted.text
    conn.sendMessage(m.chat, { text: message, mentions: users })
}

handler.help = ['tag']
handler.tags = ['group']
handler.command = /^(totag|tag)$/i

handler.admin = true
handler.group = true

export default handler
