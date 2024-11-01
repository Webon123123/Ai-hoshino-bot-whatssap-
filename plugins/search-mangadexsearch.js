import fetch from 'node-fetch';
const { generateWAMessageContent, generateWAMessageFromContent, proto } = (await import('@whiskeysockets/baileys')).default;

let handler = async (m, { conn, text }) => {
    if (!text) return m.reply('🚩 Por favor, ingresa el nombre del manga que deseas buscar, por ejemplo: ".mangaid komi san" o ".mangaid español | komi san".');

    try {
        let languageCode = 'es';
        let mangaTitle;

        if (text.includes('|')) {
            let [lang, ...titleParts] = text.split('|').map(str => str.trim());
            mangaTitle = titleParts.join(' ');
            languageCode = lang.toLowerCase();
        } else {
            mangaTitle = text.trim();
        }

        async function createImage(url) {
            const imageUrl = url || 'https://i.ibb.co/NCjGCJB/file.jpg';
            const { imageMessage } = await generateWAMessageContent(
                { image: { url: imageUrl } },
                { upload: conn.waUploadToServer }
            );
            return imageMessage;
        }

        let messages = [];
        const apiResponse = await fetch(`https://api.mangadex.org/manga/?title=${encodeURIComponent(mangaTitle)}&translatedLanguage[]=${languageCode}`);
        const jsonData = await apiResponse.json();

        if (!jsonData.data || jsonData.data.length === 0) {
            return conn.reply(m.chat, '🚩 No se encontraron mangas en el idioma seleccionado con ese nombre.', m);
        }

        for (let manga of jsonData.data) {
            const mangaId = manga.id;
            const title = manga.attributes.title[languageCode] || manga.attributes.title.en || 'Título no disponible';
            const coverArt = manga.relationships.find(rel => rel.type === 'cover_art');
            const coverUrl = coverArt && coverArt.attributes && coverArt.attributes.fileName
                ? `https://uploads.mangadex.org/covers/${mangaId}/${coverArt.attributes.fileName}.256.jpg`
                : null;

            const image = await createImage(coverUrl);
            messages.push({
                body: proto.Message.InteractiveMessage.Body.fromObject({
                    text: `📖 **Título**: ${title}`
                }),
                footer: proto.Message.InteractiveMessage.Footer.fromObject({
                    text: `🆔 **ID**: ${mangaId}`
                }),
                header: proto.Message.InteractiveMessage.Header.fromObject({
                    title: '',
                    hasMediaAttachment: true,
                    imageMessage: image
                }),
                nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                    buttons: [{
                        name: "cta_copy",
                        buttonParamsJson: `{"display_text":"Copiar ID","id":"${mangaId}","copy_code":"${mangaId}"}` 
                    }]
                })
            });
        }

        const messageContent = generateWAMessageFromContent(m.chat, {
            viewOnceMessage: {
                message: {
                    messageContextInfo: {
                        deviceListMetadata: {},
                        deviceListMetadataVersion: 2
                    },
                    interactiveMessage: proto.Message.InteractiveMessage.fromObject({
                        body: proto.Message.InteractiveMessage.Body.create({
                            text: `Resultados para: ${mangaTitle}`
                        }),
                        footer: proto.Message.InteractiveMessage.Footer.create({
                            text: '✨🌌 ¡Explora el mundo del manga! 🌌✨'
                        }),
                        header: proto.Message.InteractiveMessage.Header.create({
                            hasMediaAttachment: false
                        }),
                        carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({
                            cards: [...messages]
                        })
                    })
                }
            }
        }, {});

        await conn.relayMessage(m.chat, messageContent.message, { messageId: messageContent.key.id });
    } catch (error) {
        console.error(error);
        return conn.reply(m.chat, `🚩 Error: ${error.message}`, m);
    }
};

handler.help = ["mangaid"];
handler.tags = ["search"];
handler.command = /^(searchmanga|mangaid|mangadexid|mangasearch|buscarmanga)$/i;

export default handler;

console.log("Created by Masha_OFC");
