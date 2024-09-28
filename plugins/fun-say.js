let handler = async (m, { conn, args }) => {

    // Verifica si hay un mensaje para repetir

    if (!args.length) return m.reply('ℹ️ *Por favor, ingresa un mensaje después del comando.*\n\n*Ejemplo:* !say Hola, ¿cómo están?');

    // Junta los argumentos en un solo string (el mensaje que se repetirá)

    let message = args.join(' ');

    // Sanitiza el mensaje para evitar la ejecución de comandos o código

    if (message.startsWith('!') || message.startsWith('/')) {

        return m.reply('🚫 *No puedes usar comandos en el mensaje del comando "say".*');

    }

    // Decoración para el mensaje repetido

    let decoratedMessage = `🌸✨ *¡Atención!* ✨🌸\n\n💬 *Mensaje:* _"${message}"_\n\n💖 *Ai hoshino bot! 🌟* `;

    // Repite el mensaje con decoración

    await m.reply(decoratedMessage);

};

// Definición del comando y handler

handler.command = /^(say|decir)$/i; // Comandos que activan el plugin

handler.tag = ['fun']; // Handler con tag

handler.group = true; // Puede usarse en grupos

export default handler;