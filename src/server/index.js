const express = require('express');
const app = express();
const index = require('http').Server(app);
const io = require('socket.io')(index);

const chat = require('./chat')(io);
const game = require('./game')(io);

if (process.env.NODE_ENV === 'development') {
    const webpack = require('webpack');
    const middleware = require('webpack-dev-middleware');
    const config = require('../../webpack.development.config');
    const compiler = webpack(config);
    app.use(
        middleware(compiler, {
            publicPath: config.output.publicPath,
        })
    );
    app.use(express.static('./static'));
} else {
    app.use(express.static('./dist'));
}

const port = process.env.PORT || 3000;
index.listen(port, () => console.log(`Example app listening on port ${port}!`));
