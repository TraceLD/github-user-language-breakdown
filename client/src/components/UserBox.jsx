import React, { Component } from 'react';
import { Box } from 'grommet';
import './UserBox.css';

export class UserBox extends Component {
    render() {
        return (
            <div>
                <Box
                    id='user'
                    round='medium'
                    tag='header'
                    direction='row'
                    align='center'
                    justify='between'
                    background='#1e222a'
                    pad={{ vertical: 'small', horizontal: 'medium' }}
                >
                    <div className="avatarBox">
                        <img className="avatar"
                            src={this.props.avatar}
                            alt="Avatar" /><h3 className="username">{this.props.username}</h3>
                    </div>
                </Box>
            </div>
        )
    }
}

export default UserBox
