import React, { Component } from 'react';
import './Home.css';
import { TextInput, Button } from 'grommet';
import ChartBox from './ChartBox';
import Loading from './Loading';
import UserBox from './UserBox';
const colors = require('../modules/colors.js');

export class Home extends Component {
    state = {
        showHome: true,
        showResult: false,
        loading: false,
        showError: false,
        post: '',
        responseToPost: '',
        dataState: {},
        favLang: '',
        allLang: '',
        avatar: '',
        error: '',
        username: ''
    }

    handleError = async () => {
        this.setState({
            showHome:true,
            showResult: false,
            loading: false,
            showError: false
        })
    }

    handleClick = async () => {
        await this.setState({
            showHome: false,
            loading: true,
            responseToPost: '',
            favLang: '',
            dataState: {},
            allLang: ''
        })

        const avatarResponse = await fetch('/api/avatar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ post: this.state.post }),
        });

        const avatar1 = await avatarResponse.text();
        console.log(avatar1);

        const response = await fetch('/api/languages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ post: this.state.post }),
        });
        const body = await response.text();
        console.log(body);

        const arr = body.split(",");
        console.log(arr);

        const langArr = [];
        const perArr = [];

        if (arr[0] === "User does not exist." || arr[0] === "No repositories found.") {
            this.setState({
                error: arr[0],
                loading: false,
                showError: true
            });
        } else {
            for (let i = 0; i < arr.length; i++) {
                const lang = arr[i].substring(0, arr[i].indexOf(":"));
                const per = parseFloat(arr[i].substring(arr[i].indexOf(":") + 2, arr[i].indexOf("%")));
                langArr.push(lang);
                perArr.push(per);
            }

            const favLangPosition = perArr.indexOf(Math.max(...perArr));

            const favLanguage = `${this.state.post}'s favourite language seems to be ${langArr[favLangPosition]}!`

            const arr2 = [];

            for (let i = 0; i < langArr.length; i++) {
                let color = colors.colors[i];
                arr2.push(color);
            }

            const data = {
                labels: langArr,
                datasets: [{
                    data: perArr,
                    backgroundColor: arr2,
                    hoverBackgroundColor: arr2
                }],
            };

            const allLanguages1 = arr.join(", ");
            const allLanguages = allLanguages1.replace("\"\"", "");

            this.setState({
                username: this.state.post,
                favLang: favLanguage,
                dataState: data,
                avatar: avatar1,
                responseToPost: body,
                allLang: allLanguages,
                loading: false,
                showResult: true
            });
        }
    }

    render() {
        const { text } = this.state
        return (
            <div>
                <div className="page-wrap">
                    <h1 id="link2"><a id="link" href="/">GitHub User Language Breakdown</a></h1>
                </div>
                {
                    //LOADING
                    this.state.loading && <div className="loadingDiv">
                        <Loading id="loading" />
                    </div>
                }
                {
                    //HOME PAGE
                    this.state.showHome && <div className="Home">
                        <div className='text'>
                            <TextInput id="form"
                                placeholder="Enter GitHub Username"
                                value={text}
                                onChange={event => this.setState({ post: event.target.value })}
                            />
                            <div className="buttonDiv">
                                <Button id="button"
                                    label='Go!'
                                    onClick={this.handleClick}
                                />
                            </div>
                        </div>
                    </div>
                }

                {
                    //RESULT
                    this.state.showResult && <div className="homeResult">
                        <UserBox 
                            avatar={this.state.avatar}
                            username={this.state.username}
                        />
                        <ChartBox
                            favLang={this.state.favLang}
                            data={this.state.dataState}
                            allLang={this.state.allLang}
                        />
                    </div>
                }
                {
                    //ERROR
                    this.state.showError && <div id="error">
                        <h2>{ this.state.error }</h2>
                        <Button id="errorbutton"
                            label='Go back'
                            onClick={this.handleError}
                        />
                    </div>
                }
            </div>
        )
    }
}

export default Home
