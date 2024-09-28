let handler = async (m, { conn, usedPrefix, isOwner }) => {
let vcard = `BEGIN:VCARD\nVERSION:3.0\nN:;Daniel;;\nFN:W.a⛧.me/z.ツꪶꫀᦋ˚᭢ꪖ.ꪮᠻᨶ🕀.⃟🦋\nORG: W.a⛧.me/z.ツꪶꫀᦋ˚᭢ꪖ.ꪮᠻᨶ🕀.⃟🦋\nTITLE:\nitem1.TEL;waid=526671548329:5218261000681\nitem1.X-ABLabel:W.a⛧.me/z.ツꪶꫀᦋ˚᭢ꪖ.ꪮᠻᨶ🕀.⃟🦋\nX-WA-BIZ-DESCRIPTION:\nX-WA-BIZ-NAME:W.a⛧.me/z.ツꪶꫀᦋ˚᭢ꪖ.ꪮᠻᨶ🕀.⃟🦋\nEND:VCARD`
await conn.sendMessage(m.chat, { contacts: { displayName: 'W.a⛧.me/z.ツꪶꫀᦋ˚᭢ꪖ.ꪮᠻᨶ🕀.⃟🦋', contacts: [{ vcard }] }}, {quoted: m})
}
handler.help = ['owner']
handler.tags = ['main']
handler.command = ['staff2', 'mod2', 'admin2','staff-2','mod-2'] 

export default handler