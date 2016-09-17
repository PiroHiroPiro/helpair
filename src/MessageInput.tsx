import * as React from 'react';
import * as ReactDOM from 'react-dom';

import {MassageData, UserData} from './sampleData';

export namespace MessageInput {
    export interface Props extends React.Props<MessageInput> {
        socket: SocketIOClient.Socket;
        opponentId: number;
        selfId: number;
    }
    export interface State {
        text: string;
    }
}

export class MessageInput extends React.Component<MessageInput.Props, MessageInput.State> {
    constructor() {
        super();
        this.state = { text: '' };

        this.changeEvent = this.changeEvent.bind(this);
        this.keyDownEvent = this.keyDownEvent.bind(this);
    }
    changeEvent(e: KeyboardEvent) {
        this.setState({ text: (e.target as HTMLInputElement).value });
    }
    keyDownEvent(e: KeyboardEvent) {
        if (e.keyCode === 13 && !e.shiftKey) {
            e.preventDefault();
            console.log('enter', this.props.opponentId, this.props.selfId)

            this.props.socket.emit('send', {
                to: this.props.opponentId,
                massageFrom: this.props.selfId,
                text: this.state.text
            })
            this.setState({ text: '' });
        }
    }
    componentDidMount() {
        (this.refs['nameInput'] as any).focus();
    }
    render() {
        return (
            <div className="MessageInputContainer">
                <textarea
                    ref="nameInput"
                    className="MessageInput-textarea"
                    rows="1"
                    value={this.state.text}
                    onChange={this.changeEvent}
                    onKeyDown={this.keyDownEvent}
                    placeholder="Say something..."
                    />
            </div>
        );
    }
}
