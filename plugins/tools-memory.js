import fs from 'fs';
import path from 'path';

// Directorio base para los datos de los usuarios
const baseDir = './memorias';

// Crear carpeta base si no existe
if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir);
}

// Obtener el tamaño total de una carpeta
function obtenerTamanoDirectorio(directorio) {
    const archivos = fs.readdirSync(directorio);
    return archivos.reduce((total, archivo) => {
        const archivoPath = path.join(directorio, archivo);
        const stats = fs.statSync(archivoPath);
        return total + stats.size;
    }, 0);
}

let handler = async (m, { conn, command, args, isPremium }) => {
    try {
        const usuarioID = m.sender;
        const userDir = path.join(baseDir, usuarioID);

        // Crear carpeta del usuario si no existe
        if (!fs.existsSync(userDir)) {
            fs.mkdirSync(userDir);
        }

        // Límite de almacenamiento en bytes (20 MB)
        const limiteMemoria = 20 * 1024 * 1024;

        // Número de espacios disponibles
        const espaciosDisponibles = isPremium ? 5 : 3;

        if (command === 'guardar') {
            const espacio = parseInt(args[0], 10);

            if (isNaN(espacio) || espacio < 1 || espacio > espaciosDisponibles) {
                return conn.reply(
                    m.chat, 
                    `╭────────🌸────────╮\n` +
                    `  Debes especificar un número válido entre 1 y ${espaciosDisponibles} para guardar el contenido.\n` +
                    `╰────────🌸────────╯`, 
                    m
                );
            }

            if (!m.quoted) {
                return conn.reply(
                    m.chat, 
                    `╭────────🌸────────╮\n` +
                    `  Responde a un mensaje o foto que desees guardar.\n` +
                    `╰────────🌸────────╯`, 
                    m
                );
            }

            // Verificar tamaño de almacenamiento
            const tamanoActual = obtenerTamanoDirectorio(userDir);
            if (tamanoActual >= limiteMemoria) {
                return conn.reply(
                    m.chat, 
                    `╭────────🌸────────╮\n` +
                    `  🚫 Has alcanzado el límite de almacenamiento de 20 MB.\n` +
                    `╰────────🌸────────╯`, 
                    m
                );
            }

            if (m.quoted.text) {
                // Guardar mensaje como .txt
                const archivoPath = path.join(userDir, `espacio${espacio}.txt`);
                fs.writeFileSync(archivoPath, m.quoted.text, 'utf-8');
                return conn.reply(
                    m.chat, 
                    `╭────────🌸────────╮\n` +
                    `  ✅ Mensaje guardado en el espacio ${espacio}.\n` +
                    `╰────────🌸────────╯`, 
                    m
                );
            } else if (m.quoted.mimetype && /image/.test(m.quoted.mimetype)) {
                // Guardar imagen
                const buffer = await m.quoted.download();
                const archivoPath = path.join(userDir, `espacio${espacio}.jpg`);
                fs.writeFileSync(archivoPath, buffer);
                return conn.reply(
                    m.chat, 
                    `╭────────🌸────────╮\n` +
                    `  ✅ Imagen guardada en el espacio ${espacio}.\n` +
                    `╰────────🌸────────╯`, 
                    m
                );
            } else {
                return conn.reply(
                    m.chat, 
                    `╭────────🌸────────╮\n` +
                    `  ⚠️ Solo puedes guardar mensajes de texto o fotos.\n` +
                    `╰────────🌸────────╯`, 
                    m
                );
            }

        } else if (command === 'recordar') {
            const espacio = parseInt(args[0], 10);

            if (isNaN(espacio) || espacio < 1 || espacio > espaciosDisponibles) {
                return conn.reply(
                    m.chat, 
                    `╭────────🌸────────╮\n` +
                    `  Debes especificar un número válido entre 1 y ${espaciosDisponibles} para recordar el contenido.\n` +
                    `╰────────🌸────────╯`, 
                    m
                );
            }

            const archivoTxt = path.join(userDir, `espacio${espacio}.txt`);
            const archivoImg = path.join(userDir, `espacio${espacio}.jpg`);

            if (fs.existsSync(archivoTxt)) {
                const texto = fs.readFileSync(archivoTxt, 'utf-8');
                return conn.reply(
                    m.chat, 
                    `╭────────🌸────────╮\n` +
                    `  📝 *Contenido guardado en el espacio ${espacio}*: \n\n${texto}\n` +
                    `╰────────🌸────────╯`, 
                    m
                );
            } else if (fs.existsSync(archivoImg)) {
                const buffer = fs.readFileSync(archivoImg);
                return conn.sendMessage(
                    m.chat, 
                    { image: buffer }, 
                    { quoted: m }
                );
            } else {
                return conn.reply(
                    m.chat, 
                    `╭────────🌸────────╮\n` +
                    `  ⚠️ No hay contenido guardado en el espacio ${espacio}.\n` +
                    `╰────────🌸────────╯`, 
                    m
                );
            }
        }
    } catch (e) {
        console.error(e);
        return conn.reply(
            m.chat, 
            `╭────────🌸────────╮\n` +
            `  ⚠️ Ocurrió un error al procesar tu solicitud. Intenta nuevamente.\n` +
            `╰────────🌸────────╯`, 
            m
        );
    }
};

handler.command = /^(guardar|recordar)$/i;

export default handler;