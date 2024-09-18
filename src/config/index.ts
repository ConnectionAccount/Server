import { Configure } from "@goodtechsoft/xs-micro-service";

export const config = Configure<Variables, Config>(
  ({
    // REDIS_HOST, REDIS_PORT, PORT,
    MONGODB,
  }) => ({
    server: {
      name: "med-auth-service",
      port: 3000,
    },
    jwt: {
      apiSecret: "med-service.api",
    },
    // aws: {
    //   region: "ap-southeast-1",
    //   accessKeyId: "",
    //   secretAccessKey: "",
    //   bucket: "",
    //   smtp: {
    //     host: "",
    //     port: 465,
    //     secure: true,
    //     auth: {
    //       user: "",
    //       pass: "",
    //     },
    //   },
    // },
    redis: {
      // host: REDIS_HOST,
      // port: REDIS_PORT,
    },
    // kafka: KAFKA,
    mongodb: MONGODB,
  }),
  {
    development: {
      // PORT: parseInt(`${process.env.PORT}`),
      // REDIS_HOST: "172.16.101.14",
      // REDIS_PORT: 6379,
      // KAFKA: {
      //   kafkaHost: "172.16.101.13:9092",
      //   clientId: "med-auth-service-development",
      //   groupId: "med-auth-service-group-development",
      // },
      MONGODB: {
        url: "mongodb+srv://bookAPI:haha99481888@teamdata.ehkjb2p.mongodb.net/?retryWrites=true&w=majority",
      },
    },
    dev: {
      // PORT: parseInt(`${process.env.PORT}`),
      // REDIS_HOST: "192.168.2.54",
      // REDIS_PORT: 6379,
      // KAFKA: {
      //   kafkaHost: "192.168.2.54:9092",
      //   clientId: "med-auth-service",
      //   groupId: "med-auth-service-group",
      // },
      MONGODB: {
        url: "mongodb+srv://bookAPI:haha99481888@teamdata.ehkjb2p.mongodb.net/?retryWrites=true&w=majority",
      },
    },
  }
);

interface Config {
  server: {
    name: string;
    port: number;
  };
  // aws: {
  //   region: string;
  //   accessKeyId: string;
  //   secretAccessKey: string;
  //   bucket: string;
  //   smtp: {
  //     host: string;
  //     port: number;
  //     secure: boolean;
  //     auth: {
  //       user: string;
  //       pass: string;
  //     };
  //   };
  // };
  jwt: {
    apiSecret: string;
  };
  // redis: {
  //   host: string;
  //   port: number;
  // };
  // kafka: {
  //   kafkaHost: string;
  //   clientId: string;
  //   groupId: string;
  // };
  mongodb: {
    url: string;
  };
}

interface Variables {
  // PORT: number;
  // REDIS_HOST: string;
  // REDIS_PORT: number;
  // KAFKA: {
  //   kafkaHost: string;
  //   clientId: string;
  //   groupId: string;
  // };
  MONGODB: {
    url: string;
  };
}
