const credentials = {
  apiKey: process.env.SMS_API,
  username: process.env.SMS_USERNAME,
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
