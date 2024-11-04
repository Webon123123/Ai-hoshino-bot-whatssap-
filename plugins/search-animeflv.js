import fetch from 'node-fetch';
const { generateWAMessageContent, generateWAMessageFromContent, proto } = (await import('@whiskeysockets/baileys')).default;

let animeSearchHandler = async (m, { conn, text }) => {
    if (!text) {
        return m.reply('「 𝙸𝚗𝚐𝚛𝚎𝚜𝚊 𝚎𝚕 𝚗𝚘𝚖𝚋𝚛𝚎 𝚍𝚎𝚕 𝚊𝚗𝚒𝚖𝚎 𝚚𝚞𝚎 𝚍𝚎𝚜𝚎𝚊𝚜 𝚋𝚞𝚜𝚌𝚊𝚛 」');
    }

    try {
        async function createImageMessage(url) {
            const defaultImageUrl = 'https://i.ibb.co/hcnfCQS/file.jpg';
            const { imageMessage } = await generateWAMessageContent({ image: { url: url || defaultImageUrl } }, { upload: conn.waUploadToServer });
            return imageMessage;
        }

        let resultsArray = [];
        const response = await fetch(`https://animeflvapi.vercel.app/search?text=${encodeURIComponent(text)}`);
        const data = await response.json();

        if (!data.results || data.results.length === 0) {
            return conn.reply(m.chat, '❝ 𝙽𝚘 𝚜𝚎 𝚎𝚗𝚌𝚘𝚗𝚝𝚛𝚊𝚛𝚘𝚗 𝚊𝚗𝚒𝚖𝚎𝚜 𝚌𝚘𝚗 𝚎𝚜𝚎 𝚗𝚘𝚖𝚋𝚛𝚎 ❞', m);
        }

        for (let anime of data.results) {
            const animeId = anime.id;
            const animeTitle = anime.title || '✧ 𝚃𝚒𝚝𝚞𝚕𝚘 𝚗𝚘 𝚍𝚒𝚜𝚙𝚘𝚗𝚒𝚋𝚕𝚎';
            const animeScore = anime.score ? `⭒ 𝙿𝚞𝚗𝚝𝚞𝚊𝚌𝚒𝚘́𝚗: ${anime.score}` : '⭒ 𝙿𝚞𝚗𝚝𝚞𝚊𝚌𝚒𝚘́𝚗: 𝙽𝚘 𝚍𝚒𝚜𝚙𝚘𝚗𝚒𝚋𝚕𝚎';
            const animePoster = anime.poster || 'https://i.ibb.co/hcnfCQS/file.jpg';
            const imageMessage = await createImageMessage(animePoster);

            resultsArray.push({
                body: proto.Message.InteractiveMessage.Body.fromObject({
                    text: `✦ *𝚃𝚒𝚝𝚞𝚕𝚘*: ${animeTitle}\n${animeScore}`
                }),
                footer: proto.Message.InteractiveMessage.Footer.fromObject({
                    text: `➤ *𝙸𝙳*: ${animeId}`
                }),
                header: proto.Message.InteractiveMessage.Header.fromObject({
                    title: '',
                    hasMediaAttachment: true,
                    imageMessage: imageMessage
                }),
                nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                    buttons: [{
                        name: "cta_copy",
                        buttonParamsJson: `{"display_text":"✎ 𝙲𝚘𝚙𝚒𝚊𝚛 𝙸𝙳","id":"${animeId}","copy_code":"${animeId}"}`
                    }]
                })
            });
        }

        const message = generateWAMessageFromContent(m.chat, {
            viewOnceMessage: {
                message: {
                    messageContextInfo: {
                        deviceListMetadata: {},
                        deviceListMetadataVersion: 2
                    },
                    interactiveMessage: proto.Message.InteractiveMessage.fromObject({
                        body: proto.Message.InteractiveMessage.Body.create({
                            text: `「 𝚁𝚎𝚜𝚞𝚕𝚝𝚊𝚍𝚘𝚜 𝚙𝚊𝚛𝚊: ${text} 」`
                        }),
                        footer: proto.Message.InteractiveMessage.Footer.create({
                            text: '❝ 𝙷𝚎𝚖𝚘𝚜 𝚎𝚗𝚌𝚘𝚗𝚝𝚛𝚊𝚍𝚘 𝚕𝚘𝚜 𝚜𝚒𝚐𝚞𝚒𝚎𝚗𝚝𝚎𝚜 𝚛𝚎𝚜𝚞𝚕𝚝𝚊𝚍𝚘𝚜 ❞\n\n✧ 𝙲𝚛𝚎𝚊𝚍𝚘 𝚙𝚘𝚛 𝙼𝚊𝚜𝚑𝚊 𝙾𝙵𝙲'
                        }),
                        header: proto.Message.InteractiveMessage.Header.create({
                            hasMediaAttachment: false
                        }),
                        carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({
                            cards: [...resultsArray]
                        })
                    })
                }
            }
        }, {});

        await conn.relayMessage(m.chat, message.message, { messageId: message.key.id });

    } catch (error) {
        console.error(error);
        return conn.reply(m.chat, `「 𝙴𝚛𝚛𝚘𝚛: ${error.message} 」`, m);
    }
};

animeSearchHandler.help = ["animesearch"];
animeSearchHandler.tags = ["search"];
animeSearchHandler.command = /^(searchanime|animeflv|animesearch|animeid|animeflvbuscar|buscarnime|animebuscar)$/i;
export default animeSearchHandler;
