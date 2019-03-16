/**
 * Определяем пути для работы с документами без собственной модели,
 * например, договорами, платежами и т.д.
 *
 */

const express = require("express");

function subDocRoutes(subDocPath) {
    /**
     * Основной метод при работе с хелпером.
     *
     * Возвращает роутер, создавая его и определяя в нём пути
     * из данного объекта, если он ещё не создан.
     */
    this.getRouter = () => {
        // Если роутер уже создан, то вернём его.
        if (this._router) return this._router;

        this._router = router = express.Router();

        // Проверка req.activeDoc
        router.use(this.checkActiveDoc);

        // Определяем пути
        if (process.env.NODE_ENV === "dev") {
            // Первый путь только для разработки, для проверки работы req.activeDoc
            router.get("/", (req, res) => res.json(req.activeDoc[subDocPath]));
        }
        router.post("/", this.createSubDoc);
        router.post("/:sub_doc_id", this.updateSubDoc);
        router.delete("/:sub_doc_id", this.deleteSubDoc);

        return router;
    };

    // Проверяем, чтобы req.activeDoc был определён
    // и у него имелся массив из subDocPath
    this.checkActiveDoc = (req, res, next) => {
        if (req.activeDoc && Array.isArray(req.activeDoc[subDocPath])) {
            next();
        } else
            next(
                new Error(
                    "subDocRoutes requires req.activeDoc with req.activeDoc." +
                        subDocPath +
                        " array."
                )
            );
    };

    // Добавление нового документа в массив
    this.createSubDoc = (req, res, next) => {
        req.activeDoc[subDocPath].push(req.body);
        console.log(req.body);
        console.log(req.activeDoc[subDocPath]);
        req.activeDoc
            .save()
            .then(doc => res.json(doc))
            .catch(err => next(err));
    };

    // Редактирование документа по _id
    this.updateSubDoc = (req, res, next) => {
        req.activeDoc[subDocPath].id(req.params.sub_doc_id).set(req.body);

        req.activeDoc
            .save()
            .then(doc => res.json(doc))
            .catch(err => next(err));
    };

    // Удаление документа по _id
    this.deleteSubDoc = (req, res, next) => {
        const activeSubDoc = req.activeDoc[subDocPath].id(
            req.params.sub_doc_id
        );
        if (activeSubDoc) {
            activeSubDoc.remove();

            req.activeDoc
                .save()
                .then(doc => res.json(doc))
                .catch(err => next(err));
        } else {
            res.json(req.activeDoc);
        }
    };
}

// Экспортируемая функция, создаёт новый subDocRoutes объект.
const createSubDocRoutes = subDocPath => new subDocRoutes(subDocPath);

module.exports = createSubDocRoutes;
