import express from 'express';

let configViewEngine = app => {
    app.use(express.static("./src/public"));
    app.use(express.static("./src/views"));
    app.set("view engine", "ejs");
    app.set("views", "./src/views");
};

module.exports = configViewEngine;