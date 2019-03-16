/**
 * Точка входа в приложение.
 */

const express = require("express");
const passport = require("passport");
const fileUpload = require("express-fileupload");
const contextService = require("request-context");
const bodyParser = require("body-parser");

// Загружаем полифилы
require("./config/polyfill");

const API_PORT = 3001; // Порт

// Подключаемся к БД
require("mongoose").connect("mongodb://localhost/synthetica", {
    useNewUrlParser: true
});

// Инициализируем приложение
const app = express();
//app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Passport middleware
app.use(passport.initialize());

// Passport Config
require("./config/auth")(passport);

// wrap requests in the 'request' namespace
app.use(contextService.middleware("request"));

// Загрузка файлов
app.use(
    "/api/upload_media",
    fileUpload({
        useTempFiles: true,
        tempFileDir: "./tmp/"
    }),
    function(req, res, next) {
        if (
            !req.files ||
            Object.keys(req.files).length == 0 ||
            !req.files.file
        ) {
            return res
                .status(400)
                .json({ errors: { file: "No files were uploaded." } });
        }

        const file = req.files.file;

        const ext = file.name.split(".").pop();

        const newFileName = file.md5() + "." + ext;

        file.mv("./media/" + newFileName, function(err) {
            if (err) {
                return res.status(500).json({ errors: { file: err } });
            }
            res.json({
                success: true,
                media_id: newFileName
            });
        });
    }
);

app.use("/media", express.static("media"));

// Подключаем роутер
app.use("/api", require("./config/routes"));

// Вывод ошибок в виде статуса и json
app.use(require("./middlewares/errorHandler"));

app.listen(API_PORT);
console.log("Running at Port " + API_PORT);
