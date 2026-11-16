exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method not allowed"
    };
  }

  try {
    const data = JSON.parse(event.body || "{}");

    const required = ["name", "phone", "loan", "income", "period", "payment"];

    for (const field of required) {
      if (!data[field]) {
        return {
          statusCode: 400,
          body: JSON.stringify({ message: "Please complete all fields." })
        };
      }
    }

    const response = await fetch(
      "https://jessica-magufuli-bot.onrender.com/new-application",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Webhook-Secret": process.env.WEBHOOK_SECRET
        },
        body: JSON.stringify(data)
      }
    );

    if (!response.ok) {
      throw new Error("Application forwarding failed");
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Application submitted for review."
      })
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Unable to submit application. Please try again later."
      })
    };
  }
};
