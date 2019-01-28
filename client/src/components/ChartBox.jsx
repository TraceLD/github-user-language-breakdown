import React, { Component } from 'react';
import { HorizontalBar } from 'react-chartjs-2';
import { Box } from 'grommet';
import './ChartBox.css';
const chartOptions = require('../modules/chartOptions.js');

export class ChartBox extends Component {
    render() {
        return (
            <div>
                <Box
                    id='chart'
                    round='medium'
                    tag='header'
                    direction='row'
                    align='center'
                    justify='between'
                    background='#1e222a'
                    pad={{ vertical: 'small', horizontal: 'medium' }}
                >
                    <div id="js">
                        <h3>{this.props.favLang}</h3>
                        <h5><HorizontalBar
                            id="bar"
                            data={this.props.data}
                            height={500}
                            width={250}
                            options={chartOptions.data} /></h5>
                        <h6>{this.props.allLang}</h6>
                    </div>
                </Box>
            </div>
        )
    }
}

export default ChartBox
