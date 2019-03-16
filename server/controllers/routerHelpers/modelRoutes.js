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

const mongoose = require("mongoose");
const express = require("express");
const paginatedList = require("./paginatedList");
const ac = require("../../config/ac");

function modelRoutes(Model) {
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

        // Сначала обрабатываем delete, поскольку он возвращает 200,
        // если документ не найдет
        router.delete("/:id(\\d+)", this.deleteDoc);

        // Если документ запрошен по id и не найден, то возвращаем 404
        router.use((req, res, next) =>
            req.notFound ? res.status(404).json(req.notFound) : next()
        );

        // обрабатываем остальные пути
        router.get("/", this.getDocList);
        router.get("/:id(\\d+)", this.getDoc);
        router.post("/", this.createDoc);
        router.post("/:id(\\d+)", this.updateDoc);

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
        Model.findOne({ id: id })
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

        /**
         * Проверяем может ли пользователь читать документы,
         * если может читать все, то не меняем поисковый запрос,
         * если только свои, то добавляем в него _id пользователя,
         * если не может совсем, то выдаём 403.
         */
        /*const canReadAny = ac.can(req.user.group).readAny(Model.modelName);
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
        }*/

        paginatedList(Model, req.query, res, next);
    };

    // Возвращает активный документ в json-формате
    this.getDoc = (req, res) => res.json(req.activeDoc);

    // Удаляет документ или возвращает 200, если он не найден
    this.deleteDoc = (req, res, next) => {
        // Запрос для поиска. Первоначально берем из параметров адресной строки.
        const query = { id: req.params.id };

        // Проверка прав, аналогичная чтению в this.getDocList
        /*const canDeleteAny = ac.can(req.user.group).deleteAny(Model.modelName);
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
        }*/

        Model.findOne(query)
            .exec()
            .then(doc => (!doc ? Promise.resolve() : doc.remove()))
            .then(() => res.status(200).json({ success: true }))
            .catch(err => next(err));
    };

    this.updateDoc = (req, res, next) => {
        req.activeDoc.set(req.body);

        req.activeDoc
            .save()
            .then(doc => res.json(doc))
            .catch(err => next(err));
    };

    // Создание документа
    this.createDoc = (req, res, next) => {
        //return res.json(Model.schema);

        const virtuals = Model.schema.virtuals;

        const getVirtualModel = key =>
            mongoose.model(virtuals[key].options.ref);

        const getVirtualForeignField = key =>
            virtuals[key].options.foreignField;

        const checkVirtualKey = key =>
            req.body[key] &&
            virtuals[key] &&
            virtuals[key].options &&
            virtuals[key].options.ref &&
            virtuals[key].options.localField === "_id" &&
            virtuals[key].options.foreignField &&
            getVirtualModel(key);

        const virtualsKeys = Object.keys(virtuals).filter(checkVirtualKey);

        // Запрос для поиска. Первоначально берем из параметров адресной строки.
        const doc = req.body;

        Model.create(doc)
            .then(createdDoc => {
                const createDocsForVirtuals = key =>
                    getVirtualModel(key).create(
                        req.body[key].map(virtualDoc => ({
                            ...virtualDoc,
                            [getVirtualForeignField(key)]: createdDoc._id
                        }))
                    );

                return Promise.all([
                    createdDoc,
                    ...virtualsKeys.map(createDocsForVirtuals)
                ]);
            })
            .then(([createdDoc]) => {
                virtualsKeys.forEach(key => {
                    createdDoc = createdDoc.populate(key);
                });
                return createdDoc.execPopulate();
            })
            .then(createdDoc => res.json(createdDoc))
            .catch(err => next(err));
    };
}

// Экспортируемая функция, создаёт новый modelRoutes объект
// и проверяет, чтобы в аргументе была mongoose-модель
const createModelRoutes = Model => new modelRoutes(Model);

module.exports = createModelRoutes;
