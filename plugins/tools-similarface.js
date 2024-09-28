import fs from 'fs';
import FormData from 'form-data';
import axios from 'axios';
import fetch from 'node-fetch';

let handler = async (m, { conn }) => {
let q = m.quoted ? m.quoted : m;
let mime = (q.msg || q).mimetype || '';

if (!mime.startsWith('image/')) {
return m.reply('🚩 Responde a una *Imagen.*');
}

await m.react('🕓');

let media = await q.download();
let formData = new FormData();
formData.append('image', media, { filename: 'file' });

let uploadResponse = await axios.post('https://api.imgbb.com/1/upload?key=10604ee79e478b08aba6de5005e6c798', formData, { headers: { ...formData.getHeaders() }});

if (uploadResponse.data.data) {
let url = uploadResponse.data.data.url;
let api = await fetch(`https://apis-starlights-team.koyeb.app/starlight/face-similar?url=${url}`);
let json = await api.json();
let { name, image, similar, others } = json;
let txt = '`乂  S I M I L A R  -  F A C E`\n\n';
    txt += `*${name}*\n`;
    txt += `	✩  *similitud* : ${similar}\n\n`;
    txt += `> 🚩 *${textbot}*`;

await conn.sendFile(m.chat, image, 'ibb.jpg', txt, m, null);
        
if (others && others.length > 0) {
for (let other of others) {
await conn.sendFile(m.chat, other.image, 'other.jpg', `${other.name}`, m, null);
}
}

await m.react('✅');
} else {
await m.react('✖️');
}
};

handler.help = ['similarface'];
handler.tags = ['tools'];
handler.command = /^(similitud-face|face-similar|similarface)$/i;
handler.register = true

export default handler;
