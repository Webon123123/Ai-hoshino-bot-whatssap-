import fetch from 'node-fetch';

import { createWriteStream } from 'fs';

import { promises as fsPromises } from 'fs'; 

import PDFDocument from 'pdfkit';

import { fileURLToPath } from 'url';

import path from 'path';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const downloadImage = async (url, index) => {

    const imagePath = path.join(__dirname, `temp_image_${index}.png`);

    const response = await fetch(url);

    if (!response.ok) throw new Error(`No se pudo descargar la imagen: ${url}`);

    const writeStream = createWriteStream(imagePath);

    response.body.pipe(writeStream);

    return new Promise((resolve, reject) => {

        writeStream.on('finish', () => {

            resolve(imagePath);

        });

        writeStream.on('error', reject);

    });

};

const createPDF = async (imagePaths, partNumber) => {

    const doc = new PDFDocument();

    const pdfPath = path.join(__dirname, `manga_part_${partNumber}.pdf`);

    const writeStream = createWriteStream(pdfPath);

    doc.pipe(writeStream);

    for (const imagePath of imagePaths) {

        doc.addPage();

        doc.image(imagePath, { fit: [500, 700], align: 'center', valign: 'center' });

    }

    doc.end();

    return new Promise((resolve, reject) => {

        writeStream.on('finish', () => {

            resolve(pdfPath);

        });

        writeStream.on('error', reject);

    });

};

let handler = async (m, { conn, args }) => {

    if (!args[0]) return conn.reply(m.chat, '🚩 Por favor, ingresa el ID del manga que deseas descargar.', m);

    const mangaId = args[0];

    const apiUrl = `https://api.mangadex.org/manga/${mangaId}/feed`;

    try {

        await m.react('🕓');

        const response = await fetch(apiUrl);

        if (!response.ok) throw new Error('No se pudo obtener información del manga.');

        const data = await response.json();

        const chapters = data.data;

        if (!chapters || chapters.length === 0) return conn.reply(m.chat, '🚩 No se encontraron capítulos para este manga.', m);

        const imagePaths = [];

        let imageCount = 0;

        let partNumber = 1;

        for (const chapter of chapters) {

            const chapterId = chapter.id;

            const chapterDetailsResponse = await fetch(`https://api.mangadex.org/at-home/server/${chapterId}`);

            const chapterDetails = await chapterDetailsResponse.json();

            if (!chapterDetails.chapter) {

                console.error(`Detalles del capítulo no encontrados para ID: ${chapterId}`);

                continue;

            }

            const host = chapterDetails.baseUrl;

            const chapterHash = chapterDetails.chapter.hash;

            const images = chapterDetails.chapter.data;

            for (let i = 0; i < images.length; i++) {

                const imageUrl = `${host}/data/${chapterHash}/${images[i]}`;

                const imagePath = await downloadImage(imageUrl, imageCount);

                imagePaths.push(imagePath);

                imageCount++;

                if (imageCount % 80 === 0) {

                    const pdfPath = await createPDF(imagePaths.slice(-80), partNumber);

                    await conn.sendMessage(m.chat, { document: { url: pdfPath }, mimetype: 'application/pdf', fileName: `manga_part_${partNumber}.pdf` }, { quoted: m });

                    partNumber++;

                    // Si no se eliminan las imágenes usa .cleantemp

                    await Promise.all(imagePaths.slice(-80).map(async (imgPath) => {

                        try {

                            await fsPromises.unlink(imgPath); 

                        } catch (err) {

                            console.error(`Error al eliminar la imagen: ${imgPath}`, err);

                        }

                    }));

                }

            }

        }

        if (imagePaths.length % 80 !== 0) {

            const pdfPath = await createPDF(imagePaths.slice(-imagePaths.length % 80), partNumber);

            await conn.sendMessage(m.chat, { document: { url: pdfPath }, mimetype: 'application/pdf', fileName: `manga_part_${partNumber}.pdf` }, { quoted: m });

            //Si no se eliminan usa .cleantemp (espera primero a que termine de enviar los mangas

            await Promise.all(imagePaths.slice(-imagePaths.length % 80).map(async (imgPath) => {

                try {

                    await fsPromises.unlink(imgPath);

                } catch (err) {

                    console.error(`Error al eliminar la imagen: ${imgPath}`, err);

                }

            }));

        }

        await m.react('✅');

    } catch (error) {

        console.error(error);

        await m.react('✖️');

        return conn.reply(m.chat, `🚩 Error: ${error.message}`, m);

    }

};

handler.help = ['mangadex'].map(v => v + " *<ID del manga>*");

handler.tags = ['tools'];

handler.command = ['mangadex'];

export default handler;der'];

handler.command = ['mangadex'];

export default handler;