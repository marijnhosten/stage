
/** @namespace */
var x2o = x2o || {};

if (!window.hasOwnProperty('$')) console.log('[X2O Epoxy] Epoxy requires jQuery to be included before it can be used.');
if (!window.hasOwnProperty('io')) console.log("[X2O Epoxy] Epoxy cannot function without socket.io.js being included!");





(function (x2o, window) {
    var STATE = {
            CONNECTING: 0,
            ESTABLISHED: 1,
            REGISTERED: 2,
            DISCONNECTING: 3,
            DISCONNECTED: 4
        },

        /**
         * Notification sources other than Epoxy cartridges.
         * @memberOf x2o.Epoxy
         * @readonly
         * @enum {string}
         */
        SOURCE = {
            /** Incoming payload is from another client connected to Epoxy server. */
            PEER_TO_PEER: ''
        },
        X2O_PEER_TO_PEER_MSG = '____X2O___PEER_TO_PEER__MSG___';

    /**
     * @memberOf x2o
     * @class
     * @constructor
     * @classdesc
     *
     * This object implements the raw client-side interface to the Epoxy server. It is used to
     * maintain the connection to the server, send messages to cartridges running in an epoxy
     * instance and register for cartridge/peer events.
     *
     * Although this client can be freely created, there is a limit to the number of concurrent
     * connections that can be opened by any given channel, so for convenience the X2O Runtime API
     * provides automagically an instance of an Epoxy connection for every channel via
     * x2o.api.epoxy.get().
     *
     * The epoxy client can either send messages to other connected clients directly, or to a
     * cartridge hosted via the Epoxy server, using either {@link x2o.Epoxy#sendTo} or
     * {@link x2o.Epoxy#sendCommand}, respectively. Messages are received on registered
     * event handlers implementing the {@link x2o.Epoxy.EventInterface Epoxy Events Interface}.
     *
     * ITEMS OF INTEREST:
     * - Epoxy uses websockets; it also implements a heartbeat mechanism to reliably
     *   detect communication loss with clients. The delay between heartbeats is 25 seconds,
     *   and a connection must transmit at least a heartbeat within 60 seconds or be
     *   considered dead and have its transport dropped. This means that unexpectedly severed
     *   connections (without calling {@link x2o.Epoxy#disconnect} from the client) may be recognized by
     *   the server as lost until 60 seconds have passed.
     *
     * @example
     * // create an instance of the Epoxy client;
     * var client = new x2o.Epoxy();
     *
     * // install a handler for incoming events, either from other connected peers or from the
     * // server
     *     epoxy_events_handler = {
    *       disconnected: function() {
    *           console.log("Epoxy client connected!");
    *
    *           // unregistering the handler is not only courteous, it also prevents leaks
    *           client.unregisterClient(x2o.Epoxy.SOURCE.PEER_TO_PEER, epoxy_events_handler);
    *       })
    *     };
     *
     * // connect the server, wait for the response.
     * $.when(client.connect("http://localhost:555222", "CLIENTID")).then(function() {
    *   client.registerClient(x2o.Epoxy.SOURCE.PEER_TO_PEER, epoxy_events_handler);
    *
    *   console.log("Epoxy client connected!");
    * })
     * .fail(err) {
    *   console.log("Connection to server failed: " + err);
    * });
     *
     */

    function Epoxy() {
        var socket_,
            state_ = STATE.DISCONNECTED,
            cart_clients_ = {},
            _this_ = this,
            disconnected_ = $.Deferred(),
            connect_listeners_ = [],
            DIALECT_VERSION = 1.1;

        /**
         * @typedef x2o.Epoxy~EventInterface
         * @type {object}
         * @desc
         * Defines the possible events that can be received on the wire from the Epoxy server;
         * these messages can be send by cartridges, other Epoxy clients or the client itself (for
         * instance, all registered event handlers will receive the disconnected notification.
         *
         * @property {function} incoming
         *                      _incoming(data, response_fn)_<p>
         *                      called when data is received by the client, where _data_ is the payload sent by the peer
         *                      (other Epoxy client or cartridge or server) and _response_fn(data)_ can be called with a
         *                      single argument that will be sent back to the initiating peer.<p>
         * @property {function} disconnected called when the connection has been severed.
         * @property {function} connected called when connection is complete.
         * @property {function} error called when an error occurred with the connection.
         */

        /**
         * Install an event handler for a given source.
         * There are no limits to the number of handler that can be attached to a source for a given client.
         * Unregistering handlers no longer in use would be nice, though.
         *
         * @function x2o.Epoxy#registerClient
         *
         * @param {string} cartridge_id GUID identifier or target cartridge or a member of {@link x2o.Epoxy.SOURCE}.
         * @param {x2o.Epoxy~EventInterface} handler An instance of the Epoxy event interface against which callbacks will be executed.
         */

        this.registerClient = function(cartridge_id, handler) {
            if (!cartridge_id) cartridge_id = X2O_PEER_TO_PEER_MSG;
            cart_clients_[cartridge_id] = cart_clients_[cartridge_id] || [];
            if(cart_clients_[cartridge_id].indexOf(handler) == -1) cart_clients_[cartridge_id].push(handler);
        };

        /**
         * Uninstall an event handler for a given source.
         * There are no limits to the number of handler that can be attached to a source for a given client.
         * Unregistering handlers no longer in use would be nice, though.
         *
         * @function x2o.Epoxy#unregisterClient
         *
         * @param {string} cartridge_id GUID identifier or target cartridge or 'x2o.Epoxy.SOURCE.PEER_TO_PEER'.
         * @param {x2o.Epoxy~EventInterface} handler Same object-as-handler that was passed in to the registerListener call.
         */

        this.unregisterClient = function (cartridge_id, handler) {
            if (!cartridge_id) cartridge_id = X2O_PEER_TO_PEER_MSG;
            if (!cart_clients_[cartridge_id]) return;

            var offset = cart_clients_[cartridge_id].indexOf(handler);
            if(offset != -1) {
                // use delete instead of splice to allow forEach in disconnect continue its work
                delete cart_clients_[cartridge_id][offset];
            }
        };


        function iterate_cart_clients(callback) {
            for (var idx in cart_clients_) {
                cart_clients_[idx].forEach(function (client) {
                    callback(client);
                });
            };
        };

        function pop_listeners(callback) {
            while (connect_listeners_[0]) {
                callback(connect_listeners_[0]);
                connect_listeners_.splice(0, 1);
            };
        };

        /**
         * Connect the Epoxy client instance to an Epoxy server.
         *
         * @function x2o.Epoxy#Connect
         *
         * @param {string} URL URL to target Epoxy to connect to.
         * @param {string} id Client identifier for this instance -- uniqueness is not enforced at the server-level, so make
         *                 sure to provide unique identifiers.
         *
         * @returns {jQueryPromise} The promise will be resolved once the connection is established (immediately if already
         *                          established). It will be rejected in case of connection failure or error, with a string
         *                          specifying the reason as a value.
         */

        /**
         * Connect to an Epoxy server using values set by the last call to `connect`. If no previous call occurred, the promise
         * will be rejected.
         *
         * @function x2o.Epoxy#Connect
         *
         * @returns {jQueryPromise} The promise will be resolved once the connection is established (immediately if already
         *                          established). It will be rejected in case of connection failure or error, with a string
         *                          specifying the reason as a value.
         */
        this.connect = function (url, id) {
            var connected = $.Deferred();

            if (state_ == STATE.CONNECTING || state_ == STATE.ESTABLISHED) {
                return _this_.waitForConnected();
            } else if (state_ === STATE.REGISTERED) {
                connected.resolve();
                return connected.promise();
            };

            try {
                state_ = STATE.CONNECTING;
                socket_ = io.connect(url, {
                    'reconnect': false,
                    'force new connection': true
                });
                socket_.on('error', function(error) {
                    if (this.on.error) console.log('[Epoxy::on::error] DEPRECATED -- this API is no longer supported, use registerClient(\'\', {...})');
                    if (state_ === STATE.CONNECTING) {
                        connected.reject(error);
                        state_ = STATE.DISCONNECTED;

                        pop_listeners(function (listener) {
                            listener.reject(error);
                        });
                    } else {
                        iterate_cart_clients(function (client) { if (client.error) client.error(error); });

                        if(state_ === STATE.DISCONNECTING || state_ === STATE.DISCONNECTED) {
                            disconnected_.resolve();
                            state_ = STATE.DISCONNECTED;
                        };
                    };
                });
                socket_.on('connect_failed', function (error) {
                    pop_listeners(function (listener) {
                        listener.reject(error);
                    })

                    if (this.on.connectFailed) console.log('[Epoxy::on::connectFailed] DEPRECATED -- this API is no longer supported, use registerClient(\'\', {...})');
                    connected.reject(error);
                    state_ = STATE.DISCONNECTED;
                });

                socket_.on('connect', function () {
                    state_ = STATE.ESTABLISHED;
                    disconnected_ = $.Deferred();
                    $(window).unload(function () {
                        _this_.disconnect();
                    });
                }).on('disconnect', function () {
                    if (this.on.disconnected) console.log('[Epoxy::on::disconnected] DEPRECATED -- this API is no longer supported, use registerClient(\'\', {...})');
                    iterate_cart_clients(function (client) { if (client.disconnected) client.disconnected(); })

                    state_ = STATE.DISCONNECTED;
                    disconnected_.resolve();
                })
                    .on('x2o.REGISTER', function (metadata, respond) {
                        respond({
                            'id': id,
                            'supported_dialect_versions': metadata['dialect_version'] ==
                            DIALECT_VERSION ?
                                [DIALECT_VERSION]: undefined         // force connection failure if versions don't match
                        });
                    }).on('x2o.REGISTRATION', function (response) {
                        if(response.success)  {
                            connected.resolve(true);
                            state_ = STATE.REGISTERED;
                            pop_listeners(function (listener) {
                                listener.resolve();
                            });
                        }
                        else {
                            connected.reject(response.message);
                            state_ = STATE.DISCONNECTED;
                            pop_listeners(function (listener) {
                                listener.reject(response.message);
                            });
                        }

                        iterate_cart_clients(function (client) { if (client.connected) client.connected(); })
                    }).on('x2o.INCOMING', function (cartridge_id_, payload, respond) {
                        if (!cartridge_id_) {
                            if (this.on.incoming) console.log('[Epoxy::on::incoming] DEPRECATED -- this API is no longer supported, use registerClient(\'\', {...})');
                            cartridge_id_ = X2O_PEER_TO_PEER_MSG;
                        };

                        if (cart_clients_[cartridge_id_]) {
                            cart_clients_[cartridge_id_].forEach(function (client) {
                                if(client.incoming) client.incoming(payload, respond);
                            });
                        } else {
                            if(cartridge_id_ != X2O_PEER_TO_PEER_MSG) {
                                throw ["[Epoxy::on::x2o.INCOMING()] Cartridge ",
                                    cartridge_id_,
                                    ' not registered with Epoxy client. Oops?'].join('');
                            }
                        };
                    });
            } catch (e) {
                connected.reject(e.message);
                state_ = STATE.DISCONNECTED;
                pop_listeners(function (listener) {
                    listener.reject(e.message);
                });
            };

            return connected.promise();
        };

        /**
         * Waits for the client to be connected.
         *
         * This is useful for objects that are not responsible for connecting the
         * client (in cases where the Epoxy client is shared across multiple objects).
         *
         * @returns {jQueryPromise} The promise will resolve when the client is connected, immediately
         *                          if the client already is connected.
         */
        this.waitForConnected = function () {
            var conn_done = $.Deferred();
            if (state_ == STATE.REGISTERED)
                conn_done.resolve();
            else
                connect_listeners_.push(conn_done);

            return conn_done.promise();
        };

        /**
         * Severs the conection to the server.
         *
         * @returns {jQueryPromise} A promise that will resolve once the disconnection is complete.
         */
        this.disconnect = function() {
            state_ = STATE.DISCONNECTING;
            socket_.disconnect();
            return disconnected_.promise();
        };

        /**
         * Send data to a peer Epoxy client.
         * @function x2o.Epoxy#sendTo
         *
         * @param {string} target_id The client id (supplied as a parameter to {@link x2o.Epoxy#connect} of the target).
         * @param {string|object} payload The data to send to the peer.
         *
         * @returns {jQueryPromise} A promise object that will be resolved with an optional client response object.
         */
        this.sendTo = function (target_id, payload) {
            var sent = $.Deferred();
            socket_.emit(
                'x2o.SENDTO',
                { id: target_id, pay: payload },
                function (data) {
                    sent.resolve(data);
                }
            );
            return sent.promise();
        };

        /**
         * Check to see if the client is connected.  This method will return a promise.
         *
         * @function x2o.Epoxy#isConnected
         *
         * @returns {jQueryPromise} A promise that will resolve with true if the client is connected, false if not.
         */

        this.isConnected = function () {
            var done = $.Deferred();
            done.resolve(state_ == STATE.REGISTERED);
            return done.promise();
        };

        /**
         * @typedef x2o.Epoxy~CartridgeInfo
         * @type {object}
         * @desc
         * Defines an cartridge, either by name/networkId or cartridge GUID identifier. GUID is
         * preferred and faster.
         *
         * @property {string} name Name of cartridge (must be combined with networkId). __SLOWER__
         * @property {string} networkId Network where cartridge is located. __SLOWER__
         */

        /**
         * Send a command to an Epoxy cartridge.
         *
         * @function x2o.Epoxy#sendCommand
         *
         * @param {x2o.Epoxy~CartridgeInfo} cartridge_info Identification information for the cartridge.
         * @param {string|object} payload The data to send to the cartridge.
         *
         * @returns {jQueryPromise} A promise object that will be resolved with an optional response object from the server.
         */
        this.sendCommand = function(cartridge_info, payload) {
            var sent = $.Deferred();

            if(typeof(cartridge_info) != 'object' ||
                (!cartridge_info.hasOwnProperty('name') &&
                !cartridge_info.hasOwnProperty('networkId') &&
                !cartridge_info.hasOwnProperty('Id'))) {
                throw '[X2O Epoxy::sendCommand(cartridge_info, payload)] cartridge_info must be a dictionary { name, networkId } or { Id }';
            };

            socket_.emit(
                'x2o.CARTRIDGECOMMAND',
                cartridge_info,
                payload,
                function (data) {
                    sent.resolve(data);
                }
            );

            return sent.promise();
        };

        this.broadcast = function (payload) {
            throw '[X2O Epoxy::broadcast(payload)] !!DEPRECATED - this method is no longer available.';
        };

        setInterval(function cleanup_cart_clients_(){
            for (var idx in cart_clients_) {
                cart_clients_[idx] = cart_clients_[idx].filter(function (n) { return (n !== undefined); });
            };
        }, 60000);
    };
    Epoxy.SOURCE = SOURCE;

    x2o.Epoxy = Epoxy;
}(x2o, window));