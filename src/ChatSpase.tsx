import * as React from 'react';
import * as ReactDOM from 'react-dom';

import {Massage} from './Massage';
import {MessageInput} from './MessageInput';

import {MassageData, UserData} from './sampleData';
// import {MessagesContainer} from './MessagesContainer';

export namespace ChatSpase {
    export interface Props extends React.Props<ChatSpase> {
        massages: MassageData[]
        selfId: number;
        opponentId: number;
        socket: SocketIOClient.Socket
    }
}

export class ChatSpase extends React.Component<ChatSpase.Props, {}> {
    
    render() {
        setTimeout(()=> {
        const a = (this.refs['massages'] as HTMLElement);
        if (a) a.scrollTop = a.scrollHeight;

        }, 200)
        return (
            <div className="ChatSpase">
                <div className="ChatSpase-massages" ref="massages">
                    {this.props.massages.map(massage => <Massage
                        key={massage.id}
                        data={massage}
                        isSelf={this.props.selfId === massage.user.userId}
                        />) }
                </div>
                {this.props.massages.length !== 0 ? <MessageInput
                    socket={this.props.socket}
                    opponentId={this.props.opponentId}
                    selfId={this.props.selfId}
                    /> : ''}
            </div>
        );
    }

}
