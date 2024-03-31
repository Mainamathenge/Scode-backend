const cron = require("node-cron");
const Customer = require("../models/customerModel");
const smsSender = require("./messageSender");

async function subscriptionStatus() {
  const date = new Date();
  const customers = await Customer.find({});
  console.log("getting into cronjob");

  function isLessThan10Minutes(customerTime) {
    const currentTime = new Date();
    const timeDifference =
      (customerTime.getTime() - currentTime.getTime()) / (1000 * 60);
    console.log("time difference", timeDifference);
    console.log("time check", timeDifference < 10);
    return timeDifference < 10;
  }

  // Check if customers array is empty
  if (customers.length === 0) {
    return 0;
  }
  //console.log(customers);

  customers.forEach(async (customer) => {
    const remainingTime = customer.deviceTime.getTime() - date.getTime();
    //This function sends an SMS to the customer if the customer is active and the time is less than 10 minutes
    console.log(
      `Customer  ${customer.fullName} with remaining time ${
        remainingTime / (1000 * 60)
      }`
    );
    if (
      customer.active &&
      isLessThan10Minutes(customer.deviceTime) &&
      customer.reminder
    ) {
      console.log("Customer is active and time is less than 10 minutes");
      await smsSender.sendSMS(
        `Dear ${customer.fullName},
          Your scode cooker will be deactivated in less than 10 minutes.😥
          Please top up your account to continue using our services.😀
          Thank you for your your countinued loyalty to Socode family✨.`,
        customer.phone
      );
      customer.reminder = false;
      await customer.save();
      console.log(
        `Customer ${customer.fullName} is active and time is less than 10 minutes and message has been sent`
      );
    }
    //This function sends an SMS to the customer if the customer is active and also deactivates their devices
    if (customer.deviceTime < date && customer.active) {
      customer.active = false;
      await smsSender.sendSMS(
        `Dear ${customer.fullName},
          Your device has been deactivated due to insufficient funds 
          please topup for reactivation.
          Thank you for your your countinued loyalty to Socode.`,
        customer.phone
      );
      await smsSender.sendSMS(
        `DeviceDeactivationActivation for ${customer.Device}`,
        customer.DeviceNumber
      );
      const remainingTime = customer.deviceTime.getTime() - date.getTime();
      console.log(
        `Customer time remaining for ${customer.fullName}", ${
          remainingTime / (1000 * 60)
        }`
      );
      try {
        await customer.save();
      } catch (error) {
        console.error(error);
      }
    }
  });
}

function startSubChecker() {
  cron.schedule("* * * * *", subscriptionStatus);
}

module.exports = startSubChecker;
