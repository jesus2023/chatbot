const { addKeyword } = require('@bot-whatsapp/bot');

const flowSextario = addKeyword(['6', 'sextario'])
  .addAnswer(
    `✨ ¿Estás buscando empleo?\n
En nuestra empresa estamos en búsqueda de nuevos talentos como tú.\n
Envía tu hoja de vida a: vacantes.talentohumano@record.com.co\n
🔎 Y no olvides revisar nuestras redes sociales, allí publicamos nuestras vacantes.`
  )
  .addAnswer('', null, async (_, { gotoFlow }) => {
    const flowGracias = require('./flowGracias');
    return gotoFlow(flowGracias);
  });

module.exports = flowSextario;