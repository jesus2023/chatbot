const { addKeyword } = require('@bot-whatsapp/bot');
const flowPremios = require('./flowPremios');

const flowApuestas = addKeyword(['apuestas', 'apostar', 'loterías', 'loteria'])
  .addAnswer(
    '🎯 *Opciones relacionadas con tus apuestas:*\n\n' +
    '1️⃣ ¿Dónde puedo hacer mis apuestas?\n' +
    '2️⃣ Requisitos para cobrar mi premio\n' +
    '3️⃣ Sorteos y Loterías que juegan el día de hoy\n' +
    '4️⃣ ¿Dónde puedo cobrar mi premio?\n\n' +
    'Por favor, responde con el número de la opción que desees consultar.',
    { capture: true },
    async (ctx, { flowDynamic, gotoFlow, fallBack, endFlow }) => {
      const opcion = ctx.body.trim();

      switch (opcion) {
        case '1':
          await flowDynamic(
            'Para realizar tus apuestas, te invitamos a visitar nuestros puntos de venta 🏪'
          );
          break;

        case '2':
          await flowDynamic(
            'Aquí te dejo los requisitos:\n\n' +
            '🧑‍🦱 Ser mayor de edad\n' +
            '🧾 El formulario debe estar en perfectas condiciones (sin estar roto, rallado, quemado o mojado)\n' +
            '🪪 Presentar tu documento de identidad\n' +
            '✍️ Escribe tu nombre completo, cédula, dirección y teléfono en la parte de atrás del formulario\n\n' +
            '⚠️ Recuerda: el premio es pagado al portador, por lo tanto, quien tenga el formulario puede cobrarlo. ¡Consérvalo en buen estado!'
          );
          break;

        case '3': {
          const flowResultados = require('./flowResultados');
          return gotoFlow(flowResultados);
        }

        case '4':
          await flowDynamic(
            'Para cobrar tu premio en nuestros puntos de venta, ten en cuenta lo siguiente:\n\n' +
            '✅ Si ganaste hasta $250.000, puedes cobrarlo en cualquier punto de venta.\n\n' +
            '✅ Si tu premio es mayor a $250.000, acércate a una de nuestras oficinas principales.'
          );
          break;

        default:
          await flowDynamic('❌ Opción no válida. Por favor responde con 1, 2, 3 o 4.');
          return fallBack();
      }
    }
  )
  .addAnswer(
    '¿Te puedo ayudar en algo más?\n1️⃣ Sí\n2️⃣ No',
    { capture: true },
    async (ctx, { flowDynamic, gotoFlow, fallBack }) => {
      const r = ctx.body.trim().toLowerCase();

      if (r === '1' || r.includes('si') || r.includes('sí')) {
        const flowPremios = require('./flowPremios');
        return gotoFlow(flowPremios);
      }

      if (r === '2' || r.includes('no')) {
        const flowGracias = require('./flowGracias');
        return gotoFlow(flowGracias);
      }

      await flowDynamic('❌ No entendí. Responde con `1` o `2`.');
      return fallBack();
    }
  );

module.exports = flowApuestas;