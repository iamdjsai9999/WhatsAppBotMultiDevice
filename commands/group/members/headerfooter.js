const {
    downloadContentFromMessage,
} = require("@adiwajshing/baileys");

module.exports.command = () => {
    let cmd = ["text", "txt", "texmeme"];
    return { cmd, handler };
}

require('dotenv').config();
const memeMaker = require('@erickwendel/meme-maker');
const { writeFile } = require('fs/promises');
const fs = require('fs');
const getRandom = (ext) => { return `${Math.floor(Math.random() * 10000)}${ext}` };


const handler = async (sock, msg, from, args, msgInfoObj) => {
    const { type, content, evv, sendMessageWTyping, OwnerSend } = msgInfoObj;
    const isMedia
        = type === "imageMessage" || type === "videoMessage";
    const isTaggedImage
        = type === "extendedTextMessage" && content.includes("imageMessage");

    if (!args[0]) return sendMessageWTyping(from, { text: `*Use* -textmeme _FontSize;toptext;bottomtext_` }, { quoted: msg });

    console.log('content ', evv);
    var TopText, BottomText, FontSize = 0;
    if (evv.includes(";")) {
        if (evv.split(";").length == 3) {
            FontSize = evv.split(";")[0];
            TopText = evv.split(";")[1];
            BottomText = evv.split(";")[2];
        } else if (evv.split(";").length == 2) {
            TopText = evv.split(";")[0];
            BottomText = evv.split(";")[1];
        }
        else if (evv.split(";").length == 1) {
            TopText = evv.split(";")[0];
            BottomText = '';
        } else {
            TopText = '';
            BottomText = '';
        }
        const MemePath = getRandom('.png');
        if ((isMedia && !msg.message.videoMessage || isTaggedImage)) {
            let downloadFilePath;
            if (msg.message.imageMessage) {
                downloadFilePath = msg.message.imageMessage;
            } else {
                downloadFilePath = msg.message.extendedTextMessage.contextInfo.quotedMessage.imageMessage;
            }
            const stream = await downloadContentFromMessage(downloadFilePath, 'image');
            let buffer = Buffer.from([])
            for await (const chunk of stream) {
                buffer = Buffer.concat([buffer, chunk])
            }
            const media = getRandom('.jpeg');
            await writeFile(media, buffer);
            const options = {
                image: media,
                outfile: MemePath,
                topText: TopText,
                bottomText: BottomText,
                // font: './../impact.ttf',
                fontSize: (FontSize == 0) ? 50 : FontSize,
                // fontFill: '#000000',
                // textPos: 'center',
                // strokeColor: '#000',
                strokeWeight: 1
            }
            memeMaker(options).then(() => {
                sock.sendMessage(
                    from,
                    {
                        image: fs.readFileSync(MemePath),
                    },
                    { quoted: msg }
                ).then(() => {
                    try {
                        fs.unlinkSync(MemePath);
                        fs.unlinkSync(media);
                    } catch { }
                })
                console.log('Sent');
            });
        } else {
            sendMessageWTyping(from, { text: `*Reply to Image Only*` }, { quoted: msg });
        }
    } else {
        sendMessageWTyping(from, { text: `*Must Include ; to saprate Header and Footer*` }, { quoted: msg });
    }
}