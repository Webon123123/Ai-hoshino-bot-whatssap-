let handler = async (m, { conn, text, command, usedPrefix }) => {
  const gifs = {
    hug: [
      'https://media.giphy.com/media/l2QDM9Jnim1YVILXa/giphy.mp4',
      'https://media.giphy.com/media/od5H3PmEG5EVq/giphy.mp4',
      'https://media.giphy.com/media/BXrwTdoho6hkQ/giphy.mp4'
    ],
    kiss: [
      'https://media.giphy.com/media/FqBTvSNjNzeZG/giphy.mp4',
      'https://media.giphy.com/media/kU586ictpGb0Q/giphy.mp4',
      'https://media.giphy.com/media/bGm9FuBCGg4SY/giphy.mp4'
    ],
    pat: [
      'https://media.giphy.com/media/ARSp9T7wwxNcs/giphy.mp4',
      'https://media.giphy.com/media/109ltuoSQT212w/giphy.mp4',
      'https://media.giphy.com/media/4HP0ddZnNVvKU/giphy.mp4'
    ],
    slap: [
      'https://media.giphy.com/media/RXGNsyRb1hDJm/giphy.mp4',
      'https://media.giphy.com/media/Zau0yrl17uzdK/giphy.mp4',
      'https://media.giphy.com/media/iREUCnE3p3tNQ/giphy.mp4'
    ],
    kill: [
      'https://media.giphy.com/media/3oEjI5VtIhHvK37WYo/giphy.mp4',
      'https://media.giphy.com/media/12KiGLydHEdak8/giphy.mp4',
      'https://media.giphy.com/media/3o6ZtaO9BZHcOjmErm/giphy.mp4'
    ],
    cuddle: [
      'https://media.giphy.com/media/3bqtLDeiDtwhq/giphy.mp4',
      'https://media.giphy.com/media/Y8c7fTF4ry8Ew/giphy.mp4',
      'https://media.giphy.com/media/10BcGXjbHOctZC/giphy.mp4'
    ],
    punch: [
      'https://media.giphy.com/media/3oEjHP8ELRNNlnlLGM/giphy.mp4',
      'https://media.giphy.com/media/fO6UtDy5pWYwA/giphy.mp4',
      'https://media.giphy.com/media/l0MYEqEzwMWFCg8rm/giphy.mp4'
    ],
    suicide: [
      'https://media.giphy.com/media/q4sdF9tchap6U/giphy.mp4', 
      'https://media.giphy.com/media/xT0xeJpnrWC4XWblEk/giphy.mp4',
      'https://media.giphy.com/media/WrNf6bJGsKvIQ/giphy.mp4'
    ]
  };
  let gifUrl = gifs[command][Math.floor(Math.random() * gifs[command].length)];


  let userMention = m.mentionedJid && m.mentionedJid[0] ? '@' + (await conn.getName(m.mentionedJid[0])) : null;

  const actionText = {
    hug: userMention ? `*${conn.getName(m.sender)} ha abrazado a ${userMention}*` : `*${conn.getName(m.sender)} se ha abrazado a sí mismo*`,
    kiss: userMention ? `*${conn.getName(m.sender)} ha besado a ${userMention}*` : `*${conn.getName(m.sender)} se ha besado a sí mismo*`,
    pat: userMention ? `*${conn.getName(m.sender)} ha acariciado a ${userMention}*` : `*${conn.getName(m.sender)} se ha acariciado a sí mismo*`,
    slap: userMention ? `*${conn.getName(m.sender)} ha abofeteado a ${userMention}*` : `*${conn.getName(m.sender)} se ha abofeteado a sí mismo*`,
    kill: userMention ? `*${conn.getName(m.sender)} ha matado a ${userMention}*` : `*${conn.getName(m.sender)} ha intentado matarse a sí mismo*`,
    cuddle: userMention ? `*${conn.getName(m.sender)} se ha acurrucado con ${userMention}*` : `*${conn.getName(m.sender)} se ha acurrucado solo*`,
    punch: userMention ? `*${conn.getName(m.sender)} ha golpeado a ${userMention}*` : `*${conn.getName(m.sender)} se ha golpeado a sí mismo*`,
    suicide: `*${conn.getName(m.sender)} ha intentado suicidarse. 😢*`
  };

  
  conn.sendFile(m.chat, gifUrl, 'action.mp4', actionText[command], m, { mentions: [m.sender, ...(m.mentionedJid || [])] });
};

handler.command = /^(hug|kiss|pat|slap|kill|cuddle|punch|suicide)$/i;

export default handler;
