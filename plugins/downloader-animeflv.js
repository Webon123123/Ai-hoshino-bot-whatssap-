import { File } from 'megajs';
import path from 'path';
import fetch from 'node-fetch';
import fs from 'fs';

let handler = async (m, { conn, args, usedPrefix, command }) => {
    try {
        if (!args[0] || !args[1]) {
            return m.reply(`❗ *Uso incorrecto del comando.*\n\n✨ *Formato correcto:* ${usedPrefix + command} <anime-id> <episodio>\n🎉 *Ejemplo:* ${usedPrefix + command} to-love-ru-ova 1`);
        }

        const animeId = args[0];
        const episodeNumber = args[1];
        const apiUrl = `https://animeflvapi.vercel.app/download/anime/${animeId}/${episodeNumber}`;
        const response = await fetch(apiUrl);
        
        if (!response.ok) throw new Error('⚠️ *Error al obtener datos de la API.*');
        
        const { servers } = await response.json();
        const megaLink = servers[0].find(server => server.server === 'mega').url;
        
        if (!megaLink) throw new Error('⚠️ *Enlace de descarga no disponible.*');

        const file = File.fromURL(megaLink);
        await file.loadAttributes();
        
        if (file.size >= 300000000) {
            return m.reply('⚠️ *El archivo supera el límite de 300 MB.*');
        }

        const animeFolder = path.join('/tmp', 'animes');
        if (!fs.existsSync(animeFolder)) {
            fs.mkdirSync(animeFolder, { recursive: true });
        }

        const episodePath = path.join(animeFolder, `${animeId}_ep${episodeNumber}.mp4`);

        const dataBuffer = await file.downloadBuffer();
        fs.writeFileSync(episodePath, dataBuffer);

        const caption = `✨✨✨✨ *Descarga de AnimeFLV* ✨✨✨✨\n\n🎬 *Nombre:* ${file.name}\n📂 *Tamaño:* ${formatBytes(file.size)}\n\n🚀 *Cargando...*`;

        await conn.sendMessage(m.chat, { text: caption }, { quoted: m });
        
        await new Promise(resolve => setTimeout(resolve, 2000)); 

        await conn.sendFile(m.chat, episodePath, file.name, `✨ *Descargando ${file.name}...* ✨`, m, null, { mimetype: 'video/mp4', asDocument: true });

        fs.unlink(episodePath, (err) => {
            if (err) console.error(err);
        });
        
    } catch (error) {
        console.error(error);
        m.reply(`⚠️ *Error:* ${error.message}`);
    }
};

function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

handler.help = ['animedl <anime-id> <episode-number>'];
handler.tags = ['downloader'];
handler.command = ['animedl', 'animeflvdl', 'anidl'];
handler.register = true;

export default handler;
