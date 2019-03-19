const isOdd = num => num % 2 === 1;

function processPath(routerPath) {
    const pathArr = routerPath.split("/");
    let sliceEnd = isOdd(pathArr.length) ? pathArr.length - 1 : pathArr.length;

    if (pathArr[pathArr.length - 1] === "edit") {
        sliceEnd -= 2;
    }

    return pathArr.slice(1, sliceEnd).join("/");
}

export default processPath;
