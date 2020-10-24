# IP Rate limiter
> 實作一 IP rate limiter機制之express server


## Requirements
  -  限制每分鐘來自同一個 IP 的請求數量不得超過 60
  - 在首頁顯示目前的request量，超過限制的話則顯示 “Error”,例如在一分鐘內第 30 個 request 則顯示 30,第 61 個request 則顯示 Error


## Quick Start

### Install

```
$ npm install
```

### Configure
```
# setup env variable (redis info & rate limit info)
$ vim .env
PORT=3000
REDIS_HOST="127.0.0.1"
REDIS_PORT=6379
REDIS_OWD=""

RATE_LIMITER_WINDOW_SEC=60
RATE_LIMITER_COUNT=60
```

### Run Server
```
$ npm start
```

### Run Test
```
$ npm test
```

### Basic Usage
```
const result = require('dotenv').config();
const Express = require('express');
const BodyParser = require('body-parser');
const CookieParser = require('cookie-parser');
const rateLimiter = require('./middleware/rateLimiter');
const indexRouter = require('./route/index');
const apiRouter = require('./route/api');

const app = Express();
app.use(BodyParser.urlencoded({ extended: true }));
app.use(BodyParser.json());
app.use(CookieParser());

app.use('/', indexRouter);
app.use('/api', rateLimiter); // limit only /api/* url
app.use('/api', apiRouter);
```
刻意只讓`/api`相關route會做rate middleware的驗證。保留自行選擇哪些route需rate limit的彈性。

### Application Structure
- `app.js` - 程式進入點，定義了express & route相關設定，同時設定rate limiter當express middleware
- `config/` - 相關service config
- `route/` - 各個Route檔放置處，目前只分首頁的 `/` & `/api` 開頭兩種route
- `service/` - 放置各類service，目前只有redis client
- `middleware/` - 放置各類express middleware，目前只有rate limiter此middleware
- `test/` - 測試檔放置處，使用mocha來測試。
- `util` - 相關util function
