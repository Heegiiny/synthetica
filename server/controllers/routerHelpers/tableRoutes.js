/**
 * Функция, определяющая пути, необходимы для страниц.
 * Выполняется для определённой модели.
 * Создаёт пути, необходимые для работы с нею как с типом страниц на сайте.
 *
 * Поддерживает вывод постраничного списка доступных документов,
 * вывод конкретного документа по числовому идентификатору,
 * создание документа по названию,
 * удаление документа по числовому идентификатору,
 * изменение названия документа по числовому идентификатору.
 *
 * Заносит выбранный документ в req.activeDoc для дальнейшей работы
 * или сразу возвращает 404, если запрос не предполагает удаление документа,
 * тогда возвращает 200, если документ не найден.
 */

const express = require("express");
const ac = require("../../config/ac");

function tableRoutes(Model) {
    /**
     * Основной метод при работе с хелпером.
     *
     * Возвращает роутер, создавая его, если он ещё не создан.
     */
    this.getRouter = () => {
        // Если роутер уже создан, то вернём его.
        if (this._router) return this._router;

        this._router = router = express.Router();

        /**
         * Роутер заносит выбранный документ в req.activeDoc,
         * так что другие функции могут его не искать.
         * Если документ найти не удалось, создаёт объект req.notFound,
         */
        router.param("id", this.setActiveDoc);

        // Сначала обрабатываем delete, поскольку от возвращает 200,
        // если документ не найдет
        router.delete("/:id", this.deleteDoc);

        // Если документ запрошен по id и не найден, то возвращаем 404
        router.use((req, res, next) =>
            req.notFound ? res.status(404).json(req.notFound) : next()
        );

        // обрабатываем остальные пути
        router.get("/", this.getDocList);
        router.get("/:id", this.getDoc);
        router.post("/", this.createDoc);
        router.post("/:id", this.updateDoc);

        return router;
    };

    this.bindUserToQuery = (query, user) => {
        query.user = user._id;
    };

    /**
     * Метод поиска выбранного документа.
     * Исполняется, если указан параметр id.
     * Заносит документ, найденный по id в req.activeDoc.
     */
    this.setActiveDoc = (req, res, next, id) => {
        Model.findOne({ _id: id })
            .exec()
            .then(doc => {
                if (!doc) {
                    req.notFound = {
                        level: Model.modelName,
                        message:
                            Model.modelName + " with id " + id + " not found"
                    };
                    return next();
                }

                console.log(
                    "req.activeDoc was set to " +
                        Model.modelName +
                        " with _id " +
                        doc._id +
                        " and id " +
                        doc.id
                );

                req.activeDoc = doc;
                next();
            })
            .catch(err => next(err));
    };

    // Возвращает постраничный список документов
    this.getDocList = (req, res, next) => {
        // Запрос для поиска. Первоначально берем из параметров адресной строки.
        const query = req.query;

        Object.keys(query).forEach(key => {
            if (Model.schema.paths[key] === undefined || query[key] == "") {
                return;
            }
            if (Model.schema.paths[key].instance === "String") {
                paginateQuery[key] = RegExp.fromString(query[key], "i");
            } else {
                paginateQuery[key] = query[key];
            }
        });

        /**
         * Проверяем может ли пользователь читать документы,
         * если может читать все, то не меняем поисковый запрос,
         * если только свои, то добавляем в него _id пользователя,
         * если не может совсем, то выдаём 403.
         */
        const canReadAny = ac.can(req.user.group).readAny(Model.modelName);
        if (!canReadAny.granted) {
            // Проверяем, может ли читать свои документы
            const canReadOwn = ac.can(req.user.group).readOwn(Model.modelName);
            if (!canReadOwn.granted) {
                res.status(403).json({
                    message: "Недостаточно прав доступа."
                });
                return;
            }

            // Если свои всё таки может, то добавляем его _id в поиск.
            this.bindUserToQuery(query, req.user);
        }

        console.log(query);

        Model.find(query)
            .exec()
            .then(docs => res.json({ docs: docs }))
            .catch(err => next(err));
    };

    // Возвращает активный документ в json-формате
    this.getDoc = (req, res) => res.json(req.activeDoc);

    // Удаляет документ или возвращает 200, если он не найден
    this.deleteDoc = (req, res, next) => {
        // Запрос для поиска. Первоначально берем из параметров адресной строки.
        const query = { _id: req.params.id };

        // Проверка прав, аналогичная чтению в this.getDocList
        const canDeleteAny = ac.can(req.user.group).deleteAny(Model.modelName);
        if (!canDeleteAny.granted) {
            // Проверяем, может ли удалять свои документы
            const canDeleteOwn = ac
                .can(req.user.group)
                .deleteOwn(Model.modelName);

            if (!canDeleteOwn.granted) {
                res.status(403).json({
                    message: "Недостаточно прав доступа."
                });
                return;
            }

            // Если свои всё таки может, то добавляем его _id в поиск.
            this.bindUserToQuery(query, req.user);
        }

        Model.findOne(query)
            .exec()
            .then(doc => (!doc ? Promise.resolve() : doc.remove()))
            .then(() => res.status(200).json({ success: true }))
            .catch(err => next(err));
    };

    this.updateDoc = (req, res, next) => {
        req.activeDoc.title = req.body.title;
        req.activeDoc
            .save()
            .then(doc => res.json(doc))
            .catch(err => next(err));
    };

    // Создание документа
    this.createDoc = (req, res, next) => {
        // Запрос для поиска. Первоначально берем из параметров адресной строки.
        const doc = { title: req.body.title };

        // Проверка прав, аналогичная чтению в this.getDocList
        const canCreateAny = ac.can(req.user.group).createAny(Model.modelName);
        if (!canCreateAny.granted) {
            // Проверяем, может ли создавать свои документы
            const canCreateOwn = ac
                .can(req.user.group)
                .createOwn(Model.modelName);

            if (!canCreateOwn.granted) {
                res.status(403).json({
                    message: "Недостаточно прав доступа."
                });
                return;
            }

            // Если свои всё таки может, то добавляем его _id в документ.
            this.bindUserToQuery(doc, req.user);
        }

        Model.create(doc)
            .then(result => res.json(result))
            .catch(err => next(err));
    };
}

// Экспортируемая функция, создаёт новый tableRoutes объект
// и проверяет, чтобы в аргументе была mongoose-модель
const createTableRoutes = Model => new tableRoutes(Model);

module.exports = createTableRoutes;
