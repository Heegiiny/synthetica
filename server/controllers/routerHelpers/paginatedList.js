/**
 * Постраничный список с поиском.
 */

let paginatedList = function(Model, query, res, next, select) {
    if (select === undefined) select = "id title";

    console.log("GET paginated list for " + Model.modelName);

    let paginateQuery = {};

    if (query) {
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
    }

    if (Object.keys(paginateQuery).length) {
        console.log(
            Model.modelName + " search with: " + JSON.stringify(paginateQuery)
        );
    }

    let paginateOptions = {
        page: query.page ? query.page : 1,
        select: select,
        limit: 12
    };

    Model.paginate(paginateQuery, paginateOptions)
        .then(result => res.json(result))
        .catch(err => next(err));
};

module.exports = paginatedList;
