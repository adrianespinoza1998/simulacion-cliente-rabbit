const amqp = require("amqplib");
const fs = require("fs");

const rabbitSettings = {
  protocol: "amqps",
  //   hostname: "18.206.203.148",
  hostname: "b-3c02432f-da26-4323-a177-265838c969f5.mq.us-east-1.amazonaws.com",
  port: 5671,
  username: "admin",
  password: "wtNES8Qa63gvHcXh8tBs",
  //   vhost: "/",
  //   authMechanism: ["PLAIN", "AMQPLAIN", "EXTERNAL"],
};

const connect = async () => {
  const queue = "prueba";
  try {
    const connection = await amqp.connect(rabbitSettings);
    console.log("Connected to RabbitMQ");

    const channel = await connection.createChannel();
    console.log("Channel created");

    await channel.assertQueue(queue);
    console.log("Queue created");

    console.log("Waiting for messages...");
    channel.consume(queue, (msg) => {
      try {
        const data = JSON.parse(msg.content.toString("utf-8"));
        console.log(JSON.stringify(data));
        const db = fs.readFileSync("db.json", "utf-8");

        const dbData = JSON.parse(db);

        dbData.metrics.push(data);

        fs.writeFileSync("db.json", JSON.stringify(dbData));
      } catch (error) {
        console.error(error);
      }
    });
  } catch (error) {
    console.error(error);
  }
};

connect();
