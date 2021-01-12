/* eslint-disable no-console */
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const path = require('path');

const express = require('express');
const helmet = require('helmet');
const shuffle = require('lodash/shuffle');
const memjs = require('memjs');

const db = require('./db');
const reddit = require('./reddit');

const isDev = process.env.NODE_ENV !== 'production';
const PORT = process.env.PORT || 5000;

const mc = memjs.Client.create(process.env.MEMCACHIER_SERVERS, {
  failover: true,
  timeout: 1,
  keepAlive: true,
  username: process.env.MEMCACHIER_USERNAME,
  password: process.env.MEMCACHIER_PASSWORD,
});

// Multi-process to utilize all CPU cores.
if (!isDev && cluster.isMaster) {
  console.error(`Node cluster master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i += 1) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.error(
      `Node cluster worker ${worker.process.pid} exited: code ${code}, signal ${signal}`,
    );
  });
} else {
  const app = express();

  const defaultDirectives = helmet.contentSecurityPolicy.getDefaultDirectives();
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          ...defaultDirectives,
          'img-src': [...defaultDirectives['img-src'], '*.imgur.com'],
        },
      },
    }),
  );

  // Priority serve any static files.
  app.use(express.static(path.resolve(__dirname, '../react-ui/build')));

  const router = express.Router();

  router.use(express.json());

  router.route('/contests').get(async (req, res) => {
    try {
      const result = await db.select('SELECT * FROM contests ORDER BY date DESC');
      res.send(
        result.rows.map((row) => ({
          ...row,
          date: row.date.toJSON().substr(0, 10),
        })),
      );
    } catch (err) {
      console.error(err.toString());
      res.status(500).send();
    }
  });

  router.route('/contests/:id').get(async ({ params: { id } }, res) => {
    try {
      const memcacheKey = `contest.${id}`;
      mc.get(memcacheKey, async (err, val) => {
        let contestObj;
        if (!err && val) {
          contestObj = JSON.parse(val);
        } else {
          const contestResult = await db.select('SELECT name FROM contests WHERE id = $1', [id]);
          if (!contestResult.rowCount) {
            res.status(404).send();
            return;
          }
          const entries = await reddit.getEntries(id);
          contestObj = {
            name: contestResult.rows[0].name,
            entries,
          };
          mc.set(memcacheKey, JSON.stringify(contestObj), {});
        }
        const isContestMode = await reddit.isContestMode(id);
        if (isContestMode) {
          contestObj.entries = shuffle(contestObj.entries);
        }
        res.send(contestObj);
      });
    } catch (err) {
      console.error(err.toString());
      res.status(500).send();
    }
  });

  app.use('/api', router);

  // All remaining requests return the React app, so it can handle routing.
  app.get('*', (request, response) => {
    response.sendFile(path.resolve(__dirname, '../react-ui/build', 'index.html'));
  });

  app.listen(PORT, () => {
    console.error(
      `Node ${isDev ? 'dev server' : `cluster worker ${process.pid}`}: listening on port ${PORT}`,
    );
  });
}
