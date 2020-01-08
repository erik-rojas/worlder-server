const {
    testChat,
} = require("./namespaces")



const _socket = (io) => {
    testChat(io.of("/test-chat"));
    // Main socket app
}


module.exports = _socket;