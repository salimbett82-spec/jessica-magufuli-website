const { randomUUID } = require("crypto");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({
        message: "Method not allowed"
      })
    };
  }

  try {
    const data = JSON.parse(event.body || "{}");

    const application = {
      application_id: randomUUID(),
      full_name: data.name,
      phone: data.phone,
      amount_tsh: Number(data.loan),
      term_months: Number.parseInt(data.period, 10),
      monthly_income_tsh: Number(data.income || 0)
    };

    if (
      !application.full_name ||
      !application.phone ||
      !Number.isFinite(application.amount_tsh) ||
      application.amount_tsh <= 0 ||
      !Number.isInteger(application.term_months) ||
      application.term_months <= 0
    ) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "Please enter valid application details."
        })
      };
    }

    const response = await fetch(
      "https://jessica-magufuli-bot.onrender.com/new-application",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Webhook-Secret": process.env.WEBHOOK_SECRET
        },
        body: JSON.stringify(application)
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Application submitted for review."
      })
    };

  } catch (error) {
    console.error("Application error:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Unable to submit application. Please try again later."
      })
    };
  }
};
