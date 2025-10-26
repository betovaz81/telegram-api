import dotenv from 'dotenv';
import AgentesRepository from './repository/agentes.respository.js';
import TelegramBot from 'node-telegram-bot-api';
//const TelegramBot = require('node-telegram-bot-api');

// replace the value below with the Telegram token you receive from @BotFather
dotenv.config()
const token=process.env.TELEGRAM_TOKEN || ""


// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});
const conversationState = new Map();
const agentData = new Map();

console.log(conversationState)

// Matches "/echo [whatever]"
bot.onText(/\/echo (.+)/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  const chatId = msg.chat.id;
  const resp = match[1]; // the captured "whatever"
  console.log("recibo el :",match)
  console.log("msg :",msg)
  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId, resp);
});

bot.onText(/\/agente add (.+?) (.+)/,async (msg,match)=>{
  
  const chatId = msg.chat.id;
  const usuario = match[1]; // Primer grupo de captura
  const nombreCompleto = match[2]; // Segundo grupo de captura
  conversationState.delete(chatId);
  agentData.delete(chatId);

  console.log(`Usuario: ${usuario}`);
  console.log(`Nombre Completo: ${nombreCompleto}`);

  bot.sendMessage(chatId, 'Esperando a que agregue al agente)');
  const respuesta = await AgentesRepository.addAgente(usuario,nombreCompleto);
    if(respuesta.status == 'ok'){
      console.log(respuesta)
      bot.sendMessage(chatId,"agregado:"+ JSON.stringify(respuesta));
    }else{
      throw new Error(`Error al obtener informacion de los agente`);
    }                    

})

bot.onText(/\/agente/,(msg,match)=>{
  
  const resp = match[1];
  const chatId = msg.chat.id;
  const command = msg.text.trim().toLowerCase();
  console.log(command," extra comando:", resp)
  conversationState.set(chatId, 'esperando_accion');
  bot.sendMessage(chatId, '¿Qué acción deseas realizar? (add, remove, list, show)');

})

// Listen for any kind of message. There are different kinds of
// messages.
 bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const step = conversationState.get(chatId)
  const userMessage = msg.text.trim().toLowerCase();

  console.log("Estatus de la conversacion:",step)
  if( step !== undefined ){
    switch (step) {
          case 'esperando_accion':
              console.log("userMessage: ",userMessage)
              if (['add', 'remove', 'list', 'show'].includes(userMessage)) {
                  agentData.set(chatId, { accion: userMessage });
                  
                  //validacion para siguiente pasos:
                  switch(userMessage){
                    case 'list':
                      console.log("Obtenemos informacion del endpoint y terminamos:")
                    
                      const agentes = await AgentesRepository.getAgentes();
                      if(agentes.status =='ok'){
                        console.log(agentes.all)
                        bot.sendMessage(chatId, JSON.stringify(agentes.all));
                        }else{
                        throw new Error(`Error al obtener informacion de los agentes`);
                        }                    
                      conversationState.set(chatId, 'termina');
                    break;
                    case 'show':
                      bot.sendMessage(chatId, '¿usuario?');
                      conversationState.set(chatId, 'esperando_nombre');
                    break;
                    case 'add':
                      bot.sendMessage(chatId, '¿De qué país? (mx, hn, sv)');
                      conversationState.set(chatId, 'esperando_pais');
                    break;
                    case 'remove':
                      bot.sendMessage(chatId, '¿De qué país? (mx, hn, sv)');
                      conversationState.set(chatId, 'esperando_pais');
                    break;
                  }

              } else {
                  bot.sendMessage(chatId, 'Acción no válida. Por favor, elige entre add, remove, list o show.');
              }
              break;
          
          case 'esperando_pais':
            if (['mx', 'hn', 'sv'].includes(userMessage)) {
                const data = agentData.get(chatId);
                data.pais = userMessage;
                agentData.set(chatId, data);
                conversationState.set(chatId, 'esperando_nombre');
                bot.sendMessage(chatId, 'Dime el nombre del agente:');
            } else {
                bot.sendMessage(chatId, 'País no válido. Por favor, elige entre mx, hn o sv.');
            }
            break;

          case 'esperando_nombre':
              const data = agentData.get(chatId);
              agentData.set(chatId, data);

              if(userMessage !="" && data.accion == "show"){
                const respuesta = await AgentesRepository.showAgente(userMessage);
                if(agentes.status == 'ok'){
                  console.log(respuesta)
                  bot.sendMessage(chatId, respuesta);
                  }else{
                  throw new Error(`Error al obtener informacion de los agente`);
                  }                    
                //conversationState.set(chatId, 'termina');
              }

              if(userMessage !="" && data.accion == "add"){
                // Resumen y finalización de la conversación              
                bot.sendMessage(chatId, `¡Gracias! procesare tu solicitud`);
                // Aquí puedes enviar la petición a tu API con los datos
                console.log('Datos procesados:', agentData.get(chatId));
                // Limpiar los datos y el estado del usuario
                conversationState.delete(chatId);
                agentData.delete(chatId);
              }

              break;
          
          case 'termina':
          bot.sendMessage(chatId, 'Deseas otra cosa:');
          conversationState.set(chatId, undefined);

          default:
            bot.sendMessage(chatId, 'Received your message');
      }
  }else{
    bot.sendMessage(chatId, '...');
  }


});
