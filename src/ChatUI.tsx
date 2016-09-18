import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as io from 'socket.io-client';

import {ChatData, MassageData, UserData} from './sampleData';
import {HelperList} from './HelperList';
import {ChatSpase} from './ChatSpase';

export namespace ChatUI {
    export interface Props extends React.Props<ChatUI> {
    }
    export interface State {
        data?: ChatData;
        opponent?: UserData;
        user?: UserData;
        chat?: MassageData[];
        users?: { [userId: number]: UserData };
        inputText?: '';
    }
}

export class ChatUI extends React.Component<ChatUI.Props, ChatUI.State> {
    socket = io.connect();
    chats: {
        [userId: number]: MassageData[]
    } = {};

    constructor() {
        super();

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

        this.socket.on('logined', this.setLoginData.bind(this))
        this.socket.on('joinChatRoom', this.setChatData.bind(this))
        this.socket.on('send', this.chatchMassage.bind(this))

        this.socket.emit('getHelperListData', this.state.user.userId);

        // bind
        this.selectHelper = this.selectHelper.bind(this);
        this.sendMassageEvent = this.sendMassageEvent.bind(this);
        this.uiCloseEvent = this.uiCloseEvent.bind(this);

        const jsLink = document.getElementById('js-link');
        if (jsLink) {
            jsLink.addEventListener('click', e => {
                e.preventDefault();

                this.setState({
                    opponent: { userId: 2, name: "スティーブ" }
                })
            })
        }
    }
    sendMassageEvent(text: string) {
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
    }
    chatchMassage(data: MassageData) {
        this.socket.emit('getHelperListData', [this.state.user.userId, this.state.opponent.userId]);

        if (this.state.opponent.userId === data.user.userId) {
            this.state.chat.push(data)
            // this.state.data.chat
            this.setState({
                chat: this.state.chat
            });
        }

        console.log(data);
    }
    setLoginData(data: ChatData) {
        const users: { [userId: number]: UserData } = {};
        // this.userId = data.userId
        data.chat.forEach(chat => {
            users[chat.user.userId] = chat.user
        });

        this.setState({
            user: data.user,
            // opponent: { userId: null, name: null },
            data, users
        });

        console.log(this.state.user.userId, this.state.opponent.userId)
    }
    selectHelper(id: number) {
        // if (!this.chat[id]) {
        this.chats[id] = [];
        this.socket.emit('joinChatRoom', [id, this.state.user.userId]);
        // }

        console.log(this.state.user, id)
        this.setState({
            opponent: this.state.users[id],
            chat: this.chats[id]
        });

        this.socket.emit('getHelperListData', this.state.user.userId);
    }
    setChatData(data: { id: number, data: MassageData[] }) {
        this.chats[data.id] = data.data;

        this.setState({
            chat: data.data
        })
    }
    uiCloseEvent() {
        this.setState({ opponent: { userId: null, name: null } })
    }
    render() {
        const count = this.state.data.chat.reduce((sum, chat) => sum + chat.notCheck, 0);
        const icon = document.getElementById('new-icon');

        if (count) {
            icon.classList.add('new-icon-on')
            icon.textContent = count as any;
        } else {
            icon.classList.remove('new-icon-on')
        }

        document.body.style.overflow = this.state.opponent.userId ? 'hidden' : null;

        return (
            <div className="ChatUI">
                <HelperList
                    helperList={this.state.data.chat}
                    // selectId={this.state.selectId}
                    selectHelper={this.selectHelper}
                    />
                {
                    this.state.opponent.userId ? <div
                        className="ChatUI-popup"
                        onClick={(e) => {
                            if ((e.target as HTMLElement).className === "ChatUI-popup") this.uiCloseEvent()
                        } }>
                        <ChatSpase
                            massages={this.state.chat || []}
                            user={this.state.user}
                            opponent={this.state.opponent}
                            inputText={this.state.inputText}
                            sendMassageEvent={this.sendMassageEvent}
                            uiCloseEvent={this.uiCloseEvent}
                            />
                    </div> : null
                }
            </div>
        );
    }
}
