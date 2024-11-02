let handler = async (m, { conn, args }) => {
    if (!args[0]) return conn.reply(m.chat, '🚩 Por favor, ingresa el texto que deseas desencriptar.', m);
    
    const encryptedText = args.join(" ");
    const offset = 5; 

    const decryptText = (input) => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const decrypted = input.split('').map(char => {
            const index = chars.indexOf(char);
            if (index === -1) return char; 
            return chars[(index - offset + chars.length) % chars.length];
        }).join('');
        return decrypted;
    };

    const decryptedMessage = decryptText(encryptedText);
    
    conn.reply(m.chat, `🔓 Texto desencriptado: ${decryptedMessage}`, m);
};

handler.help = ["decrypt <texto>"];
handler.tags = ['tools'];
handler.command = /^(decrypt|desencriptar)$/i;

export default handler;

console.log("Creado por Masha_OFC");
