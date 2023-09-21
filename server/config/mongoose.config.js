const mongoose = require("mongoose");
const databaseName = "Project_Database";
mongoose.connect(`mongodb://127.0.0.1:27017/${databaseName}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log(`${databaseName} is currently in use.`))
.catch((err) => console.log(err));
