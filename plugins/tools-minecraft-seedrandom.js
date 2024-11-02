import fetch from 'node-fetch';

let handler = async (m) => {
    try {
        const response = await fetch(`https://minecraft-api.com/api/random-world`);
        if (!response.ok) throw new Error('No se pudo generar el mundo aleatorio.');

        const worldData = await response.json();

        const { name, biome, coordinates, features } = worldData;

        let featuresList = features.length > 0 ? features.join(', ') : 'Ninguna característica especial';
        
        await m.reply(`🌍 Mundo Generado: *${name}*\n\n🗺 Bioma: *${biome}*\n📍 Coordenadas: *X: ${coordinates.x}, Y: ${coordinates.y}, Z: ${coordinates.z}*\n✨ Características: ${featuresList}`);
    } catch (error) {
        await m.reply(`🚩 Error: ${error.message}`);
    }
};

handler.help = ["randomworld"];
handler.tags = ['minecraft'];
handler.command = /^(randomworld|mundoaleatorio|seed)$/i;

export default handler;
