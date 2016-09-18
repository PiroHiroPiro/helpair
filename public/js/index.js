/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var React = __webpack_require__(1);
	var ReactDOM = __webpack_require__(2);
	var ChatUI_1 = __webpack_require__(3);
	ReactDOM.render(React.createElement(ChatUI_1.ChatUI, null), document.getElementById("content"));


/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = React;

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = ReactDOM;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var React = __webpack_require__(1);
	var io = __webpack_require__(4);
	var HelperList_1 = __webpack_require__(5);
	var ChatSpase_1 = __webpack_require__(7);
	var ChatUI = (function (_super) {
	    __extends(ChatUI, _super);
	    function ChatUI() {
	        var _this = this;
	        _super.call(this);
	        this.socket = io.connect();
	        this.chats = {};
	        this.state = {
	            data: {
	                user: null,
	                chat: []
	            },
	            opponent: { userId: null, name: null },
	            user: { userId: +window.location.hash.substring(1) || 123456, name: null },
	            users: {},
	            chat: []
	        };
	        this.socket.on('logined', this.setLoginData.bind(this));
	        this.socket.on('joinChatRoom', this.setChatData.bind(this));
	        this.socket.on('send', this.chatchMassage.bind(this));
	        this.socket.emit('getHelperListData', this.state.user.userId);
	        // bind
	        this.selectHelper = this.selectHelper.bind(this);
	        this.sendMassageEvent = this.sendMassageEvent.bind(this);
	        this.uiCloseEvent = this.uiCloseEvent.bind(this);
	        var jsLink = document.getElementById('js-link');
	        if (jsLink) {
	            jsLink.addEventListener('click', function (e) {
	                e.preventDefault();
	                _this.setState({
	                    opponent: { userId: 2, name: "スティーブ" }
	                });
	            });
	        }
	    }
	    ChatUI.prototype.sendMassageEvent = function (text) {
	        this.socket.emit('send', {
	            to: this.state.opponent.userId,
	            massageFrom: this.state.user.userId,
	            text: text
	        });
	        this.setState({
	            inputText: '',
	            chat: this.state.chat.concat({
	                id: Date.now(),
	                user: this.state.data.user,
	                massage: text
	            })
	        });
	        this.socket.emit('getHelperListData', this.state.user.userId);
	    };
	    ChatUI.prototype.chatchMassage = function (data) {
	        this.socket.emit('getHelperListData', [this.state.user.userId, this.state.opponent.userId]);
	        if (this.state.opponent.userId === data.user.userId) {
	            this.state.chat.push(data);
	            // this.state.data.chat
	            this.setState({
	                chat: this.state.chat
	            });
	        }
	        console.log(data);
	    };
	    ChatUI.prototype.setLoginData = function (data) {
	        var users = {};
	        // this.userId = data.userId
	        data.chat.forEach(function (chat) {
	            users[chat.user.userId] = chat.user;
	        });
	        this.setState({
	            user: data.user,
	            // opponent: { userId: null, name: null },
	            data: data, users: users
	        });
	        console.log(this.state.user.userId, this.state.opponent.userId);
	    };
	    ChatUI.prototype.selectHelper = function (id) {
	        // if (!this.chat[id]) {
	        this.chats[id] = [];
	        this.socket.emit('joinChatRoom', [id, this.state.user.userId]);
	        // }
	        console.log(this.state.user, id);
	        this.setState({
	            opponent: this.state.users[id],
	            chat: this.chats[id]
	        });
	        this.socket.emit('getHelperListData', this.state.user.userId);
	    };
	    ChatUI.prototype.setChatData = function (data) {
	        this.chats[data.id] = data.data;
	        this.setState({
	            chat: data.data
	        });
	    };
	    ChatUI.prototype.uiCloseEvent = function () {
	        this.setState({ opponent: { userId: null, name: null } });
	    };
	    ChatUI.prototype.render = function () {
	        var _this = this;
	        var count = this.state.data.chat.reduce(function (sum, chat) { return sum + chat.notCheck; }, 0);
	        var icon = document.getElementById('new-icon');
	        if (count) {
	            icon.classList.add('new-icon-on');
	            icon.textContent = count;
	        }
	        else {
	            icon.classList.remove('new-icon-on');
	        }
	        document.body.style.overflow = this.state.opponent.userId ? 'hidden' : null;
	        return (React.createElement("div", {className: "ChatUI"}, React.createElement(HelperList_1.HelperList, {helperList: this.state.data.chat, selectHelper: this.selectHelper}), this.state.opponent.userId ? React.createElement("div", {className: "ChatUI-popup", onClick: function (e) {
	            if (e.target.className === "ChatUI-popup")
	                _this.uiCloseEvent();
	        }}, React.createElement(ChatSpase_1.ChatSpase, {massages: this.state.chat || [], user: this.state.user, opponent: this.state.opponent, inputText: this.state.inputText, sendMassageEvent: this.sendMassageEvent, uiCloseEvent: this.uiCloseEvent})) : null));
	    };
	    return ChatUI;
	}(React.Component));
	exports.ChatUI = ChatUI;


/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = io;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var React = __webpack_require__(1);
	var Helper_1 = __webpack_require__(6);
	var HelperList = (function (_super) {
	    __extends(HelperList, _super);
	    function HelperList() {
	        _super.apply(this, arguments);
	    }
	    HelperList.prototype.render = function () {
	        var _this = this;
	        return (React.createElement("ul", {className: "HelperList"}, this.props.helperList.map(function (chat) { return React.createElement(Helper_1.Helper, {helper: chat, key: chat.user.userId, onClick: _this.props.selectHelper}); })));
	    };
	    return HelperList;
	}(React.Component));
	exports.HelperList = HelperList;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var React = __webpack_require__(1);
	var Helper = (function (_super) {
	    __extends(Helper, _super);
	    function Helper() {
	        var _this = this;
	        _super.apply(this, arguments);
	        this.onClick = function () { _this.props.onClick(_this.props.helper.user.userId); };
	    }
	    Helper.prototype.render = function () {
	        return (React.createElement("li", {className: 'Helper ' + (this.props.isSelect ? 'select' : ''), key: this.props.helper.user.userId}, React.createElement("div", {className: "Helper-icon", style: {
	            backgroundImage: "url(" + this.props.helper.user.imageUrl + ")"
	        }}), React.createElement("div", {className: "Helper-text"}, React.createElement("div", {className: "Helper-name"}, this.props.helper.user.name), React.createElement("div", {className: "Helper-colms"}, React.createElement("p", {className: "Helper-lastLog"}, this.props.helper.lastLog.massage), React.createElement("div", {className: "Helper-reply", onClick: this.onClick}, "返信")), React.createElement("div", {className: "Helper-colms"}, React.createElement("div", {className: "Helper-date"}, displayTime(this.props.helper.lastLog.date)), this.props.helper.notCheck ? React.createElement("div", {className: "Helper-unread"}, this.props.helper.notCheck + '件未読') : null))));
	    };
	    return Helper;
	}(React.Component));
	exports.Helper = Helper;
	function displayTime(unixTime) {
	    var date = new Date(unixTime);
	    var diff = new Date().getTime() - date.getTime();
	    var d = new Date(diff);
	    if (d.getUTCFullYear() - 1970) {
	        return d.getUTCFullYear() - 1970 + '年前';
	    }
	    else if (d.getUTCMonth()) {
	        return d.getUTCMonth() + 'ヶ月前';
	    }
	    else if (d.getUTCDate() - 1) {
	        return d.getUTCDate() - 1 + '日前';
	    }
	    else if (d.getUTCHours()) {
	        return d.getUTCHours() + '時間前';
	    }
	    else if (d.getUTCMinutes()) {
	        return d.getUTCMinutes() + '分前';
	    }
	    else {
	        return d.getUTCSeconds() + '秒前';
	    }
	}


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var React = __webpack_require__(1);
	var Massage_1 = __webpack_require__(8);
	var MessageInput_1 = __webpack_require__(9);
	var ChatSpase = (function (_super) {
	    __extends(ChatSpase, _super);
	    function ChatSpase() {
	        _super.apply(this, arguments);
	    }
	    ChatSpase.prototype.render = function () {
	        var _this = this;
	        requestAnimationFrame(function () {
	            var a = _this.refs['massages'];
	            if (a)
	                a.scrollTop = a.scrollHeight;
	        });
	        return (React.createElement("div", {className: "ChatSpase"}, React.createElement("div", {className: "ChatSpase-opponent-name"}, this.props.opponent.name, React.createElement("div", {className: "ChatSpase-close", onClick: this.props.uiCloseEvent}, "close")), React.createElement("div", {className: "ChatSpase-massages", ref: "massages"}, this.props.massages.map(function (massage) { return React.createElement(Massage_1.Massage, {key: massage.id, data: massage, isSelf: _this.props.user.userId === massage.user.userId}); })), React.createElement(MessageInput_1.MessageInput, {sendMassageEvent: this.props.sendMassageEvent})));
	    };
	    return ChatSpase;
	}(React.Component));
	exports.ChatSpase = ChatSpase;


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var React = __webpack_require__(1);
	var Massage = (function (_super) {
	    __extends(Massage, _super);
	    function Massage() {
	        _super.apply(this, arguments);
	    }
	    Massage.prototype.render = function () {
	        var className = [
	            'Massage',
	            this.props.isSelf ? 'self' : 'opponent'
	        ].join(' ');
	        var massageIcon = this.props.data.user.imageUrl && !this.props.isSelf ? (React.createElement("div", {className: "Massage-icon", style: {
	            backgroundImage: "url(" + this.props.data.user.imageUrl + ")"
	        }})) : '';
	        return (React.createElement("div", {className: className}, massageIcon, React.createElement("p", {className: "Massage-text"}, this.props.data.massage)));
	    };
	    return Massage;
	}(React.Component));
	exports.Massage = Massage;


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var React = __webpack_require__(1);
	var MessageInput = (function (_super) {
	    __extends(MessageInput, _super);
	    function MessageInput() {
	        _super.call(this);
	        this.state = { inputText: '' };
	        this.changeEvent = this.changeEvent.bind(this);
	        this.keyDownEvent = this.keyDownEvent.bind(this);
	        this.setInputHeight = this.setInputHeight.bind(this);
	    }
	    MessageInput.prototype.changeEvent = function (e) {
	        var textarea = e.target;
	        this.setState({
	            inputText: textarea.value
	        });
	        this.setInputHeight();
	    };
	    MessageInput.prototype.setInputHeight = function () {
	        var textarea = this.refs['nameInput'];
	        if (Math.abs(textarea.scrollHeight - this.state.inputHeight) < 1)
	            return;
	        this.setState({
	            inputHeight: textarea.scrollHeight
	        });
	        requestAnimationFrame(this.setInputHeight);
	    };
	    MessageInput.prototype.keyDownEvent = function (e) {
	        this.setInputHeight();
	        if (e.keyCode === 13 && !e.shiftKey) {
	            e.preventDefault();
	            var text = this.state.inputText.trim();
	            if (text === '')
	                return;
	            this.props.sendMassageEvent(text);
	            this.setState({
	                inputText: ''
	            });
	            requestAnimationFrame(this.setInputHeight);
	        }
	    };
	    MessageInput.prototype.componentDidMount = function () {
	        this.refs['nameInput'].focus();
	    };
	    MessageInput.prototype.render = function () {
	        return (React.createElement("div", {className: "MessageInputContainer"}, React.createElement("textarea", {ref: "nameInput", className: "MessageInput-textarea", rows: "1", value: this.state.inputText, onChange: this.changeEvent, onKeyDown: this.keyDownEvent, style: {
	            height: this.state.inputHeight
	        }, placeholder: "Say something..."})));
	    };
	    return MessageInput;
	}(React.Component));
	exports.MessageInput = MessageInput;


/***/ }
/******/ ]);
//# sourceMappingURL=index.js.map