require('dotenv').config();

const express = require('express');
const apiRouter = express.Router();
const server = express();
const jwt = require('jsonwebtoken');

const {JWT_SECRET = 'nevertell',
  STRIPE_SECRET
} = process.env;

apiRouter.use(async (req, res, next) => {
  const prefix = 'Bearer ';
  const auth = req.header('Authorization');

  if (!auth) {
    next();
  } else if (auth.startsWith(prefix)) {
    const token = auth.slice(prefix.length);

    try {
      const {id} = jwt.verify(token, JWT_SECRET);

      if (id) {
        req.user = await getUserById(id);
        next();
      }

    } catch (error) {
      next(error);
    }
  } else {
    next({message: `Authorization token must start with ${prefix}`})
  }
})

apiRouter.use((req,res,next) => {
  if (req.user) {
    console.log("User is set: ", req.user);
  }

  next();
});


server.use((req, res, next) => {
  res.status(404).send({message: 'Not Found'});
});

server.use((error, req, res, next) => {
  if (res.StatusCode < 400) {
    res.status(500);
  }
  res.send(error);
});

module.exports = apiRouter;
