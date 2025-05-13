require('dotenv').config();

const { Client, GatewayIntentBits } = require('discord.js');
const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc } = require('firebase/firestore');

// Configuración Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDGXKbfzzCEAR1D-VkFMqq46mqny6cq1RA",
  authDomain: "balatropi-dfe1e.firebaseapp.com",
  projectId: "balatropi-dfe1e",
  storageBucket: "balatropi-dfe1e.appspot.com",
  messagingSenderId: "497287266",
  appId: "1:497287266:web:9699cedb25724b8ae7513b",
  measurementId: "G-098W67SNZ2"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Crear el cliente de Discord
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
});

client.on('ready', () => {
  console.log(`🤖 Bot iniciado como ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  // Ignorar mensajes del bot o sin el comando
  if (!message.content.startsWith('!setfecha') || message.author.bot) return;

  const args = message.content.slice('!setfecha'.length).trim();

  if (!args) {
    await message.reply('⚠️ Por favor escribí una fecha. Ejemplo: `!setfecha 15 de julio`');
    return;
  }

  try {
    await setDoc(doc(db, 'config', 'fechaImportante'), { fecha: args });
    await message.reply(`✅ Fecha actualizada a: "${args}"`);
  } catch (err) {
    console.error('Error al guardar en Firebase:', err);
    await message.reply('❌ Hubo un error al actualizar la fecha en Firebase.');
  }
});

// Iniciar sesión con el token del bot
client.login(process.env.TOKEN);

