import React, { Component } from 'react';
import { css } from '@emotion/core';
import { ClipLoader } from 'react-spinners';
import './Loading.css';

const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
`;

export class Loading extends Component {
  render() {
    return (
        <div id="lod">
            <ClipLoader
                css={override}
                sizeUnit={"px"}
                size={150}
                color={'#7D4CDB'}
            />
      </div>
    )
  }
}

export default Loading
