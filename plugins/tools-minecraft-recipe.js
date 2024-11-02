import fetch from 'node-fetch';

let handler = async (m, { conn, args }) => {
    if (!args[0]) return conn.reply(m.chat, '🚩 Por favor, ingresa el nombre del objeto que deseas craftear. Ejemplo: .recipe espada', m);

    const itemName = args[0].toLowerCase();

    try {
        const response = await fetch(`https://minecraft-api.com/api/recipe/${itemName}`);
        if (!response.ok) throw new Error('No se encontró la receta para este objeto.');
        
        const recipeData = await response.json();
        
        if (!recipeData || !recipeData.materials || recipeData.materials.length === 0) {
            return conn.reply(m.chat, '🚩 No se encontró una receta válida para el objeto solicitado.', m);
        }

        const { name, description, materials, image } = recipeData;

        const materialsList = materials.map(material => `${material.name} x${material.amount}`).join('\n');

        await conn.sendMessage(m.chat, { 
            image: { url: image }, 
            caption: `🧰 Receta para: *${name}*\n\n📄 *Descripción*: ${description}\n\n🛠 *Materiales necesarios*:\n${materialsList}`
        }, { quoted: m });
    } catch (error) {
        await conn.reply(m.chat, `🚩 Error: ${error.message}`, m);
    }
};

handler.help = ["recipe <nombre_objeto>"];
handler.tags = ['minecraft'];
handler.command = /^(recipe|receta)$/i;

export default handler;
