const db = require('../db');
const { getCurrentContestSubmissions } = require('../db/queries');
const { createLogger } = require('../logger');

const { TITLE = 'Vexillology Contests', WEB_APP_CLIENT_ID } = process.env;

const logger = createLogger('API/INIT');

exports.get = async ({ moderator }, res) => {
  try {
    const experimentsData = await db.select('SELECT * FROM experiments');
    const experiments = experimentsData.reduce((acc, { active, name }) => {
      acc[name] = active;
      return acc;
    }, {});

    let submissionsToReview = 0;
    if (moderator) {
      const submissions = await getCurrentContestSubmissions();
      submissionsToReview = submissions.filter(
        ({ submissionStatus }) => submissionStatus === 'pending',
      ).length;
    }

    res.send({
      experiments,
      moderator,
      submissionsToReview,
      title: TITLE,
      webAppClientId: WEB_APP_CLIENT_ID,
    });
  } catch (err) {
    logger.error(`Error getting /init: ${err}`);
    res.status(500).send();
  }
};
