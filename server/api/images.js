const axios = require('axios');

const db = require('../db');
const { createLogger } = require('../logger');
const memcache = require('../memcache');

const logger = createLogger('API/IMAGES');

exports.get = async ({ params: { image } }, res) => {
  try {
    const downloadUrl = await memcache.get(
      image,
      async () => {
        const [id] = image.match(/([^.]*)/);
        const [{ url } = {}] = await db.select('SELECT url FROM entries WHERE id = $1', [id]);
        return url;
      },
      1,
      // 30 * 24 * 60 * 60, // 30 days -> seconds
    );
    if (!downloadUrl) {
      res.status(404).send();
      return;
    }

    const { data } = await axios.get(downloadUrl, { responseType: 'arraybuffer' });
    res.contentType(downloadUrl.includes('png') ? 'image/png' : 'image/jpeg');
    res.send(Buffer.from(data, 'binary'));
  } catch (err) {
    logger.error(`Error getting /i/${image}: ${err}`);
    res.status(500).send();
  }
};
