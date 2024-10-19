let handler = async (m, { conn, text, command, usedPrefix }) => {
  const gifs = {
    hug: [
      'https://media.giphy.com/media/5eyhBKLvYhafu/giphy.mp4', 
      'https://media.giphy.com/media/llmZp6fCVb4ju/giphy.mp4'
    ],
    kiss: [
      'https://media.giphy.com/media/bGm9FuBCGg4SY/giphy.mp4', 
      'https://media.giphy.com/media/12VXIxKaIEarL2/giphy.mp4'
    ],
    pat: [
      'https://media.giphy.com/media/109ltuoSQT212w/giphy.mp4',
      'https://media.giphy.com/media/4Zo41lhzKt6iZ8xff9/giphy.mp4'
    ],
    slap: [
      'https://media.giphy.com/media/Zau0yrl17uzdK/giphy.mp4',
      'https://media.giphy.com/media/3XlEk2RxPS1m8/giphy.mp4'
    ],
    cuddle: [
      'https://media.giphy.com/media/sUIZWMnfd4Mb6/giphy.mp4',
      'https://media.giphy.com/media/3bqtLDeiDtwhq/giphy.mp4'
    ]
  };

  let gifUrl = gifs[command][Math.floor(Math.random() * gifs[command].length)];

  // Acaso estas robandome plugins¿? :v
  let userMention = m.mentionedJid && m.mentionedJid[0] 
                    ? '@' + (await conn.getName(m.mentionedJid[0])) 
                    : m.quoted && m.quoted.sender 
                    ? '@' + (await conn.getName(m.quoted.sender)) 
                    : null;

  const actionText = {
    hug: userMention ? `*${conn.getName(m.sender)} ha dado un abrazo a ${userMention}*` : `*${conn.getName(m.sender)} se ha abrazado solo*`,
    kiss: userMention ? `*${conn.getName(m.sender)} ha besado a ${userMention}*` : `*${conn.getName(m.sender)} se ha dado un beso a sí mismo*`,
    pat: userMention ? `*${conn.getName(m.sender)} ha dado una palmada a ${userMention}*` : `*${conn.getName(m.sender)} se ha dado una palmada a sí mismo*`,
    slap: userMention ? `*${conn.getName(m.sender)} ha abofeteado a ${userMention}*` : `*${conn.getName(m.sender)} se ha abofeteado solo*`,
    cuddle: userMention ? `*${conn.getName(m.sender)} se ha acurrucado con ${userMention}*` : `*${conn.getName(m.sender)} se ha acurrucado solo*`
  };

  conn.sendFile(m.chat, gifUrl, 'action.mp4', actionText[command], m, { mentions: [m.sender, ...(m.mentionedJid || []), m.quoted ? m.quoted.sender : []] });
};

handler.command = /^(hug|kiss|pat|slap|cuddle)$/i;

export default handler;
