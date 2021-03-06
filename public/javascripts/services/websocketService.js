angular.module('mastermindApp')

.service('WebsocketService', function($http) {
    var wsproto = 'ws://';
    if (window.location.protocol == 'https:') {
        wsproto = 'wss://';
    }
    var socketUrl = wsproto + location.host + '/connectWebSocket';
    var ws;

    return {
        connect: function(onMessageFn) {
            if (!onMessageFn) {
                throw new Error('no onMessageFn given');
            } else if (typeof onMessageFn !== "function") {
                throw new Error('onMessageFn needs to be a function');
            }
            ws = new WebSocket(socketUrl);
            ws.onmessage = onMessageFn;
            return ws;
        },
        send: function(msg) {
            ws.send(msg);
        }
    };
});