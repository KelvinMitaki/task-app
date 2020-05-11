const { MongoClient, ObjectID } = require("mongodb");

const connectionURL = "mongodb://127.0.0.1:27017";
const databaseName = "taskApp";

MongoClient.connect(
  connectionURL,

  { useNewUrlParser: true, useUnifiedTopology: true },
  (error, client) => {
    if (error) {
      return console.log("Unable to connect to the database");
    }
    const db = client.db(databaseName);
    // db.collection("users").insertMany(
    //   [
    //     {
    //       name: "Kelvin Mitaki",
    //       age: 20,
    //     },
    //     {
    //       name: "brian",
    //       age: 22,
    //     },
    //     {
    //       name: "Wesley",
    //       age: 25,
    //     },
    //   ],
    //   (error, result) => {
    //     if (error) {
    //       return console.log("an error occured");
    //     }
    //     console.log(result.ops);
    //   }
    // );
    //     db.collection("Tasks").insertMany(
    //       [
    //         {
    //           description: "Start Mongo DB",
    //           completed: false,
    //         },
    //         {
    //           description: "Finish React Projects",
    //           completed: true,
    //         },
    //         {
    //           description: "Master JavaScript",
    //           completed: true,
    //         },
    //       ],
    //       (error, result) => {
    //         if (error) {
    //           return console.log("Something went wrong");
    //         }
    //         console.log(result.ops);
    //       }
    //     );
    // db.collection("Tasks").findOne({ completed: false }, (error, task) => {
    //   if (error) {
    //     return console.log("Something went wrong");
    //   }
    //   console.log(task);
    // });
    // db.collection("Tasks")
    //   .find({ completed: true })
    //   .toArray((error, tasks) => {
    //     if (error) {
    //       return console.log("Something went wrong");
    //     }

    //     console.log(tasks);
    //   });

    // db.collection("Tasks").updateOne(
    //   {
    //     _id: new ObjectID("5eb83b5177932e1864b78106"),
    //   },
    //   {
    //     $set: {
    //       completed: false,
    //     },
    //   }
    // );
    // db.collection("Tasks")
    //   .updateMany(
    //     {
    //       completed: false,
    //     },
    //     {
    //       $set: {
    //         completed: true,
    //       },
    //     }
    //   )
    //   .then((res) => {
    //     console.log(res);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
    db.collection("Tasks")
      .deleteOne({
        _id: new ObjectID("5eb83b5177932e1864b78104"),
      })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  }
);
