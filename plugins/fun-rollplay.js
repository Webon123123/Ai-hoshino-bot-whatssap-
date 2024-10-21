let handler = async (m, { conn, text, command }) => {

  const gifs = {

    hug: [

      'https://media.giphy.com/media/wnsgren9NtITS/giphy.gif',

      'https://media.giphy.com/media/lrr9rHuoJOE0w/giphy.gif',

      'https://media.giphy.com/media/VGACXbkf0AeGs/giphy.gif'

    ],

    kiss: [ 

      'https://media.giphy.com/media/bm2O3nXTcKJeU/giphy.gif',

      'https://media.giphy.com/media/G3va31oEEnIkM/giphy.gif',

      'https://media.giphy.com/media/FqBTvSNjNzeZG/giphy.gif'

    ],

    pat: [

      'https://media.giphy.com/media/109ltuoSQT212w/giphy.gif',

      'https://media.giphy.com/media/q0ehAFdA3jFzi/giphy.gif',

      'https://media.giphy.com/media/12hvLuZ7uzvCvK/giphy.gif'

    ],

    slap: [

      'https://media.giphy.com/media/Zau0yrl17uzdK/giphy.gif',

      'https://media.giphy.com/media/RXGNsyRb1hDJm/giphy.gif',

      'https://media.giphy.com/media/jLeyZWgtwgr2U/giphy.gif'

    ],

    cuddle: [

      'https://media.giphy.com/media/svXXBgduBsJ1u/giphy.gif',

      'https://media.giphy.com/media/IrKniylAjDcl0/giphy.gif'

    ],

    expandDomain: [

      'https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif',

      'https://media.giphy.com/media/3oEjHLzm4BCF8kfNeE/giphy.gif'

    ]

  };

  if (!gifs[command]) return;

  let gifUrl = gifs[command][Math.floor(Math.random() * gifs[command].length)];

  let userMention = m.mentionedJid && m.mentionedJid[0] 

                    ? '@' + (await conn.getName(m.mentionedJid[0])) 

                    : m.quoted && m.quoted.sender 

                    ? '@' + (await conn.getName(m.quoted.sender)) 

                    : null;

  const actionText = {

    hug: userMention ? `*${conn.getName(m.sender)} ha abrazado a ${userMention}*` : `*${conn.getName(m.sender)} se ha abrazado solo*`,

    kiss: userMention ? `*${conn.getName(m.sender)} besó a ${userMention}*` : `*${conn.getName(m.sender)} se ha dado un beso a sí mismo*`,

    pat: userMention ? `*${conn.getName(m.sender)} le dio una palmadita a ${userMention}*` : `*${conn.getName(m.sender)} se dio una palmadita a sí mismo*`,

    slap: userMention ? `*${conn.getName(m.sender)} le dio una bofetada a ${userMention}*` : `*${conn.getName(m.sender)} se dio una bofetada solo*`,

    cuddle: userMention ? `*${conn.getName(m.sender)} se acurrucó con ${userMention}*` : `*${conn.getName(m.sender)} se acurrucó solo*`,

    expandDomain: userMention ? `*${conn.getName(m.sender)} ha expandido su dominio con ${userMention}*` : `*${conn.getName(m.sender)} ha expandido su dominio*`

  };

  conn.sendMessage(m.chat, { 

    video: { url: gifUrl, gifPlayback: true }, 

    caption: actionText[command], 

    mentions: [m.sender, ...(m.mentionedJid || []), m.quoted ? m.quoted.sender : []] 

  });

};

handler.command = /^(hug|kiss|pat|slap|cuddle|expandDomain)$/i;

export default handler;
