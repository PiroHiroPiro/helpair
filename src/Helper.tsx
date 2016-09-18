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
            <li className={'Helper ' + (this.props.isSelect ? 'select' : '') }key={this.props.helper.user.userId}
                >
                <div className="Helper-icon" style={{
                    backgroundImage: `url(${this.props.helper.user.imageUrl})`
                }} />
                <div className="Helper-text">
                    <div className="Helper-name">{this.props.helper.user.name}</div>
                    <div className="Helper-colms">
                        <p className="Helper-lastLog">{this.props.helper.lastLog.massage}</p>
                        <div className="Helper-reply" onClick={this.onClick}>返信</div>
                    </div>
                    <div className="Helper-colms">
                        <div className="Helper-date">{displayTime(this.props.helper.lastLog.date) }</div>
                        {this.props.helper.notCheck ? <div className="Helper-unread">{this.props.helper.notCheck + '件未読'}</div> : null}
                    </div>
                </div>
            </li>
        );
    }

}
function displayTime(unixTime) {
    var date = new Date(unixTime)
    var diff = new Date().getTime() - date.getTime()
    var d = new Date(diff);

    if (d.getUTCFullYear() - 1970) {
        return d.getUTCFullYear() - 1970 + '年前'
    } else if (d.getUTCMonth()) {
        return d.getUTCMonth() + 'ヶ月前'
    } else if (d.getUTCDate() - 1) {
        return d.getUTCDate() - 1 + '日前'
    } else if (d.getUTCHours()) {
        return d.getUTCHours() + '時間前'
    } else if (d.getUTCMinutes()) {
        return d.getUTCMinutes() + '分前'
    } else {
        return d.getUTCSeconds() + '秒前'
    }
}