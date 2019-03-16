export default (updateFunction, prefix) => {
    class HandleChangeHelper {
        update = (name, value) => {
            const prefixedName = prefix ? prefix + "." + name : name;

            updateFunction(prefixedName, value);
        };
        onChange = event => {
            const target = event.target;
            const value =
                target.type === "checkbox" ? target.checked : target.value;
            const name = target.name;

            this.update(name, value);
        };
    }

    return new HandleChangeHelper();
};
