const { addKeyword } = require('@bot-whatsapp/bot');

const flowResultadosConfirmacion = addKeyword(['confirmacion'])
.addAnswer(
    "¿Te puedo ayudar en algo más?\n1️⃣ Sí\n2️⃣ No",
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

        await flowDynamic("❌ No entendí. Responde con `1` o `2`.");
        return fallBack();
    }
);

module.exports = flowResultadosConfirmacion;