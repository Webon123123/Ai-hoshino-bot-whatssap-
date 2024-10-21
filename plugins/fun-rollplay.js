let handler = async (m, { conn, text, command }) => {
let gifs = {
hug: [
'https://media.giphy.com/media/wnsgren9NtITS/giphy.mp4',
'https://media.giphy.com/media/lrr9rHuoJOE0w/giphy.mp4',
'https://media.giphy.com/media/VGACXbkf0AeGs/giphy.mp4'
],
kiss: [
'https://media.giphy.com/media/bm2O3nXTcKJeU/giphy.mp4',
'https://media.giphy.com/media/G3va31oEEnIkM/giphy.mp4',
'https://media.giphy.com/media/FqBTvSNjNzeZG/giphy.mp4'
],
pat: [
'https://media.giphy.com/media/109ltuoSQT212w/giphy.mp4',
'https://media.giphy.com/media/q0ehAFdA3jFzi/giphy.mp4',
'https://media.giphy.com/media/12hvLuZ7uzvCvK/giphy.mp4'
],
slap: [
'https://media.giphy.com/media/Zau0yrl17uzdK/giphy.mp4',
'https://media.giphy.com/media/RXGNsyRb1hDJm/giphy.mp4',
'https://media.giphy.com/media/jLeyZWgtwgr2U/giphy.mp4'
],
cuddle: [
'https://media.giphy.com/media/svXXBgduBsJ1u/giphy.mp4',
'https://media.giphy.com/media/IrKniylAjDcl0/giphy.mp4'
],
expandDomain: [
'https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.mp4',
'https://media.giphy.com/media/3oEjHLzm4BCF8kfNeE/giphy.mp4'
]
}

if (!gifs[command]) return
const gifUrl = gifs[command][Math.floor(Math.random() * gifs[command].length)]
let userMention = null
if (m.mentionedJid && m.mentionedJid[0]) {
userMention = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted.sender
} else if (m.quoted && m.quoted.sender) {
userMention = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted.sender
}

const actionText = {
hug: userMention ? `${conn.getName(m.sender)} ha abrazado a ${userMention}` : `*${conn.getName(m.sender)} se ha abrazado solo*`,
kiss: userMention ? `${conn.getName(m.sender)} besó a ${userMention}` : `*${conn.getName(m.sender)} se ha dado un beso a sí mismo*`,
pat: userMention ? `${conn.getName(m.sender)} le dio una palmadita a ${userMention}` : `*${conn.getName(m.sender)} se dio una palmadita a sí mismo*`,
slap: userMention ? `${conn.getName(m.sender)} le dio una bofetada a ${userMention}` : `*${conn.getName(m.sender)} se dio una bofetada solo*`,
cuddle: userMention ? `${conn.getName(m.sender)} se acurrucó con ${userMention}` : `*${conn.getName(m.sender)} se acurrucó solo*`,
expandDomain: userMention ? `${conn.getName(m.sender)} ha expandido su dominio con ${userMention}` : `${conn.getName(m.sender)} ha expandido su dominio`
}

conn.sendMessage(m.chat, { video: { url: gifUrl }, gifPlayback: true, caption: actionText[command], mentions: [m.sender] }, {quoted: m})
}

handler.command = /^(hug|kiss|pat|slap|cuddle|expandDomain)$/i;

export default handler;
