import * as React from 'react';
import * as ReactDOM from 'react-dom';

import {MassageData, UserData} from './sampleData';

export namespace Massage {
    export interface Props extends React.Props<Massage> {
        data: MassageData;
        isSelf: boolean;
    }
}

export class Massage extends React.Component<Massage.Props, {}> {
    render() {
        const className = [
            'Massage',
            this.props.isSelf ? 'self' : 'opponent'
        ].join(' ');

        const massageIcon = this.props.data.user.imageUrl && !this.props.isSelf ? (<div className="Massage-icon" style={{
            backgroundImage: `url(${this.props.data.user.imageUrl})`
        }}></div>) : '';

        return (
            <div className={className}>
                {massageIcon}
                <p className="Massage-text">
                    {this.props.data.massage}
                </p>
            </div>
        );
    }
}
