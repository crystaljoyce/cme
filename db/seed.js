const client = require('./client');
const { rebuild } = require('./seedData');

rebuidDB()

    .catch(console.error)
    .finally(() => client.end());
    