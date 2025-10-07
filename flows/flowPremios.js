const { addKeyword } = require('@bot-whatsapp/bot');

const flowPremios = addKeyword(['premio', 'premios'])
  .addAnswer(
    '💰 *Opciones relacionadas con los premios:*\n\n' +
    '1️⃣ Resultados anteriores\n' +
    '2️⃣ ¿A qué hora puedo cobrar premios?\n' +
    '3️⃣ Requisitos para cobrar mi premio\n\n' +
    'Por favor, responde con el número de la opción que desees consultar.',
    { capture: true },
    async (ctx, { flowDynamic, gotoFlow, fallBack }) => {
      const opcion = ctx.body.trim();

      switch (opcion) {
        case '1':
          // Redirige al flujo de resultados anteriores
          const flowResultadosAnteriores = require('./flowResultadosAnteriores');
          return gotoFlow(flowResultadosAnteriores);

        case '2':
          await flowDynamic(
            'Para cobrar tu premio:\n\n' +
            '1️⃣ Espera a que se juegue el sorteo o lotería a la que apostaste.\n' +
            '2️⃣ Acércate a uno de nuestros puntos de venta en los horarios establecidos.\n' +
            '3️⃣ Si tu premio supera los $250.000 debes acercarte a una oficina principal.\n\n' +
            '¡Y listo! 🎉'
          );
          break;

        case '3':
          await flowDynamic(
            'Aquí te dejo los requisitos para cobrar tu premio:\n\n' +
            '🧑‍🦱 Ser mayor de edad.\n' +
            '🧾 El formulario debe estar en perfectas condiciones (sin estar roto, rayado, quemado o mojado).\n' +
            '🪪 Presentar tu documento de identidad.\n' +
            '✍️ Escribe tu nombre completo, cédula, dirección y teléfono en la parte de atrás del formulario.\n\n' +
            '⚠️ Recuerda: el premio es pagado al portador, por lo tanto, quien tenga el formulario puede cobrarlo. ¡Consérvalo en buen estado!'
          );
          break;

        default:
          await flowDynamic('❌ Opción no válida. Por favor responde con 1, 2 o 3.');
          return fallBack();
      }
    }
  )
  .addAnswer(
    "¿Te puedo ayudar en algo más?\n1️⃣ Volver al inicio\n2️⃣ Finalizar chat",
    { capture: true },
    async (ctx, { flowDynamic, gotoFlow, fallBack }) => {
      const r = ctx.body.trim().toLowerCase();

      if (r === '1' || r.includes('si') || r.includes('sí')) {
        const flowPrincipal = require('../app').flowPrincipal; 
        return gotoFlow(flowPrincipal);
      }

      if (r === '2' || r.includes('no')) {
        const flowGracias = require('./flowGracias');
        return gotoFlow(flowGracias);
      }

      await flowDynamic('❌ No entendí. Responde con `1` o `2`.');
      return fallBack();
    }
  );

module.exports = flowPremios;