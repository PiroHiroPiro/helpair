import * as React from 'react';
import * as ReactDOM from 'react-dom';

import {Massage} from './Massage';
import {MessageInput} from './MessageInput';

import {MassageData, UserData} from './sampleData';
// import {MessagesContainer} from './MessagesContainer';

export namespace ChatSpase {
    export interface Props extends React.Props<ChatSpase> {
        massages: MassageData[]
        user: UserData;
        opponent: UserData;
        inputText: string;
        sendMassageEvent: (text: string) => any;
        uiCloseEvent: () => any;
    }
    export interface State {
    }
}

export class ChatSpase extends React.Component<ChatSpase.Props, ChatSpase.State> {
    render() {
        requestAnimationFrame(() => {
            const a = (this.refs['massages'] as HTMLElement);
            if (a) a.scrollTop = a.scrollHeight;
        })
        return (
            <div className="ChatSpase">
                <div className="ChatSpase-opponent-name">
                    {this.props.opponent.name}
                    <div className="ChatSpase-close"
                        onClick={this.props.uiCloseEvent}>
                        close
                    </div>
                </div>
                <div className="ChatSpase-massages" ref="massages">
                    {this.props.massages.map(massage => <Massage
                        key={massage.id}
                        data={massage}
                        isSelf={this.props.user.userId === massage.user.userId}
                        />) }
                </div>
                <MessageInput
                    sendMassageEvent={this.props.sendMassageEvent}
                    />
            </div>
        );
    }

}
