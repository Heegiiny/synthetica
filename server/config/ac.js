/**
 * Описание прав доступа
 */

const AccessControl = require("accesscontrol");

const ac = new AccessControl({
    client: {
        Synthesis: {
            "create:own": ["*"],
            "read:own": ["*"],
            "update:own": ["*"],
            "delete:own": ["*"]
        }
    },
    manager: {
        Synthesis: {
            "create:any": ["*"],
            "read:any": ["*"],
            "update:any": ["*"],
            "delete:any": ["*"]
        }
    }
});

ac.grant("admin").extend("manager");

module.exports = ac;
