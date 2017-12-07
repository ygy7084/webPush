import express from 'express';
import web_push from 'web-push';
import {
  WebPush,
} from '../models'

const router = express.Router();

web_push.setGCMAPIKey('AIzaSyAFs9QXNkl6GYUK88GNHVDPYd0-idtPm9E');
const pushsample = {
  endPoint : "https://android.googleapis.com/gcm/send/fMNURetU0uE:APA91bFkbLRqe_g1Y_Ge2IxUFCoe3lAvLtbcF999YxX54SoYybrKbW-W4OZnvXmOSbagoBGYX-bwTgVAsTMXY-mM5p1qkJ6pUx1VSM2gIy0Kp8d1hj70JP4gbjReulLRHxaaRRkuwDvW",
  pushStatus : 0,
  keys : {
    key : "BA0LdqYyJkx6miCm7OXpt70yiH9CJoZ8wupUCPpd1i/LBhQqWZyY/YWBY7XcrqpViB/fZP6EDPuI9LwuzxpyYkg=",
    authSecret : "JN2Jw4xC+n7oJvotfnJWKA=="
  },

  message: "check",
};
router.get('/testGet', (req, res) => {
  const endPoint = pushsample.endPoint;
  const keys = pushsample.keys;
  const message = pushsample.message;
  const pushStatus = pushsample.pushStatus;

  const push = new WebPush({
    endPoint: endPoint,
    keys: keys,
    message: message,
    pushStatus: pushStatus,
  });
  push.save((err, result) => {
    if (err) {
      return res.status(500).json({
        message: '에러',
        error: err,
      });
    }
    return web_push.sendNotification({
      endpoint: endPoint,
      TTL: 0,
      keys: {
        auth: keys.authSecret,
        p256dh: keys.key,
      },
    }, JSON.stringify({
      message: message
    }))
      .then(() => {
        WebPush.findOneAndUpdate(
          {_id: result.id},
          { $set: {"pushStatus" : 1}},
          (err) => {
            if(err) {
              return res.status(500).json({message: 'push 수정오류'});
            }
          }
        );
        return res.json({ data: 'success'});
      })
      .catch((error) => {
        WebPush.findOneAndUpdate(
          {_id: result.id},
          { $set: {"pushStatus" : 3}},
          (err) => {
            if(err) {
              return res.status(500).json({message: 'push 수정오류'});
            }
          }
        );
        console.log(error);
        return res.json({ data: 'failed' });
      });
  });
});
router.post('/', (req, res) => {
  const endPoint = req.body.data.endPoint;
  const keys = req.body.data.keys;
  const message = req.body.data.message;
  const pushStatus = req.body.data.pushStatus;

  const push = new WebPush({
    endPoint: endPoint,
    keys: keys,
    message: message,
    pushStatus: pushStatus,
  });
  push.save((err, result) => {
    if (err) {
      return res.status(500).json({
        message: '에러',
        error: err,
      });
    }
    return web_push.sendNotification({
      endpoint: endPoint,
      TTL: 0,
      keys: {
        auth: keys.authSecret,
        p256dh: keys.key,
      },
    }, JSON.stringify({
      message: message
    }))
      .then(() => {
        WebPush.findOneAndUpdate(
          {_id: result.id},
          { $set: {"pushStatus" : 1}},
          (err) => {
            if(err) {
              return res.status(500).json({message: 'push 수정오류'});
            }
          }
        );
        return res.json({ data: true });
      })
      .catch((error) => {
        WebPush.findOneAndUpdate(
          {_id: result.id},
          { $set: {"pushStatus" : 3}},
          (err) => {
            if(err) {
              return res.status(500).json({message: 'push 수정오류'});
            }
          }
        );
        console.log(error);
        return res.json({ data: true });
      });
  });
});

router.get('/:_id', (req, res) => {
  WebPush.findOneAndUpdate(
    {_id: req.params._id},
    { $set: {"pushStatus" : 2}},
    (err) => {
      if(err) {
        return res.status(500).json({message: 'push 수정오류'});
      }
    }
  );
  return res.json({ data: true });
});

export default router;