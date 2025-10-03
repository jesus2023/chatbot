const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot')
const mysql = require('mysql2/promise')
const nodemailer = require('nodemailer');
const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const PostgreSQLAdapter = require('@bot-whatsapp/database/postgres')

// Conexión con PostgreSQL usando variables de entorno del contenedor
const POSTGRES_DB_HOST = process.env.DB_HOST
const POSTGRES_DB_USER = process.env.DB_USER
const POSTGRES_DB_PASSWORD = process.env.DB_PASS
const POSTGRES_DB_NAME = process.env.DB_NAME
const POSTGRES_DB_PORT = process.env.DB_PORT

/**
 * Aqui declaramos los flujos hijos, los flujos se declaran de atras para adelante, es decir que si tienes un flujo de este tipo:
 *
 *          Menu Principal
 *           - SubMenu 1
 *             - Submenu 1.1
 *           - Submenu 2
 *             - Submenu 2.1
 *
 * Primero declaras los submenus 1.1 y 2.1, luego el 1 y 2 y al final el principal.
 */

// Flujo para "Resultados anteriores" que captura la fecha
const flowResultadosAnteriores = addKeyword(['back'])
  .addAnswer(
    "Por favor indícanos el día, mes y año exactos a consultar:\n📌 Ejemplo: 05/02/2025 (día/mes/año)",
    { capture: true },
    async (ctx, { fallBack, flowDynamic }) => {
      try {
        const fecha = ctx.body.trim();
        console.log('📌 Fecha recibida:', fecha);
        
        // Validar formato dd/mm/yyyy
        const regexFecha = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(20\d{2})$/;
        
        if (!regexFecha.test(fecha)) {
          console.log('⚠️ Fecha inválida:', fecha);
          await flowDynamic("⚠️ El formato no es válido. Usa el formato dd/mm/yyyy\n📌 Ejemplo: 05/02/2025");
          return fallBack();
        }
        
        console.log('✅ Fecha válida:', fecha);
        
        // Consultar resultados de esa fecha
        const mysql = require('mysql2/promise');
        const conn = await mysql.createConnection({
          host: process.env.MYSQL_HOST,
          user: process.env.MYSQL_USER,
          password: process.env.MYSQL_PASS,
          database: process.env.MYSQL_DB
        });
        
        // Convertir fecha de dd/mm/yyyy a yyyy-mm-dd para MySQL
        const [dia, mes, anio] = fecha.split('/');
        const fechaMySQL = `${anio}-${mes}-${dia}`;
        
        const [rows] = await conn.execute(`
          SELECT LOTERIA, NUMERO, SERIE 
          FROM wp9a_resultados 
          WHERE DATE(FECHA) = ?
          ORDER BY LOTERIA
        `, [fechaMySQL]);
        
        await conn.end();
        
        if (rows.length === 0) {
          await flowDynamic(`❌ No se encontraron resultados para la fecha ${fecha}`);
          return fallBack();
        }
        
        // Formatear resultados
        let mensaje = `📊 *RESULTADOS DEL ${fecha}* 📊\n\n`;
        mensaje += "*LOTERÍA* | *NÚMERO* | *SERIE*\n";
        mensaje += "-----------------------------\n";
        
        rows.forEach(row => {
          mensaje += `*${row.LOTERIA}* | ${row.NUMERO} | ${row.SERIE || '-'}\n`;
        });
        
        return await flowDynamic(mensaje);
        
      } catch (error) {
        console.error('❌ Error procesando fecha:', error);
        return await flowDynamic('❌ Ocurrió un error al consultar los resultados. Intenta nuevamente.');
      }
    }
  );

const flowResultados = addKeyword(['1', 'resultados', 'sorteos'])
.addAction(async (_, { flowDynamic }) => {
    const mysql = require('mysql2/promise');

    try {
        const conn = await mysql.createConnection({
            host: process.env.MYSQL_HOST,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASS,
            database: process.env.MYSQL_DB
        });

        // Lista fija de loterías en el orden exacto que quieres mostrar
        const loterias = [
            "Antioqueña",
            "Astro Lun",
            "Astro Sol",
            "BOGOTA",
            "BOYACA",
            "Cafeterito 2",
            "Caribe Noche",
            "Caribeña Dia",
            "CAUCA",
            "Chontico",
            "CRUZROJA",
            "Culona",
            "CUNDINAMARCA",
            "Dorado Mañana",
            "Dorado Tarde",
            "El Pijao",
            "Fantastica Dia",
            "Fantastica Noche",
            "HUILA",
            "MANIZALES",
            "MEDELLIN",
            "META",
            "Paisita 1",
            "Paisita 2",
            "QUINDIO",
            "RISARALDA",
            "SANTANDER",
            "Sinuano Dia",
            "Sinuano Noche",
            "TOLIMA",
            "VALLE"
        ];

        const resultados = {};

        // Traemos solo el último registro de cada lotería
        for (const loteria of loterias) {
            const [rows] = await conn.execute(`
                SELECT NUMERO, SERIE
                FROM wp9a_resultados
                WHERE LOTERIA = ?
                ORDER BY FECHA DESC
                LIMIT 1
            `, [loteria]);

            resultados[loteria] = rows[0] ? `${rows[0].NUMERO} ${rows[0].SERIE || '-'}` : '-';
        }

        await conn.end();

        // Armamos mensaje con "tabla" simulada y negrilla solo en loterías
        let mensaje = "📊 *RESULTADOS SORTEOS* 📊\n\n";
        mensaje += "*LOTERÍA* | *NÚMERO* | *SERIE/5TA*\n";
        mensaje += "-----------------------------\n";

        loterias.forEach(loteria => {
            mensaje += `*${loteria.toUpperCase()}* | ${resultados[loteria].split(' ')[0]} | ${resultados[loteria].split(' ')[1] || '-'}\n`;
        });
        

        return await flowDynamic(mensaje);

    } catch (error) {
        console.error("Error al consultar resultados:", error);
        return await flowDynamic("❌ Hubo un error al consultar los resultados.");
    }
})

// Ahora agregamos un addAnswer separado para la pregunta final
  .addAnswer(
    "¿Te puedo ayudar en algo más?\n\n1️⃣ Si: Resultados anteriores\n2️⃣ No: Gracias",
    { capture: true },
    async (ctx, { flowDynamic, gotoFlow, fallBack }) => {
      const r = ctx.body.trim().toLowerCase();
      
      if (r === '1' || r.includes('si')) {
        return gotoFlow(flowResultadosAnteriores);
      }
      
      if (r === '2' || r === 'no' || r.includes('gracias')) {
        return await flowDynamic("¡Gracias por consultar! 👋");
      }
      
      await flowDynamic("❌ No entendí. Por favor responde con `1` o `2`.");
      return fallBack();
    }
  );

const flowSecundario = addKeyword(['2', 'siguiente']).addAnswer(
    [
        "Te presento los horarios de atención en nuestros puntos de venta y oficina administrativa.",
        '\n📍 Punto de venta',
        'Visita cualquiera de nuestros puntos de venta en el departamento en este horario:',
        'Lunes a sábados de 7:00 a.m. a 9:50 p.m.',
        'Domingo y festivos de 7:00 a.m. a 8:00 p.m.',
        '\n🏢 Oficina Administrativa',
        'Visita nuestra oficina administrativa en este horario:',
        'Lunes a viernes de 8:00 a.m. a 12:00 p.m. y de 2:00 p.m. a 6:00 p.m.',
        'Sábados de 8:00 a.m. a 12:00 p.m.',
        '\n¿Te puedo ayudar en algo más?'
    ]
)

// Flujos principales
const flowEmail = addKeyword(['email'])
  .addAnswer('📩 ¿Cuál es tu email?', { capture: true }, async (ctx, { fallBack, flowDynamic, endFlow }) => {
    const email = ctx.body.trim()

    // Regex básica para validar emails
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailRegex.test(email)) {
      await flowDynamic("⚠️ Ese email no parece válido. Intenta de nuevo.")
      return fallBack() // vuelve a preguntar y NO sigue
    }

    console.log('✅ Email válido:', email)
    await flowDynamic("👌 Perfecto, recibimos tu email correctamente.")
    
    // Aquí sí mandas el siguiente mensaje solo si es válido
    await flowDynamic("En los siguientes minutos te envío un email.")
  })

let formData = {}; // guardamos todos los datos del usuario

const flowEnviarCorreo = addKeyword(['pqrs'])
  // Paso 1: Nombre
  .addAnswer(
    "¡Hola! 😊 ¿Cómo te llamas?",
    { capture: true },
    async (ctx, { flowDynamic, fallBack }) => {
      const nombre = ctx.body.trim();
      if (!nombre) {
        await flowDynamic("⚠️ No recibí tu nombre. Intenta de nuevo.");
        return fallBack();
      }
      formData.nombre = nombre;
      console.log('📌 Nombre recibido:', nombre);
      return await flowDynamic(`Encantado ${nombre}!`);
    }
  )
  // Paso 2: Apellido
  .addAnswer(
    "📌 Ingresa tu apellido:",
    { capture: true },
    async (ctx, { flowDynamic, fallBack }) => {
      const apellido = ctx.body.trim();
      if (!apellido) {
        await flowDynamic("⚠️ No recibí tu apellido. Intenta de nuevo.");
        return fallBack();
      }
      formData.apellido = apellido;
      console.log('📌 Apellido recibido:', apellido);

    }
  )
  // Paso 3: Tipo de documento
  .addAnswer(
    "Selecciona el tipo de documento de identidad:\n1️⃣ Cédula\n2️⃣ Cédula de extranjería\n3️⃣ Pasaporte\n4️⃣ Registro Civil",
    { capture: true },
    async (ctx, { flowDynamic, fallBack }) => {
      const tipo = ctx.body.trim().toLowerCase();
      const tiposValidos = {
        "1": "Cédula",
        "2": "Cédula de extranjería",
        "3": "Pasaporte",
        "4": "Registro Civil",
        "cédula": "Cédula",
        "cédula de extranjería": "Cédula de extranjería",
        "pasaporte": "Pasaporte",
        "registro civil": "Registro Civil"
      };

      if (!tiposValidos[tipo]) {
        await flowDynamic("⚠️ Selecciona una opción válida (1-4 o escribe el tipo).");
        return fallBack();
      }

      formData.tipoDocumento = tiposValidos[tipo];
      console.log('📌 Tipo de documento:', formData.tipoDocumento);
    }
  )
  // Paso 4: Número de identificación
  .addAnswer(
    "📌 Ingresa tu Número de identificación:",
    { capture: true },
    async (ctx, { flowDynamic, fallBack }) => {
      const numero = ctx.body.trim();
      if (!numero) {
        await flowDynamic("⚠️ No recibí tu número de identificación. Intenta de nuevo.");
        return fallBack();
      }
      formData.numeroIdentificacion = numero;
      console.log('📌 Número de identificación recibido:', numero);
    }
  )
  // Paso 5: Correo
  .addAnswer(
    "📧 Ingresa tu Correo electrónico:",
    { capture: true },
    async (ctx, { flowDynamic, fallBack }) => {
      const correo = ctx.body.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(correo)) {
        await flowDynamic("⚠️ Ese correo no es válido. Intenta de nuevo.");
        return fallBack();
      }
      formData.correo = correo;
      console.log('📌 Correo recibido:', correo);
    }
  )
  // Paso 6: Descripción
  .addAnswer(
    "✏️ Por último, descríbeme qué ocurrió o cuál es tu consulta:",
    { capture: true },
    async (ctx, { flowDynamic, endFlow, fallBack }) => {
      const descripcion = ctx.body.trim();
      if (!descripcion) {
        await flowDynamic("⚠️ No recibí la descripción. Intenta de nuevo.");
        return fallBack();
      }
      formData.descripcion = descripcion;
      console.log('📌 Descripción recibida:', descripcion);

      try {
        // Configuración de nodemailer para Outlook
        const transporter = nodemailer.createTransport({
          host: 'smtp.office365.com',
          port: 587,
          secure: false,
          auth: {
            user: process.env.OUTLOOK_USER,
            pass: process.env.OUTLOOK_PASS,
          },
        });

        // Configuración del correo
        const mailOptions = {
        from: process.env.OUTLOOK_USER, // tu correo remitente, sí viene del docker-compose
        to: formData.correo,               // correo que ingresó el usuario
        subject: 'Formulario enviado desde el chatbot',
        text: `Datos enviados:
        Nombre: ${formData.nombre}
        Apellido: ${formData.apellido}
        Tipo de documento: ${formData.tipoDocumento}
        Número: ${formData.numeroIdentificacion}
        Correo: ${formData.correo}
        Descripción: ${formData.descripcion}`
        };

        // Enviar correo
        await transporter.sendMail(mailOptions);
        console.log('✅ Correo enviado correctamente');

        await flowDynamic("✅ Gracias! Tu formulario ha sido enviado correctamente.");
        return endFlow();
      } catch (error) {
        console.error('❌ Error enviando correo:', error);
        await flowDynamic('❌ Ocurrió un error al enviar el correo. Intenta nuevamente.');
        return fallBack();
      }
    }
  );

const flowDocs = addKeyword(['doc', 'documentacion', 'documentación']).addAnswer(
    [
        '📄 Aquí encontras la documentación, recuerda que puedes mejorarla',
        'https://bot-whatsapp.netlify.app/',
        '\n*2* Para siguiente paso.',
    ],
    null,
    null,
    [flowSecundario]
)

const flowTuto = addKeyword(['tutorial', 'tuto']).addAnswer(
    [
        '🙌 Aquí encuentras un ejemplo rápido',
        'https://bot-whatsapp.netlify.app/docs/example/',
        '\n*2* Para siguiente paso.',
    ],
    null,
    null,
    [flowSecundario]
)

const flowGracias = addKeyword(['gracias', 'grac']).addAnswer(
    [
        '🚀 Puedes aportar tu granito de arena a este proyecto',
        '[*opencollective*] https://opencollective.com/bot-whatsapp',
        '[*buymeacoffee*] https://www.buymeacoffee.com/leifermendez',
        '[*patreon*] https://www.patreon.com/leifermendez',
        '\n*2* Para siguiente paso.',
    ],
    null,
    null,
    [flowSecundario]
)

const flowDiscord = addKeyword(['discord']).addAnswer(
    ['🤪 Únete al discord', 'https://link.codigoencasa.com/DISCORD', '\n*2* Para siguiente paso.'],
    null,
    null,
    [flowSecundario]
)

const flowPrincipal = addKeyword(['hola', 'ole', 'alo'])
    .addAnswer('🙌 Hola, bienvenido a este *Chatbot*')
    .addAnswer(
        '📌 *Menú principal:*\n\n' +
        '1. Resultados de chance y loterías\n' +
        '2. Horario de atención puntos de venta\n' +
        '3. Conocer productos y servicios\n' +
        '4. Tarifas de giros nacional e internacionales\n' +
        '5. Presentar una PQRS\n' +
        '6. Trabaja con nosotros\n' +
        '7. Otros',
        null,
        null,
        [flowDocs, flowGracias, flowTuto, flowDiscord, flowSecundario, flowResultados]
    )

const main = async () => {
    // Configuramos el adaptador de base de datos con tabla explícita
    const adapterDB = new PostgreSQLAdapter({
        host: POSTGRES_DB_HOST,
        user: POSTGRES_DB_USER,
        database: POSTGRES_DB_NAME,
        password: POSTGRES_DB_PASSWORD,
        port: POSTGRES_DB_PORT,
        tableName: 'whatsapp_state' // tabla donde se guarda el estado de cada usuario
    })

    const adapterFlow = createFlow([flowPrincipal, flowEmail, flowResultadosAnteriores, flowEnviarCorreo])
    const adapterProvider = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    // Portal web para visualizar QR y sesiones activas
    QRPortalWeb()
}

// Ejecutamos el bot
main()