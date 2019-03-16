/**
 * Функция, определяющая пути для доступа к истории изменений.
 */

const express = require("express");

function historyRoutes() {
    /**
     * Основной метод при работе с хелпером.
     *
     * Возвращает роутер, создавая его, если он ещё не создан.
     */
    this.getRouter = () => {
        // Если роутер уже создан, то вернём его.
        if (this._router) return this._router;

        this._router = router = express.Router();

        router.get("/", this.getHistory);
    };

    // Получаем историю изменений
    this.getHistory = (req, res, next) => {
        //req.activeDoc.
    };
}

// Экспортируемая функция, создаёт новый historyRoutes объект.
const createHistoryRoutes = () => new historyRoutes();

module.exports = createHistoryRoutes;
