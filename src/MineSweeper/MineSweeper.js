// import logo from './logo.svg';
import './MineSweeper.css';
import React from 'react'
// import * as ReactDOM from 'react-dom';
// import { render } from '@testing-library/react';

class Square extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      x:this.props.x,
      y:this.props.y,
      square_answer:'',
      board_status:this.props.board_status,
      square_class: 'unrevealed-square',
      available:true
    }
  }
  componentDidUpdate(prevProps,prevState){
    if(this.props.square_answer!==prevState.square_answer){
      this.setState({square_answer:this.props.square_answer})
    }
    if(this.props.board_status!==prevProps.board_status){
      for(let element of this.props.target){
        if (this.props.square_answer===10  && this.state.x===element[0] && this.state.y===element[1] && this.state.available===true){
          this.setState({square_class:'boom-square',available:false});
        }
        if (this.props.square_answer!==10 && this.state.x===element[0] && this.state.y===element[1] && this.state.available===true){
          this.setState({square_class:'',square_answer:this.props.square_answer});
          if (this.props.square_answer===0){
            this.setState({square_class:'revealed-square'})
          }
          this.setState({available:false});
        }
      }
      this.setState({board_status:!this.props.board_status})
    }
   
  }
  render() {
    return (
      <button className='square' onClick={() => this.props.onClickHandler(this.state.x,this.state.y)}>
        <img className={this.state.square_class} alt=""/>
        {this.state.square_class==='' ? this.state.square_answer : '' }
          
      </button>
    )
  }
}

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      width: this.props.width,
      height: this.props.height,
      MINES_LIMIT: 5,
      MINE_ID: 10,
      answer:Array(this.props.height).fill(0).map(row => new Array(this.props.width).fill(0)),
      grid: Array(this.props.height).fill(0).map(row => new Array(this.props.width).fill(-1)),
      found: new Set(),
      board_status:0,
      target:[]
    }
    this.generateMines = this.generateMines.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.width !== prevState.width) {
      this.setState({ width: this.props.width });
      this.setState({ 
        grid: Array(this.state.height).fill(0).map(row => new Array(this.state.width).fill(-1)),
        answer: Array(this.state.height).fill(0).map(row => new Array(this.state.width).fill(0))
      });
    }
    if (this.props.height !== prevState.height) {
      this.setState({ height: this.props.height });
      this.setState({ 
        grid: Array(this.state.height).fill(0).map(row => new Array(this.state.width).fill(-1)),
        answer: Array(this.state.height).fill(0).map(row => new Array(this.state.width).fill(0)) 
      });
    }
  }
  bfs(x,y){
    var q=[];
    var seen=this.state.found;
    var new_grid=this.state.grid;
    var new_target=this.state.target;
    new_target.push([x,y])
    if (this.state.answer[x][y]===this.state.MINE_ID){
      new_grid[x][y]=this.state.MINE_ID;
      this.setState({target:new_target,board_status:!this.state.board_status});
      return 0;
    }
    q.push([x,y])
    seen.add(x+','+y)
    while(q.length>0){
      var [i,j]=q.shift();
      if (this.state.answer[i][j]===this.state.MINE_ID){
        continue;
      }
      new_grid[i][j]=this.state.answer[i][j];
      new_target.push([i,j]);
      // setTimeout(() => {}, 5000);
      // console.log(this.state.target_x+','+this.state.target_y)
      if(this.state.answer[i][j]===0){
        for(var tx=i-1;tx<=i+1;tx++){
          for(var ty=j-1;ty<=j+1;ty++){
            if (tx===i && ty===j){
              continue;
            }
            if (tx>=0 && tx<this.state.height && ty>=0 && ty<this.state.width && !seen.has(tx+','+ty)){
              q.push([tx,ty]);
              seen.add(tx+','+ty);
            }
          }
        }
      }
    }
    this.setState({target:new_target,board_status:!this.state.board_status});

    this.setState({found:seen,grid:new_grid});
  }
  onClickHandler = (coor_x,coor_y) => {
    this.bfs(coor_x,coor_y)
    
  }
  generateMines () {
    var mines = new Set();
    while (mines.size < this.state.MINES_LIMIT) {
      mines.add(this.getRandom(this.state.height) + ',' + this.getRandom(this.state.width))
    }
    var generated_board = Array(this.state.height).fill(0).map(row => new Array(this.state.width).fill(0))
    for (const coor of mines) {
      var coordinate = coor.split(',');
      var x = Number(coordinate[0]);
      var y = Number(coordinate[1]);
      generated_board[x][y] = this.state.MINE_ID;
      for (var i = x - 1; i <= x + 1; i++) {
        for (var j = y - 1; j <= y + 1; j++) {
          if (i === x && j === y) {
            continue;
          }
          if (i >= 0 && i < this.state.height && j >= 0 && j < this.state.width && generated_board[i][j] !== this.state.MINE_ID) {
            generated_board[i][j]++;
          }
        }
      }
    }
    this.setState({answer : generated_board})
  }
  renderSquare(coor_x,coor_y,i) {
    return <Square x={coor_x} y={coor_y} target={this.state.target} square_answer={this.state.answer[coor_x][coor_y]} board_status={this.state.board_status} onClickHandler={this.onClickHandler}/>;
  }
  getRandom(max_value) {
    return Math.floor(Math.random() * max_value);
  }
  
  render() {
    let game_table = <table className='game-board'>
      <tbody>
        {this.state.grid.map((arr, x) => {
          return (
            <tr key={x}>
              {arr.map((val, y) => {
                return (
                  <td key={y}>{this.renderSquare(x,y,val)}</td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>

    return (
      <div>
        <div>
          {/* <h1>minesweeper</h1> */}
        </div>
        {game_table}

        <button onClick={this.generateMines}>generate</button>
      </div>
    );

  }
}
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      width: 6,
      height: 7,
      status:0
    }
  }
  render() {
    return (
      <div>
        <input type="number" value={this.state.width} onChange={
          (e) => {
            if (e.target.value > 0 && e.target.value != null) {
              this.setState({ width: Number(e.target.value) })
            }
          }
        } />
        <input type="number" value={this.state.height} onChange={
          (e) => {
            if (e.target.value > 0 && e.target.value != null) {
              this.setState({ height: Number(e.target.value) })
            }
          }
        } />
        <div>
          <Board width={this.state.width} height={this.state.height} />
        </div>
      </div>
    );
  }
}
export default function MineSweeper() {
  return (
    <Game />
  )
}
