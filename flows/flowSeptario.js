const { addKeyword } = require('@bot-whatsapp/bot');
const flowResultadosConfirmacion = require('./flowResultadosConfirmacion');

const flowSeptario = addKeyword(['7', 'septario'])
  .addAnswer(
    `Perfecto, un asesor se comunicará contigo muy pronto para resolver tu inquietud.`,
    null,
    async (_, { gotoFlow }) => {
      return gotoFlow(flowResultadosConfirmacion);
    }
  );

module.exports = flowSeptario;