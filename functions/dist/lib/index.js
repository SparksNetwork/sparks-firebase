"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function httpContext(fn) {
    return (req, res) => {
        console.log(fn.name, req.body);
        return fn(req.body)
            .then(result => res.status(200).send(result))
            .catch(err => {
            console.error(fn.name, req.body, err);
            res.status(500).send(err);
        });
    };
}
exports.httpContext = httpContext;
function pubSubContext(fn) {
    return (event) => {
        console.log(fn.name, event.data.json);
        return fn(event.data.json);
    };
}
exports.pubSubContext = pubSubContext;
//# sourceMappingURL=index.js.map