let handler = async (m, { conn, args, command, participants }) => {

    // Verifica si se proporciona un usuario

    if (!args.length || !m.mentionedJid.length) {

        return conn.sendMessage(m.chat, {

            text: `🚨 *Atención:* 🚨\n\nParece que has olvidado mencionar a un usuario para aplicar o eliminar una advertencia. Recuerda que es crucial seguir las reglas del grupo para garantizar una buena convivencia. Para advertir a alguien, asegúrate de usar el comando de forma correcta. Ejemplo: *.warn @usuario [razón]*.\n\nTu colaboración hace del grupo un lugar mejor para todos. ¡Gracias!`,

        });

    }

    // Obtiene el ID del usuario mencionado

    const userId = m.mentionedJid[0];

    const reason = args.slice(1).join(' ') || 'sin especificar'; // Razón por defecto

    // Inicializa la advertencia para el usuario si no existe

    if (!global.warn) global.warn = {};

    if (!global.warn[userId]) global.warn[userId] = 0;

    if (command === 'warn' || command === 'advertir') {

        // Incrementa el contador de advertencias

        global.warn[userId] += 1;

        // Verifica si el usuario ha alcanzado el límite de advertencias

        if (global.warn[userId] >= 3) {

            // Mensaje de advertencia en grupo antes de la expulsión

            await conn.sendMessage(m.chat, {

                text: `🔄 *Proceso en curso* 🔄\n\nEstamos procesando la eliminación de @${userId.split('@')[0]} del grupo por alcanzar el límite de advertencias permitidas.\n\n⚠️ *Razón de la expulsión:* Acumulación de advertencias que no han sido tomadas en cuenta y por incumplimiento de las normas establecidas en este grupo. La paciencia tiene un límite, y hoy lo has alcanzado.`,

                mentions: [userId],

            });

            // Envía el comando de kick al grupo y elimina el mensaje tras enviarlo

            const kickMessage = await conn.sendMessage(m.chat, {

                text: `.kick @${userId.split('@')[0]}`,

                mentions: [userId],

            });

            // Elimina el mensaje del comando kick después de unos segundos

            setTimeout(() => {

                conn.modifyChat(m.chat, 'delete', {

                    id: kickMessage.key.id,

                    remoteJid: m.chat,

                    fromMe: true

                });

            }, 5000); // Tiempo para eliminar el mensaje de .kick

            // Envía un mensaje privado al usuario expulsado

            await conn.sendMessage(userId, {

                text: `⚠️ *Has sido expulsado del grupo* ⚠️\n\n📋 *Razón:* Has acumulado 3 advertencias en el grupo.\n\n🛑 *Detalles de las advertencias:*\n1️⃣ Primera advertencia por incumplimiento de normas básicas de respeto.\n2️⃣ Segunda advertencia por reiterar el comportamiento inapropiado.\n3️⃣ Finalmente, una tercera advertencia que ha llevado a tu expulsión.\n\nEste grupo busca mantener un ambiente sano y agradable para todos los miembros. No seguir las normas ha traído consecuencias inevitables. Reflexiona sobre tus acciones y esperamos que mejores tu conducta en el futuro.`,

            });

            delete global.warn[userId]; // Resetea las advertencias del usuario

            return;

        }

        // Envía un mensaje de advertencia al usuario

        await conn.sendMessage(m.chat, {

            text: `🔔 *Advertencia aplicada* 🔔\n\n@${userId.split('@')[0]}, has recibido una advertencia. ¡Atención! Esto no es un simple aviso, es un recordatorio firme de que tu comportamiento debe alinearse con las normas del grupo. 📋 *Razón:* ${reason}\n\n📝 *Total de advertencias:* ${global.warn[userId]}/3.\nSi llegas a 3 advertencias, serás expulsado del grupo sin más advertencias. ¡Cuida tu conducta!`,

            mentions: [userId],

        });

    } else if (command === 'delwarn') {

        if (global.warn[userId] > 0) {

            global.warn[userId] -= 1;

            await conn.sendMessage(m.chat, {

                text: `✅ *Advertencia eliminada* ✅\n\n@${userId.split('@')[0]} ahora tiene ${global.warn[userId]} advertencias restantes. Este es un gesto de confianza, pero no lo malinterpretes: es tu oportunidad para corregir tu actitud y respetar las normas del grupo. ¡Aprovecha esta oportunidad sabiamente!`,

                mentions: [userId],

            });

        } else {

            await conn.sendMessage(m.chat, {

                text: `⚠️ *Error al eliminar advertencia* ⚠️\n\n@${userId.split('@')[0]} no tiene advertencias registradas en este grupo. No se puede eliminar lo que no existe, así que por favor verifica el usuario y asegúrate de que realmente tiene advertencias antes de intentar eliminarlas.`,

                mentions: [userId],

            });

        }

    } else if (command === 'listwarns') {

        // Lista los usuarios con advertencias en el grupo

        let list = Object.keys(global.warn).map(jid => {

            return `@${jid.split('@')[0]}: ${global.warn[jid]} advertencias`;

        }).join('\n');

        if (!list) list = 'Actualmente no hay usuarios con advertencias en este grupo. Todo parece estar bajo control, lo cual es algo positivo para la comunidad. Sigamos manteniendo el respeto y las buenas prácticas.';

        await conn.sendMessage(m.chat, {

            text: `📋 *Lista de advertencias del grupo* 📋\n\n${list}\n\nEste es un resumen de las advertencias actuales. Recuerda que el propósito de este sistema es mantener el respeto y orden en el grupo. Asegúrate de no estar en esta lista acumulando advertencias innecesarias.`,

        });

    }

};

// Definición del comando y handler

handler.command = /^(advertir|warn|delwarn|listwarns)$/i; // Comandos que activan el plugin
handler.tag = ['group']
handler.admin = true; // Solo administradores pueden usar este comando

handler.group = true; // Puede usarse en grupos

export default handler;