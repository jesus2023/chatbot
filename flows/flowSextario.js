const { addKeyword } = require('@bot-whatsapp/bot');
const flowResultadosConfirmacion = require('./flowResultadosConfirmacion');

const flowSextario = addKeyword(['6', 'sextario'])
  .addAnswer(
    `✨ ¿Estás buscando empleo?\n
En nuestra empresa estamos en búsqueda de nuevos talentos como tú.\n
Envía tu hoja de vida a: vacantes.talentohumano@record.com.co\n
🔎 Y no olvides revisar nuestras redes sociales, allí publicamos nuestras vacantes.`,
    null,
    async (_, { gotoFlow }) => {
      return gotoFlow(flowResultadosConfirmacion);
    }
  );

module.exports = flowSextario;