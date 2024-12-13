import fs from 'fs';
import path from 'path';

const baseDir = './memorias';

if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir);
}

function obtenerTamanoDirectorio(directorio) {
    const archivos = fs.readdirSync(directorio);
    return archivos.reduce((total, archivo) => {
        const archivoPath = path.join(directorio, archivo);
        const stats = fs.statSync(archivoPath);
        return total + stats.size;
    }, 0);
}

function listarEspaciosUsuario(directorio) {
    const archivos = fs.readdirSync(directorio);
    return archivos.map(archivo => {
        const archivoPath = path.join(directorio, archivo);
        const stats = fs.statSync(archivoPath);
        return {
            nombre: archivo,
            tamano: stats.size,
            tipo: archivo.endsWith('.txt') ? 'Texto' : 'Imagen',
        };
    });
}

let handler = async (m, { conn, command }) => {
    try {
        const usuarioID = m.sender;
        const userDir = path.join(baseDir, usuarioID);

        if (!fs.existsSync(userDir)) {
            return conn.reply(
                m.chat,
                `╭────────🌸────────╮\n` +
                `  ⚠️ No tienes memorias guardadas aún.\n` +
                `╰────────🌸────────╯`,
                m
            );
        }

        if (command === 'vermemorias') {
            const espacios = listarEspaciosUsuario(userDir);
            const tamanoTotal = obtenerTamanoDirectorio(userDir);

            if (espacios.length === 0) {
                return conn.reply(
                    m.chat,
                    `╭────────🌸────────╮\n` +
                    `  ⚠️ No hay contenido guardado en tus memorias.\n` +
                    `╰────────🌸────────╯`,
                    m
                );
            }

            const detalles = espacios
                .map(
                    (espacio, index) =>
                        `🌟 *Espacio ${index + 1}*\n` +
                        `  • Archivo: ${espacio.nombre}\n` +
                        `  • Tipo: ${espacio.tipo}\n` +
                        `  • Tamaño: ${(espacio.tamano / 1024).toFixed(2)} KB\n`
                )
                .join('\n');

            return conn.reply(
                m.chat,
                `╭────────🌸────────╮\n` +
                `  📂 *Memorias guardadas:*\n\n${detalles}\n` +
                `  💾 *Tamaño total*: ${(tamanoTotal / (1024 * 1024)).toFixed(2)} MB\n` +
                `╰────────🌸────────╯`,
                m
            );
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

handler.command = /^vermemorias$/i;

export default handler;