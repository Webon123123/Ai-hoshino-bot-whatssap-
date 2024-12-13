let handler = async (m, { conn }) => {

    try {

        // Verificar si el mensaje proviene de un chat privado

        if (m.isGroup || m.text) return; // Ignorar mensajes con texto explícito o en grupos

        // Extraer el número del remitente

        let sender = m.sender;

        // Lista de códigos de país que se bloquearán

        const codigosBloqueados = [

            '212', // Marruecos

            '7',   // Rusia

            '380', // Ucrania

            '966', // Arabia Saudita

            '263', // Zimbabue

            '91',  // India

            '62',  // Indonesia

            '20',  // Egipto

            '90',  // Turquía

            '48',  // Polonia

            '372', // Estonia

            '994', // Azerbaiyán

            '237', // Camerún

            '92',  // Pakistán

            '221', // Senegal

        ];

        // Verificar si el número comienza con alguno de los códigos bloqueados

        const esBloqueado = codigosBloqueados.some(codigo => sender.startsWith(codigo));

        if (esBloqueado) {

            // Enviar el mensaje antes de bloquear

            const mensaje = "chingas a tu putamadre maldito extranjero.";

            await conn.reply(m.chat, mensaje, m);

            // Bloquear al usuario

            await conn.updateBlockStatus(sender, 'block');

            console.log(`Usuario con código bloqueado (${sender}) bloqueado automáticamente.`);

        }

    } catch (e) {

        console.error(`Error al intentar bloquear al usuario: ${e}`);

    }

};

// Configuración del plugin

handler.customPrefix = null; // No interfiere con comandos explícitos

handler.command = null; // No captura ningún comando explícito

handler.after = true; // Se ejecuta después de otros plugins

handler.priority = 1; // Se ejecuta con alta prioridad pero sin interferir

export default handler;