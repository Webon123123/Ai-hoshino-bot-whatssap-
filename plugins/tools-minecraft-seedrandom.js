import { randomInt } from 'crypto';

let handler = async (m) => {
    const seed = randomInt(-2147483648, 2147483647).toString(); 
    const biome = 'Plains'; 
    const coordinates = { x: randomInt(-1000, 1000), y: 64, z: randomInt(-1000, 1000) };
    const features = ['Rivers', 'Mountains', 'Forests', 'Memo te amo']; 
    let featuresList = features.join(', ');

    await m.reply(`🌍 Semilla generada: *${seed}*\n\n🗺 Bioma: *${biome}*\n📍 Coordenadas: *X: ${coordinates.x}, Y: ${coordinates.y}, Z: ${coordinates.z}*\n✨ Características: ${featuresList}`);
};

handler.help = ["generarseed"];
handler.tags = ['minecraft'];
handler.command = /^(generarseed|semilla|seed)$/i;

export default handler;
