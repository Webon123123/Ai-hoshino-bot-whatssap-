// Código creado por Mar

import fs from 'fs';
import path from 'path';

let handler = async (m, { conn, usedPrefix }) => {
    let who;

    if (m.mentionedJid.length > 0) {
        who = m.mentionedJid[0];
    } else if (m.quoted) {
        who = m.quoted.sender;
    } else {
        who = m.sender;
    }

    let name = conn.getName(who);
    let name2 = conn.getName(m.sender);
    m.react('🔪');

    let str;
    if (m.mentionedJid.length > 0) {
        str = `\`${name2}\` *se está cortando por culpa de* \`${name || who}\`.`;
    } else if (m.quoted) {
        str = `\`${name2}\` *se está autolesionando mientras piensa en* \`${name || who}\`.`;
    } else {
        str = `\`${name2}\` *ha decidido cortarse.*`.trim();
    }

    if (m.isGroup) {
        let videos = [
            'https://files.catbox.moe/0kyitq.mp4',
            'https://files.catbox.moe/errovl.mp4',
            'https://files.catbox.moe/c191p4.mp4'
        ];
        const video = videos[Math.floor(Math.random() * videos.length)];

        let mentions = [who];
        conn.sendMessage(m.chat, { video: { url: video }, gifPlayback: true, caption: str, mentions }, { quoted: m });
    }
};

handler.help = ['cutting/cortarse @tag'];
handler.tags = ['dark'];
handler.command = ['cutting', 'cortarse','cut','cutt'];
handler.group = true;

export default handler;