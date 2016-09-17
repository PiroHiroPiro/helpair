import * as React from 'react';
import * as ReactDOM from 'react-dom';

// import {Chat} from './Chat';

import {lastLogsData} from './sampleData';

export namespace Helper {
    export interface Props extends React.Props<Helper> {
        helper: lastLogsData;
        onClick: (...args: any[]) => any;
        isSelect?: boolean;
    }
}

export class Helper extends React.Component<Helper.Props, {}> {
    onClick = () => { this.props.onClick(this.props.helper.user.userId) }
    render() {
        return (
            <li className={'Helper ' + (this.props.isSelect ? 'select' : '') }
                onClick={this.onClick}
                key={this.props.helper.user.userId}
                >
                <div className="Massage-icon" style={{
                    backgroundImage: `url(${this.props.helper.user.imageUrl})`
                }} />
                <div className="Helper-text">
                    <div>{this.props.helper.user.name}</div>
                    <p>{this.props.helper.lastLog.massage}</p>
                </div>
            </li>
        );
    }

}
