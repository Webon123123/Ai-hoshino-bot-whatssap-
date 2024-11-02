import fetch from 'node-fetch';

let handler = async (m, { conn, args }) => {
    if (!args[0]) return conn.reply(m.chat, '🚩 Por favor, ingresa el ID del manga que deseas consultar.', m);
    
    const mangaId = args[0];

    try {
        const response = await fetch(`https://api.mangadex.org/manga/${mangaId}`);
        if (!response.ok) throw new Error('No se pudo obtener información del manga.');
        const mangaData = await response.json();

        const {
            title, 
            description, 
            statistics, 
            relationships = []
        } = mangaData.data.attributes;

        const translatedTitle = title['es'] || title['en'] || Object.values(title)[0];
        const synopsis = description['es'] || description['en'] || "Sin sinopsis disponible.";
        
        const rating = statistics ? statistics.rating.average.toFixed(1) : "No disponible";
        const chapters = mangaData.data.attributes.chapterCount || "No especificado";
        const volumes = mangaData.data.attributes.volumeCount || "No especificado";

        const coverRelation = relationships.find(rel => rel.type === 'cover_art');
        let coverUrl = "https://mangadex.org/images/placeholder.png";
        if (coverRelation && coverRelation.id) {
            coverUrl = `https://uploads.mangadex.org/covers/${mangaId}/${coverRelation.id}.256.jpg`;
        }

        const langQuery = await fetch(`https://api.mangadex.org/manga/${mangaId}/feed`);
        const langData = await langQuery.json();
        const languages = langData.data.reduce((acc, chapter) => {
            const lang = chapter.attributes.translatedLanguage;
            acc[lang] = acc[lang] ? acc[lang] + 1 : 1;
            return acc;
        }, {});
        
        const languagesText = Object.keys(languages).map(lang => `${lang}: ${languages[lang]} capítulos`).join(', ') || "No especificado";
        
        const message = `*📚 ${translatedTitle}*
        
*📖 Tomos*: ${volumes}
*📑 Capítulos*: ${chapters}
*🌐 Idiomas traducidos*: ${languagesText}
*⭐ Calificación*: ${rating}
        
*📜 Sinopsis*: ${synopsis}`;
        
        await conn.sendMessage(m.chat, { 
            image: { url: coverUrl }, 
            caption: message 
        }, { quoted: m });

    } catch (error) {
        await m.react('✖️');
        return conn.reply(m.chat, `🚩 Error: ${error.message}`, m);
    }
};

handler.help = ["infomanga <ID del manga>"];
handler.tags = ['tools'];
handler.command = /^(infomanga)$/i;

export default handler;

console.log("Creado por Masha_OFC");
