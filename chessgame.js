class ChessGame {
    constructor(fen, gameMode, playerColour) {
        this._chessboard = new Chessboard(fen),  //the game board to operate within
        this._gameMode = gameMode || "pvp", //player-vs-player (pvp) OR player-vs-bot (pvb)
        this._playerColour = playerColour || "white", //the user's colour
        this._selectedSquare = Array(2).fill(null),    //the currently selected piece's square
        this._selectedPieceMoves = null, //the tiles that the current selected piece is attacking
        this.eventHandlers = {  //bind methods. otherwise, 'this' refers to the global variable (this.window). also gives reference so we can remove event listeners
            clickTile: this.clickSquare.bind(this)
        }
    }


    //Getters
    getChessboard() {
        return this._chessboard;
    }
    getGameMode() {
        return this._gameMode;
    }

    getPlayerColour() {
        return this._playerColour;
    }
    getSelectedSquare() {
        return this._selectedSquare;
    }
    getSelectedPieceMoves() {
        return this._selectedPieceMoves;
    }

    //Setters
    setGameMode(newGameMode) {
        this._gameMode = newGameMode;
    }
    setPlayerColour(newPlayerColour) {
        this._playerColour = newPlayerColour;
    }
    setSelectedSquare(newFile,newRank) {
        this._selectedSquare = [newFile,newRank];
    }
    setSelectedPieceMoves(newMoves) {
        this._selectedPieceMoves = newMoves;
    }


    addPieceEventListeners() {
        const boardSquares = document.querySelectorAll(".board-square")
        boardSquares.forEach((boardSquare) => {
            boardSquare.addEventListener("click", this.eventHandlers.clickTile)
        })
    }
    removePieceEventListeners() {
        const boardSquares = document.querySelectorAll(".board-square")
        boardSquares.forEach((boardSquare) => {
            boardSquare.removeEventListener("click", this.eventHandlers.clickTile)
        })
    }

    clickSquare(e) {
        const currentTurn = this.getChessboard().getTurn()
        const playerColour = this.getPlayerColour()
        if(currentTurn!=playerColour) { return } //only allow piece interaction if current player turn

        const clickedFile = e.target.classList.contains("board-piece") ? Number(e.target.parentNode.dataset.boardFile) : Number(e.target.dataset.boardFile)      //to select clicked square file
        const clickedRank = e.target.classList.contains("board-piece") ? Number(e.target.parentNode.dataset.boardRank) : Number(e.target.dataset.boardRank)      //and rank
        const newPiece = this.getChessboard().getSquare(clickedFile,clickedRank).hasPiece
        
        const previousFile = this.getSelectedSquare()[0]
        const previousRank = this.getSelectedSquare()[1]


        //if piece is valid to select
        if(newPiece!=null && newPiece.colour==playerColour) {
            this.setSelectedSquare(clickedFile,clickedRank) //update stored square selected
            const validPieceMoves = this.getChessboard().generatePieceValidMoves(clickedFile,clickedRank)   //generate selected piece's valid moves
            this.setSelectedPieceMoves(validPieceMoves) //update the stored valid piece moves
            this.toggleBoardHighlights()    //toggle highlights
        } else  {
            this.handleMovePiece(previousFile,previousRank,clickedFile,clickedRank)

            this.setSelectedSquare(null,null)
            this.setSelectedPieceMoves(null)
            this.toggleBoardHighlights()
        }

    }
    handleMovePiece(fileFrom,rankFrom,fileTo,rankTo) {
        let validMove = false

        const validMoves = this.getSelectedPieceMoves()
        if(validMoves!=null) {
            validMoves.forEach(move => {
                if(fileTo==move[2] && rankTo==move[3]) { validMove = true }
            })
        }

        if(validMove) {
            this.getChessboard().makeMove(fileFrom,rankFrom,fileTo,rankTo)
            if(this.getGameMode()=="pvp") { 
                this.updateCurrentPlayer() 
            } else if(this.getGameMode()=="pvb" && this.getChessboard().getGameState()=="in-progress") { 
                const best = this.getChessboard().findBestMoveFromCurrentPosition().move
                this.getChessboard().makeMove(best[0],best[1],best[2],best[3])
            }

            this.renderBoard()
        }
    }
    toggleBoardHighlights() {
        //remove any existing move highlights
        const previousMoveSquares = document.querySelectorAll(".highlighted-square")
        if(previousMoveSquares.length>0) {
            previousMoveSquares.forEach(highlightedSquare => {
                highlightedSquare.classList.toggle("highlighted-square")
            })
        }
        //highlight new moves
        const newMoveSquares = this.getSelectedPieceMoves()
        if(newMoveSquares!=null) {
            newMoveSquares.forEach(validMove => {
                const file = validMove[2]
                const rank = validMove[3]
                const validSquareHtml = document.querySelector(`[data-board-file='${file}'][data-board-rank='${rank}']`)
                validSquareHtml.classList.toggle("highlighted-square")
            })
        }

        //remove highlighted selected square
        const previousSelectedSquare = document.querySelector(".selected-square")
        if(previousSelectedSquare!=null) {
            previousSelectedSquare.classList.toggle("selected-square")
        }
        //highlight selected piece
        const newSelectedSquare = this.getSelectedSquare()
        if(newSelectedSquare[0]!=null || newSelectedSquare[1]!=null) {
            const newSquareHtml = document.querySelector(`[data-board-file='${newSelectedSquare[0]}'][data-board-rank='${newSelectedSquare[1]}']`)
            newSquareHtml.classList.toggle("selected-square")
        }

        //remove any checked king square
        const kingCheckedHighlight = document.querySelector(".checked-king")
        if(kingCheckedHighlight!=null) {
            kingCheckedHighlight.classList.toggle("checked-king")
        }
        //highlight checked king
        if(this.getChessboard().getCurrentKingIsInCheck()) {
            const kingPosition = this.getChessboard().getTurn()=="white" ? this.getChessboard().getWhiteKingPosition() : this.getChessboard().getBlackKingPosition()
            const kingHtml = document.querySelector(`[data-board-file='${kingPosition[0]}'][data-board-rank='${kingPosition[1]}']`)
            kingHtml.classList.toggle("checked-king")
        }
    }


    //toggle current player for player-player game mode
    updateCurrentPlayer() {
        const gameMode = this.getGameMode()

        if(gameMode=="pvp") {
            const currentTurn = this.getChessboard().getTurn()
            this.setPlayerColour(currentTurn) 
        }
    }



    //Render Board
    createBoardHtml() {
        let boardHtml = []
        for(let file=1; file<=8; file++) {
            const fileHtml = []
            this.getChessboard().getBoardSquares()[file-1].forEach(square => {
                let pieceHtml = "";
                if(square.hasPiece) {
                    pieceHtml = 
                    `<p class="board-piece" draggable="true" data-piece-type=${square.hasPiece.type} data-piece-colour=${square.hasPiece.colour}>
                        ${square.hasPiece.icon}
                    </p>`
                }
    
                const squareHtml = 
                `<div class="board-square" data-square-position=[${square.file},${square.rank}] data-square-coordinate=${square.coordinate} data-square-colour=${square.colour} data-board-file=${square.file} data-board-rank=${square.rank}>
                    ${pieceHtml}
                    <p class="square-coordinate">
                        ${square.coordinate}
                    </p>
                </div>`

                fileHtml.push(squareHtml)
            })
            boardHtml.push(`<div class="board-file"">${fileHtml.reverse().join("")}</div>`)
        }
        return boardHtml.join("")
    }
    renderBoard() {
        const boardHtml = this.createBoardHtml()
        const chessboardEl = document.querySelector("#chessboard")
        chessboardEl.innerHTML = boardHtml

        this.toggleBoardHighlights()
        this.removePieceEventListeners()

        const gameState = this.getChessboard().getGameState()
        const gameStateEl = document.querySelector("#game-state")
        gameStateEl.innerHTML = gameState

        if(gameState=="in-progress") { 
            this.addPieceEventListeners() 
        } else {
            gameStateEl.style.visibility = "visible"
        }
        
        
        const fen = this.getChessboard().getFen()
        document.querySelector("#fen").innerHTML = fen
    }




    //CREATE GAME
    startGame() {
        this.getChessboard().initialiseBoard()

        if(this.getGameMode()=="pvb") {
            const botColour = this.getPlayerColour()=="white" ? "black" : "white"
            if(this.getChessboard().getTurn()==botColour) {
                const best = this.getChessboard().findBestMoveFromCurrentPosition().move
                this.getChessboard().makeMove(best[0],best[1],best[2],best[3])
            }
        }

        this.renderBoard()
    }
}