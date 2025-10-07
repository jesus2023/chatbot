const { addKeyword } = require('@bot-whatsapp/bot');

const flowInformacionGeneral = addKeyword(['informacion', 'preguntas', 'dudas'])
.addAnswer(
    `📋 *Selecciona una opción para obtener información:*
1️⃣ ¿Cuál es la dirección de la oficina administrativa Montería?
2️⃣ ¿Atienden los domingos o festivos?
3️⃣ ¿A qué hora puedo cobrar premios?
4️⃣ ¿A qué línea puedo comunicarme para obtener información general?`,
    { capture: true },
    async (ctx, { flowDynamic, fallBack }) => {
        const opcion = ctx.body.trim();

        switch (opcion) {
            case '1':
                await flowDynamic("🏢 Nuestra oficina administrativa Montería se encuentra ubicada en la calle 32 #2-08 B/centro.");
                break;

            case '2':
                await flowDynamic("¡Claro que sí!\n\nNuestros puntos de venta están disponibles desde las 7:00 a.m. hasta las 8:00 p.m. horario continuo.\n\n📌 Recuerda que nuestra oficina administrativa no abre esos días.");
                break;

            case '3':
                await flowDynamic("💰 *Para cobrar tu premio:*\n\n1️. Espera a que se juegue el sorteo o lotería a la que apostaste.\n\n2️. Acércate a uno de nuestros puntos de venta en los horarios establecidos.\n\n3️. Si tu premio supera los $250.000 debes acercarte a una oficina principal.\n\n¡Y listo!");
                break;

            case '4':
                await flowDynamic("📞 Puedes comunicarte a nuestra línea fija:\n\n604 789 0042\n\nAllí resolveremos todas tus dudas e inquietudes.");
                break;

            default:
                await flowDynamic("❌ Opción no válida. Por favor, elige una de las opciones (1 a 4).");
                return fallBack();
        }
        // NOTA: no preguntamos aquí; la siguiente addAnswer se encargará de preguntar y capturar la respuesta.
    }
)
.addAnswer(
    "¿Te puedo ayudar en algo más?\n1️⃣ Sí\n2️⃣ No",
    { capture: true },
    async (ctx, { flowDynamic, gotoFlow, fallBack }) => {
        const r = ctx.body.trim().toLowerCase();

        if (r === '1' || r.includes('si') || r.includes('sí')) {
            // Importación dinámica justo antes del gotoFlow (así evitas dependencia circular)
            const flowPremios = require('./flowPremios'); // módulo exportado como module.exports = flowPremios
            return gotoFlow(flowPremios);
            // Si en su lugar quisieras enviar al flowPrincipal definido en app.js deberías:
            // const flowPrincipal = require('../app').flowPrincipal;
            // return gotoFlow(flowPrincipal);
        }

        if (r === '2' || r.includes('no')) {
            // Importación dinámica para el flujo de gracias
            const flowGracias = require('./flowGracias'); // módulo exportado como module.exports = flowGracias
            return gotoFlow(flowGracias);
        }

        await flowDynamic("❌ No entendí. Responde con `1` o `2`.");
        return fallBack();
    }
);

module.exports = flowInformacionGeneral;