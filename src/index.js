import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


//returns a square button
function Square(props) {
	return (
	<button className="square"
		//sets the method to be executed on click
		onClick = {props.onClick}>
		//the displayed text on the square
		{props.value}
	</button>
	);
}

//returns if there's a winner, i.e. 3 in a row of the same type
//type contract: String
function isWinner(squares) {
	//if the sqaures are all unset, return null
	if (!squares) {
		return null;
	}
	//in order: rows 1-3, columns 1-3, and the two diagonals
	const lines = [
		[0,1,2], //row 1
		[3,4,5], //row 2
		[6,7,8], //row 3
		[0,3,6], //column 1
		[1,4,7], //column 2
		[2,5,8], //column 3
		[0,4,8], //diagonal 1
		[2,4,6], //diagonal 2
	];
	//iterate through each possible line 
	for (let i of lines) {
		//check if there's a set value and see if it's the same across the line 
		if (squares[i[0]] && squares[i[0]] === squares[i[1]] && squares[i[0]] === squares[i[2]]) {
			//return the value of the winner (X or O)
			return squares[i[0]];
		}
	}
	//if there's no winner, return null
	return null;
}

//board class: holds all the logic and rendering methods for the actual tic-tac-toe board
class Board extends React.Component {
	/* old constructor for board; contained array of square values
	removed for lack of implementation of history
	constructor(props) {
		super(props);
		this.state = {
			squares: Array(9).fill(null),
			xNext: true,
		}
	}*/
	/* old click handler; needed to be moved alongside the contructor
	handleClick(i) {
		const squares = this.state.squares.slice();
		if (squares[i] === null && isWinner(this.state.squares) === null) {
			squares[i] = this.state.xNext ? 'X' : 'O';
			this.setState({squares: squares, xNext: !this.state.xNext,});
		}
	} */
	
	//adds a square to the page
	renderSquare(i) {
		//return a square with a value given by the squares array
		//adds an onClick method as well
		return (<Square 
			value={this.props.squares[i]} 
			onClick={() => this.props.onClick(i)}/>
		);
	}

    render() {
		/* old code required to render the winner and turn status
		const winner = isWinner(this.state.squares);
		let status = "";
		if (winner) {
			status = "Winner winner chicken dinner! " + winner + " has won!";
		} else {
    		status = 'Next player: ' + (this.state.xNext ? 'X' : 'O');
		} */
		
		//return a div with the tic-tac-toe board with each square rendered
    	return (
      		<div>
        		<div className="board-row">
          			{this.renderSquare(0)}
					{this.renderSquare(1)}
					{this.renderSquare(2)}
				</div>
				<div className="board-row">
					{this.renderSquare(3)}
					{this.renderSquare(4)}
					{this.renderSquare(5)}
				</div>
				<div className="board-row">
					{this.renderSquare(6)}
					{this.renderSquare(7)}
					{this.renderSquare(8)}
				</div>
			</div>
		);
	}
}

class Game extends React.Component {
	//contrcutor called at start
	constructor(props) {
		//necessary super call
		super(props);
		
		//set state
		this.state = {
			//history that contains each state of the board
			history: [{
				squares: Array(9).fill(null),
			}],
			//currently displayed board
			stepNumber: 0,
			//boolean that determines which player goes next
			xNext: true,
		}
	}
	
	//click event handler
	handleClick(i) {
		//discard history past the current step
		const history = this.state.history.slice(0, this.state.stepNumber + 1);
		//get current board state and copy the square values
		const current = history[history.length - 1];
		const squares = current.squares.slice();
		
		//if the clicked square already exists or if there's a winner that's been already determined, do nothing 
		if (squares[i] != null || isWinner(squares) != null) {
			return;
		}
		//add an X or O depending on whose turn it is
		squares[i] = this.state.xNext ? 'X' : 'O';
		
		//set a new state
		this.setState({
			//add the current square layout to a copy of the history object 
			history: history.concat([{
				squares: squares,
			}]),
			//change the current step to the length of the history
			stepNumber: history.length,
			//switch whoever's turn it is
			xNext: !this.state.xNext,
		});
	}
	
	//change steps/time-travel
	jumpTo(step) {
		//reset the state
		this.setState({
			stepNumber: step,
			//odd turns are O, even turns are X
			xNext: (step % 2) === 0,
		});
	}
	
	//render the game
    render() {
		//get the history of states and the current state
		const history = this.state.history;
		const current = history[this.state.stepNumber];
		
		//see if there's a winner; will be null otherwise
		const winner = isWinner(current.squares);
		
		//create a list of moves that have been made for time-traveling purposes
		const moves = history.map((step, move) => {
			//if the move number is 0, then it's the start of the game. 
			const desc = move ? 
					"Go to move #" + move :
					"Go to game start";
			//return the list element, and assign a key based on the current move
			return (
				<li key={move}>
				//add an onClick event to jump to the specified move
					<button onClick = {() => this.jumpTo(move)}>{desc}
					</button>
				</li>
			);
		});
		
		//set status based on whose turn it is or whoever's won
		let status; 
		if (winner) {
			status = "Winner winner chicken dinner! " + winner + " has won!";
		} else {
    		status = 'Next player: ' + (this.state.xNext ? 'X' : 'O');
		}
		
		//return the gameboard, alongside the status and the list of moves made
    	return (
        	<div className="game">
        		<div className="game-board">
          			<Board 
						squares={current.squares}
						//pass the click event handler
						onClick={(i) => this.handleClick(i)}
					/>
        		</div>
        		<div className="game-info">
					<div>{status}</div>
					<ol>{moves}</ol>
        		</div>	
      		</div>
		);
	}
}

// ========================================

ReactDOM.render(
	<Game />,
	document.getElementById('root')
);
