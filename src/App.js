import React, { Component } from 'react';

export class Square extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick(e) {
    this.props.claimSquare({
      key: this.props.squareNumber
    })
    e.preventDefault();
  }
  render() {
    return (
      <a href="#" className="square" onClick={this.handleClick}>
        { this.props.xo || '' }
      </a>
    );
  }
}

export class Reset extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick(e) {
    this.props.resetGame();
    e.preventDefault();
  }
  render() {
    return (
      <a href="#" className="reset" onClick={this.handleClick}>
        Reset Game
      </a>
    );
  }
}

export class TicTac extends Component {
  constructor(props) {
    super(props);
    this.state = {
      board: []
    }
    this.claimSquare = this.claimSquare.bind(this);
    this.updateBoard = this.updateBoard.bind(this);
    this.resetGame = this.resetGame.bind(this);
    this.socket = io('http://localhost:3000');
    this.socket.on('board', this.updateBoard);
  }
  updateBoard(data) {
    this.setState({
      board: data
    });
  }
  claimSquare(data){
    this.socket.emit('xo', data);
  }
  resetGame(){
    this.socket.emit('reset');
  }
  render() {
    var squares = [];
    this.state.board.forEach(function(v,i){
      squares.push( <Square key={i} squareNumber={i} claimSquare={this.claimSquare}  xo={v.xo} /> );
    }, this);
    return (
      <div>
        {squares}
        <Reset resetGame={this.resetGame} />
      </div>
    );
  }
}