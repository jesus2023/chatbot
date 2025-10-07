const { addKeyword } = require('@bot-whatsapp/bot');

const flowPreguntasPqrs = addKeyword(['4.1'])
  .addAnswer(
    `❓ Estas son algunas preguntas frecuentes sobre el proceso de PQRS:\n
1️⃣ ¿Puedo enviar una PQRS de forma anónima?\n
2️⃣ ¿Cuánto tiempo tardo en obtener respuesta a mi PQRS?\n
3️⃣ ¿Qué canales existen además de WhatsApp para presentar una PQRS?\n
4️⃣ ¿Dónde puedo consultar el estado de mi PQRS?\n
\n
Por favor, escribe el número de la pregunta que deseas conocer.`,
    { capture: true }, // 👈 Esto indica que debe esperar la respuesta del usuario
    async (ctx, { flowDynamic, gotoFlow }) => {
      const respuesta = ctx.body.trim();

      switch (respuesta) {
        case '1':
          await flowDynamic([
            {
              body: '✅ ¡Sí! Puedes hacerlo de forma anónima. Sin embargo, para una mejor gestión es importante contar con el nombre completo y número de teléfono de quien presenta la PQRS.'
            }
          ]);
          break;

        case '2':
          await flowDynamic([
            {
              body: '⏳ Una vez recibamos tu PQRS, recibirás respuesta en un plazo máximo de 15 días hábiles según el tipo de solicitud.'
            }
          ]);
          break;

        case '3':
          await flowDynamic([
            {
              body: '📧 Correo electrónico: servicioalcliente@record.com.co\n☎️ Línea fija: 604 789 0042 EXT 222\n🏢 Oficinas administrativas: Calle 32 #2-08 Montería - Córdoba.'
            }
          ]);
          break;

        case '4':
          await flowDynamic([
            {
              body: '🧐 Puedes comunicarte al 604 789 0042 EXT 222 o escribir por este medio tu nombre y número de documento para informarte sobre el estado de tu solicitud.'
            }
          ]);
          break;

        default:
          await flowDynamic([
            { body: 'Por favor selecciona una opción válida (1, 2, 3 o 4).' }
          ]);
          return;
      }

      // 👇 Solo después de responder correctamente, redirige al flujo de gracias
      const flowGracias = require('./flowGracias');
      return gotoFlow(flowGracias);
    }
  );

module.exports = flowPreguntasPqrs;