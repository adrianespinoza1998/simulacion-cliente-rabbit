const amqp = require("amqplib");

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
  const msgs = [
    {
      co2: 10,
      humidity: 10,
    },
    {
      co2: 11,
      humidity: 11,
    },
  ];
  try {
    const connection = await amqp.connect(rabbitSettings);
    console.log("Connected to RabbitMQ");

    const channel = await connection.createChannel();
    console.log("Channel created");

    await channel.assertQueue(queue);
    console.log("Queue created");

    for (let i = 0; i < msgs.length; i++) {
      channel.sendToQueue(queue, Buffer.from(JSON.stringify(msgs[i])));
      console.log(`Message sent ${msgs[i]}`);
    }
  } catch (error) {
    console.error(error);
  }
};

connect();
