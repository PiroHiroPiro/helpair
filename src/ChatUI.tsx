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
        selectId?: number;
        userId?: number
        chat?: MassageData[];
        users?: { [userId: number]: UserData };
    }
}

export class ChatUI extends React.Component<ChatUI.Props, ChatUI.State> {
    socket = io.connect();
    chat: {
        [userId: number]: MassageData[]
    } = {};

    constructor() {
        super();

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

        this.socket.on('logined', this.setLoginData.bind(this))
        this.socket.on('joinChatRoom', this.setChatData.bind(this))
        this.socket.on('send', this.chatch.bind(this))

        this.socket.emit('login', this.state.userId);

        this.selectHelper = this.selectHelper.bind(this);
    }
    chatch(data: any) {
        this.state.chat.push(data)
        this.setState({
            chat: this.state.chat
        });
    }
    setLoginData(data: ChatData) {
        const users: { [userId: number]: UserData } = {};
        // this.userId = data.userId
        data.chat.forEach(chat => {
            users[chat.user.userId] = chat.user
        });

        this.setState({
            userId: data.userId,
            selectId: null,
            data, users
        })

        console.log(this.state.userId, this.state.selectId)
    }
    selectHelper(id: number) {
        // console.log(this.state.selectId, this.state.chat)
        // if (!this.chat[id]) {
        this.chat[id] = [];
        this.socket.emit('joinChatRoom', [id, this.state.userId]);
        // }

        this.setState({
            selectId: id,
            chat: this.chat[id]
        });
        console.log(this.state.userId, this.state.selectId)
    }
    setChatData(data: { id: number, data: MassageData[] }) {
        // console.log(data.data);
        this.chat[data.id] = data.data;

        this.setState({
            chat: data.data
        })
    }
    render() {
        const selectHelper = this.state.data.chat.filter(chat => chat.user.userId === this.state.selectId)[0]

        return (
            <div className="ChatUI">
                <HelperList
                    helperList={this.state.data.chat}
                    // selectId={this.state.selectId}
                    selectHelper={this.selectHelper}
                    />
                {
                    this.state.selectId ? <div
                        className="ChatUI-popup"
                        onClick={(e) => {
                            if ((e.target as HTMLElement).className === "ChatUI-popup") this.setState({selectId: null})
                        } }>
                        <ChatSpase
                            socket={this.socket}
                            massages={this.state.chat || []}
                            selfId={this.state.userId}
                            opponentId={this.state.selectId}
                            />
                    </div> : null
                }
            </div>
        );
    }
}