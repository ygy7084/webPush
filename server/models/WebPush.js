import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const WebPush = new Schema({
  endPoint: String,
  pushStatus: Number,
  keys: {
    key: String,
    authSecret: String,
  },
  message: String,
});
const model = mongoose.model('webPush', WebPush);
export default model;
