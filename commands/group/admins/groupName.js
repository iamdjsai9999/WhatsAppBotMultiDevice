module.exports.command = () => {
    let cmd = ["rename", "subject"];
    return { cmd, handler };
}

const handler = async (sock, msg, from, args, msgInfoObj) => {
    const { sendMessageWTyping, evv } = msgInfoObj;
    if (!args[0]) return sendMessageWTyping(from, { text: 'Provide name.' }, { quoted: msg });
    try {
        await sock.groupUpdateSubject(from, evv);
    } catch (err) {
        sendMessageWTyping(from, { text: 'Failed' }, { quoted: msg });
    }
}