import fetch from 'node-fetch';

let handler = async (m, { conn, args }) => {
    if (!args[0]) {
        return conn.reply(m.chat, 'Por favor, proporciona el nombre del usuario o el ID de la skin que quieres buscar.', m);
    }

    let username = args[0];
    
    try {
        let uuidResponse = await fetch(`https://api.mojang.com/users/profiles/minecraft/${username}`);
        let uuidData = await uuidResponse.json();

        if (!uuidData || !uuidData.id) {
            return conn.reply(m.chat, 'No se pudo encontrar la skin. Por favor, verifica el nombre del usuario.', m);
        }

        let uuid = uuidData.id;
        let skinImage = `https://crafatar.com/renders/body/${uuid}`; 
        let downloadLink = `https://crafatar.com/skins/${uuid}`; 

        await conn.sendFile(m.chat, skinImage, `${username}_skin.png`, `Aquí tienes la skin de ${username}.\n[Descargar Skin](${downloadLink})`, m);
    } catch (e) {
        console.error(e); 
        conn.reply(m.chat, 'Ocurrió un error al buscar la skin.', m); 
    }
};

handler.command = /^(skin)$/i;
handler.tag = ['Tools']
handler.help =['Skin']
export default handler;
