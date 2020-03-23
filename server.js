const express = require('express');
const app = express();
const webpack = require('webpack');
const middleware = require('webpack-dev-middleware');
const config = require('./webpack.config');
const compiler = webpack(config);

app.use(
    middleware(compiler, {
        publicPath: config.output.publicPath,
    })
);

app.use(express.static('./static'));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
