const User = require("./models/user");
const Task = require("./models/task");
require("./db/mongoose");

const updateUser = async (id, age) => {
  try {
    await User.findByIdAndUpdate(id, { age });
    const count = await User.countDocuments({ age });
    console.log(count);
  } catch (error) {
    console.log(error);
  }
};
updateUser("5eb94b004b100d0950b3f8e7", 22);

const deleteTask = async (id) => {
  try {
    await Task.findByIdAndDelete(id);
    const count = await Task.countDocuments({ completed: false });
    console.log(count);
  } catch (error) {
    console.log(error);
  }
};

deleteTask("5eb94e5020590119740a3e1c");
