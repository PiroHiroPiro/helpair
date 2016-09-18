import * as React from 'react';
import * as ReactDOM from 'react-dom';

import {MassageData, UserData} from './sampleData';

export namespace MessageInput {
    export interface Props extends React.Props<MessageInput> {
        sendMassageEvent: (text: string) => any;

    }
    export interface State {
        inputText?: string;
        inputHeight?: number;
    }
}

export class MessageInput extends React.Component<MessageInput.Props, MessageInput.State> {
    constructor() {
        super();
        this.state = { inputText: '' };

        this.changeEvent = this.changeEvent.bind(this);
        this.keyDownEvent = this.keyDownEvent.bind(this);
        this.setInputHeight = this.setInputHeight.bind(this);
    }
    changeEvent(e: KeyboardEvent) {
        const textarea = e.target as HTMLTextAreaElement
        this.setState({
            inputText: textarea.value
        });
        this.setInputHeight();
    }
    setInputHeight() {
        const textarea = this.refs['nameInput'] as HTMLTextAreaElement;
        
        if (Math.abs(textarea.scrollHeight - this.state.inputHeight) < 1) return;

        this.setState({
            inputHeight: textarea.scrollHeight
        });
        requestAnimationFrame(this.setInputHeight);
    }
    keyDownEvent(e: KeyboardEvent) {
        this.setInputHeight();

        if (e.keyCode === 13 && !e.shiftKey) {
            e.preventDefault();

            const text = this.state.inputText.trim();

            if (text === '') return;

            this.props.sendMassageEvent(text);

            this.setState({
                inputText: ''
            });

            requestAnimationFrame(this.setInputHeight);
        }
    }
    componentDidMount() {
        (this.refs['nameInput'] as HTMLTextAreaElement).focus();
    }
    render() {
        return (
            <div className="MessageInputContainer">
                <textarea
                    ref="nameInput"
                    className="MessageInput-textarea"
                    rows="1"
                    value={this.state.inputText}
                    onChange={this.changeEvent}
                    onKeyDown={this.keyDownEvent}
                    style={{
                        height: this.state.inputHeight
                    }}
                    placeholder="Say something..."
                    />
            </div>
        );
    }
}
