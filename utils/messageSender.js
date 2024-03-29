const credentials = {
  apiKey: "b9d89d004094e784d133911f03f435145174aac5dee6b083556f4cc50dd3e950",
  username: "Scode_1",
};

const AfricasTalking = require("africastalking")(credentials);
const sms = AfricasTalking.SMS;

const sendSMS = async (message, phone) => {
  try {
    const options = {
      to: phone,
      message,
    };
    const response = await sms
      .send(options)
      .then((response1) => {
        console.log(response1);
      })
      .catch((error) => {
        console.log(error);
      });
    return response;
  } catch (error) {
    return error;
  }
};

exports.sendSMS = sendSMS;
