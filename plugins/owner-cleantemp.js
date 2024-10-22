import { promises as fsPromises } from 'fs';

import path from 'path';

const __dirname = path.resolve(); 

const cleanTempImages = async () => {

    const imageDir = path.join(__dirname, 'plugins'); //O donde guardes los plugins

    const files = await fsPromises.readdir(imageDir); 

    const tempImages = files.filter(file => file.startsWith('temp_image_') && file.endsWith('.png')); 

    if (tempImages.length === 0) {

        return '🚩 No se encontraron imágenes temporales para eliminar.';

    }

    try {

       

        await Promise.all(tempImages.map(async (file) => {

            const filePath = path.join(imageDir, file);

            await fsPromises.unlink(filePath);

        }));

        return `✅ Se eliminaron ${tempImages.length} imágenes temporales correctamente.`;

    } catch (error) {

        console.error('Error al eliminar las imágenes temporales:', error);

        return `🚩 Error al eliminar las imágenes: ${error.message}`;

    }

};

let handler = async (m, { conn }) => {

    try {

        const result = await cleanTempImages();

        await conn.reply(m.chat, result, m);

    } catch (error) {

        await conn.reply(m.chat, `🚩 Error: ${error.message}`, m);

    }

};

handler.help = ['cleantemp'].map(v => v + " *");

handler.tags = ['tools'];
handler.rowner = true
handler.command = ['cleantemp', 'limpiartemp', 'cleanimages'];

export default handler;+ " *");

handler.tags = ['tools'];
handler.rowner = true
handler.command = ['cleantemp', 'limpiartemp', 'cleanimages'];

export default handler;