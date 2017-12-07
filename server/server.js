import express from 'express';
import bodyParser from 'body-parser';
import webPush from 'web-push';
import path from 'path';
import mongoose from 'mongoose';
import http from 'http';
import fs from 'fs';
import configure from './configure';
// 서버사이드 ajax를 위한 fetch
import 'isomorphic-fetch';

// api 라우트 로드
import api from './routes';

// 서버와 포트 초기화
const app = express();
const port = configure.PORT;

// 몽고디비 연결 설정
const db = mongoose.connection;
mongoose.connect(configure.MONGO_URL, {
  useMongoClient: true,
});

// Mongoose 모듈의 Promise 변경 - 모듈 권고사항 (deprecated)
mongoose.Promise = global.Promise;

// 몽고디비 연결
db.on('error', console.error);
db.once('open', () => {
  console.log(`[MONGO DB URL] : ${configure.MONGO_URL}`);
});

// POST 연결을 위한 설정
app.use(bodyParser.urlencoded({ extended: true, limit: '5mb' }));
app.use(bodyParser.json({ limit: '5mb' }));
app.enable('trust proxy');

// API 라우트
app.use('/api', api);

// 서버 시작
const httpApp = http.Server(app);
httpApp.listen(port, () => {
  console.log(`Server is listening on this port : ${port}`);
});
export default httpApp;


