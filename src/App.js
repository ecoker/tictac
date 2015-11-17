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
    if (!this.state.xo) {
      this.setState({
        xo: this.props.current(this.props.squareNumber)
      });
    }
    e.preventDefault();
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
    this.claimSquare = this.claimSquare.bind(this);
    this.getSetXO = this.getSetXO.bind(this);
    this.socket = io('http://localhost:3000');
    this.socket.on('xo', function (data) {
      console.log(data);
    });
  }

  claimSquare(key) {
    console.log('claim square', key);
    this.socket.emit('xo', {
      'key': key,
      'xo': this.state.current
    });
  }

  getSetXO(key) {
    if (typeof key !== 'undefined') this.setState({ current: this.state.current == 'x' ? 'o' : 'x' });
    this.claimSquare(key);
    return this.state.current;
  }

  render() {
    var squares = [];
    for (var i=0; i<this.props.count; i++) {
      squares.push( <Square key={i} squareNumber={i} current={this.getSetXO} /> );
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
    return (
      <div>
        <Squares count={9} />
      </div>
    );
  }
}