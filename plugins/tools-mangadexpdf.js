import fetch from 'node-fetch';
import { createWriteStream } from 'fs';
import { promises as fsPromises } from 'fs';
import PDFDocument from 'pdfkit';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const downloadImage = async (url, filename) => {
    const filePath = path.join(__dirname, `temp_image_${filename}.png`);
    const response = await fetch(url);
    if (!response.ok) throw new Error(`No se pudo descargar la imagen: ${url}`);
    const stream = createWriteStream(filePath);
    response.body.pipe(stream);
    return new Promise((resolve, reject) => {
        stream.on('finish', () => resolve(filePath));
        stream.on('error', reject);
    });
};

const createPDF = async (images) => {
    const pdfPath = path.join(__dirname, `manga_part.pdf`);
    const doc = new PDFDocument();
    const stream = createWriteStream(pdfPath);
    doc.pipe(stream);
    for (const image of images) {
        doc.addPage().image(image, { fit: [500, 700], align: 'center', valign: 'center' });
    }
    doc.end();
    return new Promise((resolve, reject) => {
        stream.on('finish', () => resolve(pdfPath));
        stream.on('error', reject);
    });
};

let handler = async (m, { conn, args }) => {
    if (!args[0]) return conn.reply(m.chat, '🚩 Por favor, ingresa el ID del manga que deseas descargar.', m);
    
    const mangaId = args[0];
    const langQuery = args[1] === 'es' ? 'translatedLanguage[]=es' : '';

    try {
        await m.react('🕓');

        const response = await fetch(`https://api.mangadex.org/manga/${mangaId}/feed?${langQuery}`);
        if (!response.ok) throw new Error('No se pudo obtener información del manga.');
        const { data: chapters } = await response.json();
        if (!chapters || chapters.length === 0) return conn.reply(m.chat, '🚩 No se encontraron capítulos para este manga.', m);
        
        const images = [];
        
        for (const chapter of chapters) {
            const { id: chapterId } = chapter;

            const imageResponse = await fetch(`https://api.mangadex.org/at-home/server/${chapterId}`);
            const imageData = await imageResponse.json();
            if (!imageData.chapter) continue;

            const { baseUrl, chapter: { hash, data } } = imageData;
            for (const filename of data) {
                const imageUrl = `${baseUrl}/data/${hash}/${filename}`;
                const imagePath = await downloadImage(imageUrl, filename);
                images.push(imagePath);
            }
        }

        if (images.length === 0) return conn.reply(m.chat, '🚩 No se encontraron imágenes en los capítulos seleccionados.', m);
        
        const totalImages = images.length;
        const parts = Math.ceil(totalImages / 80);
        
        for (let part = 0; part < parts; part++) {
            const imageSlice = images.slice(part * 80, (part + 1) * 80);
            const pdfPath = await createPDF(imageSlice);
            await conn.sendMessage(m.chat, { document: { url: pdfPath }, mimetype: 'application/pdf', fileName: `manga_part_${part + 1}.pdf` }, { quoted: m });

            await Promise.all(imageSlice.map(async (img) => await fsPromises.unlink(img))); // Eliminar imágenes temporales
        }
        
        await m.react('✅');
    } catch (error) {
        await m.react('✖️');
        return conn.reply(m.chat, `🚩 Error: ${error.message}`, m);
    }
};

handler.help = ["mangadex <ID del manga> [es]"];
handler.tags = ['tools'];
handler.command = /^(mangadex)$/i;

export default handler;

console.log("Creado por Masha_OFC");
