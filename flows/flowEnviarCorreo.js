const { addKeyword } = require('@bot-whatsapp/bot');
const nodemailer = require('nodemailer');

// Estado por usuario
const userFormData = {}; // { userId: { nombre, numeroIdentificacion, descripcion, correo, step } }

const flowEnviarCorreo = addKeyword(['Pqrs'])
  // Paso 1: Nombre, número y descripción
  .addAnswer(
    "✏️ Por favor, indícame los siguientes datos separados por comas:\n\n• Tu nombre completo\n• Tu número de identificación\n• El motivo de tu solicitud o consulta\n\nEjemplo:\nJuan Pérez, 123456789, Necesito información sobre mi solicitud.",
    { capture: true },
    async (ctx, { flowDynamic, fallBack }) => {
      const userId = ctx.from;
      const respuesta = (ctx.body || '').trim();
      const partes = respuesta.split(',').map(p => p.trim());

      if (partes.length < 3) {
        return fallBack("⚠️ Por favor, ingresa los tres datos separados por comas.");
      }

      const [nombre, numeroIdentificacion, ...rest] = partes;
      const descripcion = rest.join(', ');

      userFormData[userId] = {
        nombre,
        numeroIdentificacion,
        descripcion,
        step: 'awaiting_email'
      };

      console.log('📌 Datos recibidos (1er paso):', userFormData[userId]);
      await flowDynamic(`Gracias ${nombre}. ✅ Ahora necesito tu correo electrónico para enviarte la confirmación.`);
    }
  )

  // Paso 2: Correo y envío de los dos mails
  .addAnswer(
    "📧 Ingresa tu correo electrónico:",
    { capture: true },
    async (ctx, { flowDynamic, endFlow, fallBack }) => {
      const userId = ctx.from;

      if (!userFormData[userId] || userFormData[userId].step !== 'awaiting_email') {
        return fallBack("⚠️ Primero necesito que me envíes: Tu nombre completo, tu número de identificación y el motivo, separados por comas.");
      }

      const correo = (ctx.body || '').trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(correo)) {
        return fallBack("⚠️ Ese correo no es válido. Intenta nuevamente.");
      }

      userFormData[userId].correo = correo;
      const data = userFormData[userId];

      console.log('📌 Correo recibido:', correo, 'de', userId);

      try {
        const transporter = nodemailer.createTransport({
          host: 'smtp.office365.com',
          port: 587,
          secure: false,
          auth: {
            user: process.env.OUTLOOK_USER,
            pass: process.env.OUTLOOK_PASS,
          },
        });

        // 1️⃣ Correo al cliente
        const mailCliente = {
          from: process.env.OUTLOOK_USER,
          to: data.correo,
          subject: 'Gracias por enviar tu PQR',
          text: `Hola ${data.nombre},\n\n✅ Hemos recibido tu solicitud correctamente.\n\nGracias por comunicarte con nosotros.\n\nAtentamente,\nChatbot Sara`,
        };

        // 2️⃣ Correo de notificación interna
        const mailInterno = {
          from: process.env.OUTLOOK_USER,
          to: 'carlos.perez@record.com.co', // misma persona por ahora
          subject: 'Se ha enviado un correo desde Chatbot Sara',
          text: `Datos enviados:\n\nNombre: ${data.nombre}\nNúmero de identificación: ${data.numeroIdentificacion}\nCorreo: ${data.correo}\nMotivo o descripción: ${data.descripcion}`,
        };

        // Enviar ambos correos
        await transporter.sendMail(mailCliente);
        await transporter.sendMail(mailInterno);

        console.log('✅ Ambos correos enviados correctamente para', userId);
        await flowDynamic("✅ ¡Gracias! Tu solicitud ha sido enviada correctamente.");
        delete userFormData[userId]; // Limpiar memoria

        return endFlow();
      } catch (error) {
        console.error('❌ Error enviando correos:', error, 'de', userId);
        return fallBack('❌ Ocurrió un error al enviar los correos. Intenta nuevamente.');
      }
    }
  )

  // Pregunta final con opciones
  .addAnswer(
    "🤖 ¿Te puedo ayudar en algo más?\n\n1️⃣ Sí\n2️⃣ No",
    { capture: true },
    async (ctx, { gotoFlow, fallBack }) => {
      const r = ctx.body.trim().toLowerCase();

      if (r === "1" || r.includes("si") || r.includes("sí")) {
        const flowPreguntasPqrs = require('./flowPreguntasPqrs');
        return gotoFlow(flowPreguntasPqrs);
      }

      if (r === "2" || r.includes("no")) {
        const flowGracias = require('./flowGracias');
        return gotoFlow(flowGracias);
      }

      return fallBack("❌ No entendí. Responde con `1` o `2`.");
    }
  );

module.exports = flowEnviarCorreo;