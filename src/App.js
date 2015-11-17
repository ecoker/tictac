import React, { Component } from 'react';

export class Square extends Component {
  constructor(props) {
    super(props);
    this.state = {
      xo: false
    };
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick(e) {
    this.setState({
      xo: this.props.current(true)
    });
    e.preventDefault();
  }
  squareText() {
    if (!this.state.xo) return '';
    else return this.state.xo;
    console.log('xo', this.state.xo);
  }
  render() {
    return (
      <a href="#" className="square" onClick={this.handleClick}>
        { this.state.xo }
      </a>
    );
  }
}

export class Squares extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 'x'
    }
    this.getSetXO = this.getSetXO.bind(this);
  }
  getSetXO(clicked) {
    if (typeof clicked !== 'undefined') this.setState({ current: this.state.current == 'x' ? 'o' : 'x' });
    return this.state.current;
  }
  render() {
    var squares = [];
    for (var i=0; i<this.props.count; i++) {
      squares.push( <Square key={i} current={this.getSetXO} /> );
    }
    return (
      <div id="squares">
        {squares}
      </div>
    );
  }
}

export class TicTac extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    var boundClick = function() {
      console.log('clicked');
    }
    return (
      <div>
        <Squares onClick="boundClick" count={9} />
      </div>
    );
  }
}