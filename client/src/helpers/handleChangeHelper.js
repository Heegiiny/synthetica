export default (updateFunction, prefix) => {
    class HandleChangeHelper {
        update = (name, value) => {
            const prefixedName = prefix ? prefix + "." + name : name;

            updateFunction(prefixedName, value);
        };
        onChange = event => {
            const target = event.target;
            let value;
            if (target.type === "checkbox") {
                value = target.checked;
            } else if (target.type === "radio") {
                if (target.value === "true" || target.value === true) {
                    value = true;
                } else if (target.value === "false" || target.value === false) {
                    value = false;
                } else {
                    value = target.value;
                }
            } else {
                value = target.value;
            }
            const name = target.name;

            this.update(name, value);
        };
    }

    return new HandleChangeHelper();
};
