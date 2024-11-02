import fetch from 'node-fetch';

let handler = async (m, { conn, args }) => {
    if (!args[0]) return conn.reply(m.chat, '🚩 Por favor, ingresa el nombre o la IP del servidor que deseas consultar.', m);
    
    const serverAddress = args[0];

    try {
        const response = await fetch(`https://api.mcsrvstat.us/2/${serverAddress}`);
        if (!response.ok) throw new Error('No se pudo obtener información del servidor.');
        
        const data = await response.json();
        if (!data || data.online === false) return conn.reply(m.chat, `🚩 El servidor ${serverAddress} no está en línea o no es válido.`, m);

        const { ip, port, players, motd, version, software, plugins, icon } = data;

        const motdText = motd?.clean ? motd.clean.join("\n") : "No disponible";
        const playersOnline = players ? `${players.online}/${players.max}` : "No disponible";
        const pluginList = plugins?.names ? plugins.names.join(", ") : "No especificado";
        const softwareInfo = software || "No especificado";
        
        const message = `🌐 *Información del servidor de Minecraft: ${serverAddress}*
        
*IP*: ${ip || "No disponible"}
*Puerto*: ${port || "No disponible"}
*Jugadores conectados*: ${playersOnline}
*Versión*: ${version || "No disponible"}
*Software*: ${softwareInfo}
*Plugins*: ${pluginList}
*Mensaje del día (MOTD)*:
${motdText}`;

        if (icon) {
            const iconBuffer = Buffer.from(icon.split(",")[1], 'base64');
            await conn.sendMessage(m.chat, { image: iconBuffer, caption: message }, { quoted: m });
        } else {
            conn.reply(m.chat, message, m);
        }
        
    } catch (error) {
        return conn.reply(m.chat, `🚩 Error: ${error.message}`, m);
    }
};

handler.help = ["server <IP o nombre del servidor>"];
handler.tags = ['tools'];
handler.command = /^(server)$/i;

export default handler;

console.log("Creado por Masha_OFC");
