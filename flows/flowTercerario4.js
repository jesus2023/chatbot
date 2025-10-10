const { addKeyword } = require('@bot-whatsapp/bot');

const flowTercerario4 = addKeyword(['terceariocuatro'])
  .addAnswer(
    `🏦 *Recaudos y pagos*

De forma segura y rápida paga con nosotros tus servicios públicos 💡💧📶 y realiza las siguientes transacciones bancarias de estas entidades financieras:

🏦 *BANCA MÍA*
· Recaudo de cartera
· Retiros cuenta de ahorro
· Depósitos a cuentas
· Reembolsos y liberación de cupos

🏦 *BANCO AGRARIO DE COLOMBIA*
· Recaudos de convenios
· Pago de cartera
· Pago de tarjeta de crédito
· Depósitos a cuentas

🏦 *BANCO BBVA*
· Recaudo de convenios
· Retiros OTP
· Depósitos a cuentas
· Pago de tarjeta de crédito
· Pago de préstamos

🏦 *GRUPO AVAL*
· Recaudo de convenios
· Retiros OTP
· Pago a terceros
· Depósitos a cuentas

🏦 *FINANCIERA SUCRÉDITO C.A.C*
· Retiros
· Depósitos
· Consultas

🏦 *BANCOOMEVA*
· Recaudo de estado de cuenta

🏦 *FUNDACIÓN DE LA MUJER*
· Recaudo de cartera`
  )
  .addAnswer(
    "¿Te puedo ayudar en algo más?\n1️⃣ Sí\n2️⃣ No",
    { capture: true },
    async (ctx, { gotoFlow, fallBack }) => {
      const r = ctx.body.trim().toLowerCase();
      if (r === "1" || r.includes("si") || r.includes("sí")) {
        const flowPremios = require('./flowPremios');
        return gotoFlow(flowPremios);
      }
      if (r === "2" || r.includes("no")) {
        const flowGracias = require('./flowGracias');
        return gotoFlow(flowGracias);
      }
      return fallBack("❌ No entendí. Responde con `1` o `2`.");
    }
  );

module.exports = flowTercerario4;