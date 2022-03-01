
# Chess Game

<br/>

## About
* Fully-functional chess engine and chess game, following almost all rules of chess
* Includes:
    * FEN importing
    * FEN generating
    * Handles, tracks and allows 'en passant'
    * Handles, tracks and allows 'castling'
    * Tracks current turn
    * Tracks count of 'half-moves' (for 50-move rule)
    * Tracks count of 'full-moves'
    * Disallows illegal moves (e.g. moving a pinned piece), by using 'pseudo-move' validation style
    * Tracks game state (draw or win)
    * Player-vs-Player and Player-vs-Bot game options
* Limitations:
    * Does not track 3-fold repetition rule
    * Does not track insufficient material rule
    * Computer Bot is very weak and only uses basic logic
    * This chess engine was not built for performance (hence the 'psuedo-move' generation), so a super strong Bot is likely not possible

<br/>
<br/>

## Create Game in Browser

```js
var chessgame = new Chessgame(FEN, Game Mode, Player Colour)
```
* FEN: any valid [FEN Notation](https://en.wikipedia.org/wiki/Forsyth%E2%80%93Edwards_Notation) string
    * e.g. default is:<br/>
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
* Game Mode: 
    * "pvp" for Player-vs-Player
    * "pvb" for Player-vs-Bot
* Player Colour:
    * "white"
    * "black"
* **Note:** creating an instance without any arguments will create a standard default starting position chessboard
<br/>
<br/>

```js
chessgame.startGame()
```

* Generates the board and displays the game

<br/>
<br/>

## Using Internal Chessboard
> Note: <br/>
> * The internally chessboard is stored as a class instance within a chessgame instance
> * So, to call these methods, use:
> `chessgame.getChessboard().<method-name>`
### **Board Structure:**
* [ Array(8), Array(8), Array(8), Array(8), Array(8), Array(8), Array(8), Array(8) ]
* where each internal array represents a file
    * 0th index file = File "A"
    * 0th index rank = Rank "1"
* Example: ```this._boardsquares[0][5]``` returns the 0th index file and 5th index rank (i.e. square A6)
* **Note:** for simplicity, ```this.getBoardSquares(file,rank)``` uses the exact file/rank, not the index. So, ```this.getBoardSquares(2,3)``` returns square B3
<br/>
<br/>

```js
createEmptyChessboard()
```

* Generates an empty board and stores in ```this._boardSquares```
<br/>
<br/>

```js
importFen()
```

* Uses the current instance's FEN value, and fills the board with the appropriate pieces
* Also sets the board values appropriately (e.g. current turn to play, castle rights, etc.)
<br/>
<br/>

```js
initialiseBoard()
```

* Combines the common process of `createEmptyChessboard()` and `importFEN()`
<br/>
<br/>

```js
movePiece(fileFrom,rankFrom,fileTo,rankTo,promoteTo)
```

* Simple movement of piece from one square to another
* fileFrom,rankFrom,fileTo,rankTo:
    * integer values representing actual file/rank movements
* promoteTo:
    * string value that specifies what piece to promote a pawn to (i.e. "queen", "rook", "knight", "bishop")
* Example: ```this.movePiece(1,7,1,8,"queen")``` would promote a pawn to queen, onto square A8 (where A7 was a pawn)
<br/>
<br/>

```js
makeMove(fileFrom,rankFrom,fileTo,rankTo,promoteTo)
```

* A robust version of `movePiece()`, where all considerations of the board's state are updated (e.g. current FEN string, castle rights, etc.)
<br/>
<br/>

```js
generatePiecePseudoMoves(fileFrom,rankFrom)
```

* Generates all possible moves for a piece on the board
<br/>
<br/>

```js
generatePieceValidMoves(fileFrom,rankFrom)
```

* Uses the pseudo-moves generated for a piece, and checks whether each move is valid
* Prevents invalid-moves
<br/>
<br/>

```js
printBoard(fileFrom,rankFrom)
```

* Log to console the current internal board state
    * Example output:
    ```
    8 r n b q k b n r 
    7 p p p p p p p p 
    6 . . . . . . . . 
    5 . . . . . . . . 
    4 . . . . . . . . 
    3 . . . . . . . . 
    2 P P P P P P P P 
    1 R N B Q K B N R 
      a b c d e f g h
    ```
    * *board is presented with FEN notation*
<br/>
<br/>

```js
printAttackedSquares(attackingColour)
```

* Log to console all squares currently being attacked by a specified attacking colour ("white"/"black")
    * Example output: 
    ```
    8 . . . . . . . . 
    7 . . . . . . . . 
    6 . . . . . . . x 
    5 . x x x x . x . 
    4 x x . x x x x x 
    3 x x . . x . . x 
    2 . . x x . . . . 
    1 . x . . . x x . 
      a b c d e f g h
    ```
    * *'x' marks an attacked square*
<br/>
<br/>
<br/>

## Support
* There is no intention to continue with this project, apart from the possibility of improving the Computer Bot's strength in the future
<br/>
<br/>

## Usage & Licensing
* MIT License

<br/>
<br/>

#### *Author: Marco Buontempo (2022)*
