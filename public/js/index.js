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
	        _super.call(this);
	        this.socket = io.connect();
	        this.chat = {};
	        this.state = {
	            data: {
	                user: null,
	                chat: []
	            },
	            selectId: null,
	            userId: +window.location.hash.substring(1) || 123456,
	            chat: [],
	            users: {}
	        };
	        this.socket.on('logined', this.setLoginData.bind(this));
	        this.socket.on('joinChatRoom', this.setChatData.bind(this));
	        this.socket.on('send', this.chatch.bind(this));
	        this.socket.emit('login', this.state.userId);
	        this.selectHelper = this.selectHelper.bind(this);
	    }
	    ChatUI.prototype.chatch = function (data) {
	        this.state.chat.push(data);
	        this.setState({
	            chat: this.state.chat
	        });
	    };
	    ChatUI.prototype.setLoginData = function (data) {
	        var users = {};
	        // this.userId = data.userId
	        data.chat.forEach(function (chat) {
	            users[chat.user.userId] = chat.user;
	        });
	        this.setState({
	            userId: data.userId,
	            selectId: null,
	            data: data, users: users
	        });
	        console.log(this.state.userId, this.state.selectId);
	    };
	    ChatUI.prototype.selectHelper = function (id) {
	        // console.log(this.state.selectId, this.state.chat)
	        // if (!this.chat[id]) {
	        this.chat[id] = [];
	        this.socket.emit('joinChatRoom', [id, this.state.userId]);
	        // }
	        this.setState({
	            selectId: id,
	            chat: this.chat[id]
	        });
	        console.log(this.state.userId, this.state.selectId);
	    };
	    ChatUI.prototype.setChatData = function (data) {
	        // console.log(data.data);
	        this.chat[data.id] = data.data;
	        this.setState({
	            chat: data.data
	        });
	    };
	    ChatUI.prototype.render = function () {
	        var _this = this;
	        var selectHelper = this.state.data.chat.filter(function (chat) { return chat.user.userId === _this.state.selectId; })[0];
	        return (React.createElement("div", {className: "ChatUI"}, React.createElement(HelperList_1.HelperList, {helperList: this.state.data.chat, selectHelper: this.selectHelper}), this.state.selectId ? React.createElement("div", {className: "ChatUI-popup", onClick: function (e) {
	            if (e.target.className === "ChatUI-popup")
	                _this.setState({ selectId: null });
	        }}, React.createElement(ChatSpase_1.ChatSpase, {socket: this.socket, massages: this.state.chat || [], selfId: this.state.userId, opponentId: this.state.selectId})) : null));
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
	        return (React.createElement("li", {className: 'Helper ' + (this.props.isSelect ? 'select' : ''), onClick: this.onClick, key: this.props.helper.user.userId}, React.createElement("div", {className: "Massage-icon", style: {
	            backgroundImage: "url(" + this.props.helper.user.imageUrl + ")"
	        }}), React.createElement("div", {className: "Helper-text"}, React.createElement("div", null, this.props.helper.user.name), React.createElement("p", null, this.props.helper.lastLog.massage))));
	    };
	    return Helper;
	}(React.Component));
	exports.Helper = Helper;


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
	        setTimeout(function () {
	            var a = _this.refs['massages'];
	            if (a)
	                a.scrollTop = a.scrollHeight;
	        }, 200);
	        return (React.createElement("div", {className: "ChatSpase"}, React.createElement("div", {className: "ChatSpase-massages", ref: "massages"}, this.props.massages.map(function (massage) { return React.createElement(Massage_1.Massage, {key: massage.id, data: massage, isSelf: _this.props.selfId === massage.user.userId}); })), this.props.massages.length !== 0 ? React.createElement(MessageInput_1.MessageInput, {socket: this.props.socket, opponentId: this.props.opponentId, selfId: this.props.selfId}) : ''));
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
	        this.state = { text: '' };
	        this.changeEvent = this.changeEvent.bind(this);
	        this.keyDownEvent = this.keyDownEvent.bind(this);
	    }
	    MessageInput.prototype.changeEvent = function (e) {
	        this.setState({ text: e.target.value });
	    };
	    MessageInput.prototype.keyDownEvent = function (e) {
	        if (e.keyCode === 13 && !e.shiftKey) {
	            e.preventDefault();
	            console.log('enter', this.props.opponentId, this.props.selfId);
	            this.props.socket.emit('send', {
	                to: this.props.opponentId,
	                massageFrom: this.props.selfId,
	                text: this.state.text
	            });
	            this.setState({ text: '' });
	        }
	    };
	    MessageInput.prototype.componentDidMount = function () {
	        this.refs['nameInput'].focus();
	    };
	    MessageInput.prototype.render = function () {
	        return (React.createElement("div", {className: "MessageInputContainer"}, React.createElement("textarea", {ref: "nameInput", className: "MessageInput-textarea", rows: "1", value: this.state.text, onChange: this.changeEvent, onKeyDown: this.keyDownEvent, placeholder: "Say something..."})));
	    };
	    return MessageInput;
	}(React.Component));
	exports.MessageInput = MessageInput;


/***/ }
/******/ ]);
//# sourceMappingURL=index.js.map