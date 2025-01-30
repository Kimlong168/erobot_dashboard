import axios from "axios";

const sendTelegramMessage = async (data, topic_id) => {
  const botToken = import.meta.env.VITE_BOT_TOKEN;
  const chatId = import.meta.env.VITE_CHAT_ID;
  const url = `https://api.telegram.org/bot${botToken}/sendPhoto`;

  try {
    // // caption for the image to send to telegram
    const messageToSend = `*🆕 New Articles Posted!*
    
*📝 Title:* ${data.title}

*📖 Summary:* ${data.description}

*📅 Publish Date:* ${new Date().toLocaleString()}

*👉 Read now:* [Click here](${import.meta.env.VITE_CLIENT_BASE_URL}/articles/${
      data.id
    })
`;

    const form = new FormData();
    form.append("chat_id", chatId);
    // url of image to send

    form.append("photo", data.image);

    // caption for the image
    form.append("caption", messageToSend);
    form.append("parse_mode", "Markdown");

    if (topic_id) {
      form.append("message_thread_id", topic_id);
    }

    await axios.post(url, form, {
      headers: {
        "Content-Type": `multipart/form-data; boundary=${form._boundary}`,
      },
    });
  } catch (error) {
    console.error("Error sending image:", error);
  }
};

export { sendTelegramMessage };
