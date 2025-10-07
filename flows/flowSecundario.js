const { addKeyword } = require('@bot-whatsapp/bot');

const flowSecundario = addKeyword(['2', 'siguiente'])
.addAnswer(
    [
        "Te presento los horarios de atención en nuestros puntos de venta y oficina administrativa.",
        '\n📍 *Punto de venta*',
        'Lunes a sábados de 7:00 a.m. a 9:50 p.m.',
        'Domingos y festivos de 7:00 a.m. a 8:00 p.m.',
        '\n🏢 *Oficina Administrativa*',
        'Lunes a viernes de 8:00 a.m. a 12:00 p.m. y de 2:00 p.m. a 6:00 p.m.',
        'Sábados de 8:00 a.m. a 12:00 p.m.',
    ]
)
.addAnswer(
    "¿Te puedo ayudar en algo más?\n1️⃣ Sí\n2️⃣ No",
    { capture: true },
    async (ctx, { flowDynamic, gotoFlow, fallBack }) => {
        const r = ctx.body.trim().toLowerCase();

        if (r === '1' || r.includes('si') || r.includes('sí')) {
            // Importación dinámica para evitar dependencia circular
            const flowInformacionGeneral = require('./flowInformacionGeneral');
            return gotoFlow(flowInformacionGeneral);
        }

        if (r === '2' || r.includes('no')) {
            const flowGracias = require('./flowGracias');
            return gotoFlow(flowGracias);
        }

        await flowDynamic("❌ No entendí. Responde con `1` o `2`.");
        return fallBack();
    }
);

module.exports = flowSecundario;