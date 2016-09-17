import * as React from 'react';
import * as ReactDOM from 'react-dom';

import {Helper} from './Helper';

import {lastLogsData} from './sampleData';

export namespace HelperList {
    export interface Props extends React.Props<HelperList> {
        helperList: lastLogsData[];
        // selectId: number;
        selectHelper: (...args: any[]) => any;
    }
    export interface State {
    }
}

export class HelperList extends React.Component<HelperList.Props, HelperList.State> {
    render() {
        return (
            <ul className="HelperList">
                {this.props.helperList.map((chat) => <Helper
                    helper={chat}
                    key={chat.user.userId}
                    onClick={this.props.selectHelper}
                />) }
            </ul>
        );
    }

}
