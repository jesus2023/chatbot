const { addKeyword } = require('@bot-whatsapp/bot');

const flowGracias = addKeyword(['gracias', 'grac']).addAnswer(
    "¡Muy bien!\n\nSi necesitas algo en el futuro, aquí estaré para ayudarte.\n\n¡Gracias por escribirnos! 🙌"
);

module.exports = flowGracias;