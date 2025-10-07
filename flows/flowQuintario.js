const { addKeyword } = require('@bot-whatsapp/bot');

const flowQuintario = addKeyword(['5', 'reclamos', 'peticiones'])
  .addAnswer(
    `📝 *Para empezar con tu PQRS*  

Debes saber que tus datos personales recolectados serán tratados bajo estricta confidencialidad, conforme a nuestra política de privacidad de datos.  

Puedes conocerla aquí:  
https://record.com.co/wp-content/uploads/2018/06/POLITICA-DE-PROTECION-DE-DATOS-PERSONALES-RECORD-S.A.-1.1.docx-OK.pdf`,
  )
  .addAnswer(
    "¿Aceptas nuestra politica de datos?\n1️⃣ Sí\n2️⃣ No",
    { capture: true },
    async (ctx, { gotoFlow, fallBack }) => {
      const r = ctx.body.trim().toLowerCase();

      if (r === "1" || r.includes("si") || r.includes("sí")) {
        const flowEnviarCorreo = require('./flowEnviarCorreo');
        return gotoFlow(flowEnviarCorreo);
      }

      if (r === "2" || r.includes("no")) {
        const flowContactoTelefonico = require('./flowContactoTelefonico');
        return gotoFlow(flowContactoTelefonico);
      }

      return fallBack("❌ No entendí. Responde con `1` o `2`.");
    }
  );

module.exports = flowQuintario;