const cron = require("node-cron");
const Customer = require("../models/customerModel");

async function subscriptionStatus() {
  const date = new Date();
  const customers = await Customer.find({});
  console.log("getting into cronjob", customers);

  // Check if customers array is empty
  if (customers.length === 0) {
    return 0;
  }
  // console.log(customers);

  customers.forEach(async (customer) => {
    //   console.log(customer);
    if (customer.deviceTime < date) {
      customer.active = false;
      console.log("Customer time remaining ", date - customer.deviceTime);
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
