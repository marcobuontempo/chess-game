class Chessboard {
    constructor(fen) {
        this._fen = fen || "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        this._turn = "",
        this._castleRights = Array(4).fill(null),
        this._enPassantSquare = Array(2).fill(null),
        this._halfMoveCount = 0,
        this._fullMoveCount = 0,
        this._boardSquares = [],
        this._pieceIcons = { k:"♚", q:"♛", r:"♜", b:"♝", n:"♞", p:"♟", 
                             K:"♔", Q:"♕", R:"♖", B:"♗", N:"♘", P:"♙", },
        this._whiteKingPosition = [],
        this._blackKingPosition = [],
        this._currentKingIsInCheck = false  //whether the current turn colour's king is in check
    }




    /*
    =================
    =====GETTERS=====
    =================
    */
    getFen() {
        return this._fen;
    }
    getTurn() {
        return this._turn;
    }
    getCastleRights() {
        return this._castleRights;
    }
    getEnPassantSquare() {
        return this._enPassantSquare;
    }
    getHalfMoveCount() {
        return this._halfMoveCount;
    }
    getFullMoveCount() {
        return this._fullMoveCount;
    }
    getBoardSquares() {
        return this._boardSquares;
    }
    getSquare(file,rank) {
        return this._boardSquares[file-1][rank-1];
    }
    getPieceIcons() {
        return this._pieceIcons;
    }
    getWhiteKingPosition() {
        return this._whiteKingPosition;
    }
    getBlackKingPosition() {
        return this._blackKingPosition;
    }
    getCurrentKingIsInCheck() {
        return this._currentKingIsInCheck;
    }




    /*
    =================
    =====SETTERS=====
    =================
    */
    setFen(newFen) {
        this._fen = newFen;
    }
    setTurn(newTurn) {
        this._turn = newTurn;
    }
    setCastleRights(newCastleRights) {
        this._castleRights = newCastleRights;
    }
    setEnPassantSquare(newEnPassantSquare) {
        this._enPassantSquare = newEnPassantSquare;
    }
    setHalfMoveCount(newHalfMoveCount) {
        this._halfMoveCount = newHalfMoveCount;
    }
    setFullMoveCount(newFullMoveCount) {
        this._fullMoveCount = newFullMoveCount;
    }
    setBoardSquares(newBoardSquares) {
        this._boardSquares = newBoardSquares;
    }
    setSquarePiece(file,rank,newPiece) {
        this._boardSquares[file-1][rank-1].hasPiece = newPiece;
    }
    setWhiteKingPosition(newFile,newRank) {
        this._whiteKingPosition = [newFile,newRank];
    }
    setBlackKingPosition(newFile,newRank) {
        this._blackKingPosition = [newFile,newRank];
    }
    setCurrentKingIsInCheck(isInCheck) {
        this._currentKingIsInCheck = isInCheck;
    }





    /*
    ==================
    ==CONVERT VALUES==
    ==================
    */
   //get piece type from fen key input
    convertFenPieceToName(fenKey) {
        switch(fenKey.toLowerCase()) {
            case "r": return "rook"
            case "n": return "knight"
            case "b": return "bishop"
            case "q": return "queen"
            case "k": return "king"
            case "p": return "pawn"
        }
    }
    //get fen key from piece type input
    convertPieceTypeToFenKey(colour, type) {
        let fenKey
        switch(type.toLowerCase()) {
            case "rook": fenKey = "r"; break
            case "knight": fenKey = "n"; break
            case "bishop": fenKey = "b"; break
            case "queen": fenKey = "q"; break
            case "king": fenKey = "k"; break
            case "pawn": fenKey = "p"; break
        }
        if(colour=="white") { fenKey = fenKey.toUpperCase() }
        return fenKey
    }
    //converts square file/rank to coordinate string
    convertSquareToCoordinate(file, rank) {
        let fileLetter;
        switch(file) {
            case(1): fileLetter="A"; break
            case(2): fileLetter="B"; break
            case(3): fileLetter="C"; break
            case(4): fileLetter="D"; break
            case(5): fileLetter="E"; break
            case(6): fileLetter="F"; break
            case(7): fileLetter="G"; break
            case(8): fileLetter="H"; break
        }
        return fileLetter+rank
    }
    //converts square coordinate to file/rank
    convertCoordinateToSquare(coordinate) {
        let fileLetter = coordinate[0].toUpperCase()
        let file
        switch(fileLetter) {
            case("A"): file=1; break
            case("B"): file=2; break
            case("C"): file=3; break
            case("D"): file=4; break
            case("E"): file=5; break
            case("F"): file=6; break
            case("G"): file=7; break
            case("H"): file=8; break
        }

        const rank = Number(coordinate[1])
        return [file,rank]
    }





    /*
    =================
    ==CREATE  BOARD==
    =================
    */
    //generate square colour
    generateSquareColour(file,rank) {
        if((file%2==0 && rank%2!=0) || (file%2!=0 && rank%2==0)) {
            return "white"
        } else {
            return "black"
        }
    }
    //create board square
    createSquare(ID, coordinate, colour, file, rank, hasPiece) {
        return {
            ID,
            coordinate,
            colour,
            file,
            rank,
            hasPiece
        }
    }
    //create a board piece
    createPiece(colour,type) {
        const fenPieceKey = this.convertPieceTypeToFenKey(colour,type)
        return {
            fenPieceKey,
            colour,
            type,
            icon: this.getPieceIcons()[fenPieceKey]
        }
    }
    //create empty chessboard
    createEmptyChessboard() {
        const boardSquares = []
        let squareId = 0
        for(let file=1; file<=8; file++) {
            const fileArray = []
            for(let rank=1; rank<=8; rank++) {
                const squareCoordinate = this.convertSquareToCoordinate(file,rank)
                const squareColour = this.generateSquareColour(file,rank)
                const hasPiece = null
                const square = this.createSquare(squareId,squareCoordinate,squareColour,file,rank,hasPiece)
                fileArray.push(square)
                squareId++
            }
            boardSquares.push(fileArray)
        }
        this.setBoardSquares(boardSquares)
    }






    /*
    =================
    ===IMPORT  FEN===
    =================
    */
    //set the chessboard squares to match the current stored fen position
    importFen() {
        try {
            const importedFen = this.getFen().split(" ");
            
            //board position
            const fenPosition = importedFen[0].split("/").reverse()
            for(let rank=1;rank<=8;rank++) {
                let fenPieceIndex = 0
                for(let file=1;file<=8;file++) {
                    const fenPiece = fenPosition[rank-1][fenPieceIndex]
                    if(fenPiece && isNaN(fenPiece)) { 
                        const colour = fenPiece==fenPiece.toUpperCase() ? "white" : "black"
                        const type = this.convertFenPieceToName(fenPiece)
                        const piece = this.createPiece(colour,type)
                        this.setSquarePiece(file,rank,piece)
                        switch(fenPiece) {
                            case "K": this.setWhiteKingPosition(file,rank); break
                            case "k": this.setBlackKingPosition(file,rank); break
                        }
                    } else {
                        file+=Number(fenPiece)-1    //offset the file position to skip the blank tiles. -1 as it is the count to skip the tiles *after* this current one being checked
                    }
                    fenPieceIndex+=1
                }
            }

            //current turn
            const fenTurn = importedFen[1]
            let newTurn
            switch(fenTurn) {
                case "w": newTurn = "white"; break
                case "b": newTurn = "black"; break
            }
            this.setTurn(newTurn)

            //castle rights
            const fenCastle = importedFen[2]
            const newCastle = Array(4).fill(null)
            if(fenCastle.includes("K")) { newCastle[0]="K" }
            if(fenCastle.includes("Q")) { newCastle[1]="Q" }
            if(fenCastle.includes("k")) { newCastle[2]="k" }
            if(fenCastle.includes("q")) { newCastle[3]="q" }
            this.setCastleRights(newCastle)

            //en passant coordinate
            const fenEnPassant = importedFen[3]
            if(fenEnPassant!="-") {
                const newEnPassant = this.convertCoordinateToSquare(fenEnPassant)
                this.setEnPassantSquare(newEnPassant)
            }

            //halfmove counter
            const fenHalfMove = importedFen[4]
            this.setHalfMoveCount(Number(fenHalfMove))
        
            //fullmove counter
            const fenFullMove = importedFen[5]
            this.setFullMoveCount(Number(fenFullMove))

            //is current king in check
            const currentColour = fenTurn=="w" ? "white" : "black"
            const currentKingPosition = fenTurn=="w" ? this.getWhiteKingPosition() : this.getBlackKingPosition()
            const isInCheck = this.isKingInCheck(currentKingPosition[0],currentKingPosition[1],currentColour)
            this.setCurrentKingIsInCheck(isInCheck)
        }
        catch (error)
        {
            console.log("Invalid FEN")
        }
    }




    /*
    =================
    ===FEN HELPERS===
    =================
    */
    //add 1 to half move counter
    addHalfMoveCount() {
        this._halfMoveCount+=1;
    }
    //reset half move counter
    resetHalfMoveCount() {
        this._halfMoveCount=0;
    }
    //add 1 to full move counter
    addFullMoveCount() {
        this._fullMoveCount+=1;
    }
    //reset full move counter
    resetFullMoveCount() {
        this._fullMoveCount=0;
    }



    /*
    =================
    ===CREATE  FEN===
    =================
    */
    //create fen from current position
    generateCurrentFenPosition() {
        const fenArray = []
        let rankNotation = ""

        for(let rank=1; rank<=8; rank++) {
            let emptySquareCount = 0;
            for(let file=1; file<=8; file++) {
                const piece = this.getSquare(file,rank).hasPiece
                if(piece) {
                    if(emptySquareCount>0) { rankNotation+=emptySquareCount; emptySquareCount = 0 }
                    rankNotation+=piece.fenPieceKey
                } else {
                    emptySquareCount += 1
                }
            }
            if(emptySquareCount>0) { rankNotation+=emptySquareCount }
            fenArray.push(rankNotation)
            rankNotation = ""
        }

        const newFenPosition = fenArray.reverse().join("/");
        return newFenPosition
    }





    /*
    =================
    ===PRINT BOARD===
    =================
    */
    //print current board position to console
    printBoard() {
        let boardString = ""
        for(let rank=8;rank>=1;rank--) {
            boardString+=`${rank} `
            for(let file=1;file<=8;file++) {
                if(this.getSquare(file,rank).hasPiece!=null) {
                    boardString+=`${this.getSquare(file,rank).hasPiece.icon} `
                } else {
                    boardString+=". "
                }
            }
            boardString+="\n"
        }
        boardString+="  a b c d e f g h"
        console.log(boardString)
    }




    
    /*
    =================
    ===MOVE PIECES===
    =================
    */
    //move piece object from one square to another
    movePiece(fileFrom,rankFrom,fileTo,rankTo) {
        const pieceFrom = this.getSquare(fileFrom,rankFrom).hasPiece
        this.setSquarePiece(fileTo,rankTo,pieceFrom)
        this.setSquarePiece(fileFrom,rankFrom,null)

        if(pieceFrom.type=="king") {
            if(pieceFrom.colour=="white") {
                this.setWhiteKingPosition(fileTo,rankTo)
            } else if (pieceFrom.colour=="black") {
                this.setBlackKingPosition(fileTo,rankTo)
            }
        }
    }
    //check if file/rank is on the edge of the board when scanning a direction
    isOnBoardEdge(direction,file,rank) {
        let onEdge = false
        switch(direction) {
            case("A-H"): if(file==8) onEdge=true; break
            case("H-A"): if(file==1) onEdge=true; break
            case("1-8"): if(rank==8) onEdge=true; break
            case("8-1"): if(rank==1) onEdge=true; break
            case("A1-H8"): if(file==8 || rank==8) onEdge=true; break
            case("A8-H1"): if(file==8 || rank==1) onEdge=true; break
            case("H1-A8"): if(file==1 || rank==8) onEdge=true; break
            case("H8-A1"): if(file==1 || rank==1) onEdge=true; break
        }
        return onEdge
    }
    //check whether pieces are of different colours
    isPieceCapturable(fileFrom,rankFrom,fileTo,rankTo) {
        const tileFrom = this.getSquare(fileFrom,rankFrom)
        const tileTo = this.getSquare(fileTo,rankTo)
        if(tileFrom.hasPiece.colour != tileTo.hasPiece.colour) {
            return true
        } else {
            return false
        }
    }
    //generate the moves in a given direction   ---  directions: A-H, H-A, 1-8, 8-1, A1-H8, A8-H1, H1-A8, H8-A1
    generateDirectionMoves(direction,fileFrom,rankFrom) { 
        const moves = []

        let count = 1
        let fileDirection = 0
        let rankDirection = 0
        let hasPiece = false

        switch(direction) {
            case("A-H"): fileDirection=1; break
            case("H-A"): fileDirection=-1; break
            case("1-8"): rankDirection=1; break
            case("8-1"): rankDirection=-1; break
            case("A1-H8"): fileDirection=1; rankDirection=1; break
            case("A8-H1"): fileDirection=1; rankDirection=-1; break
            case("H1-A8"): fileDirection=-1; rankDirection=1; break
            case("H8-A1"): fileDirection=-1; rankDirection=-1; break
        }

        if(!this.isOnBoardEdge(direction,fileFrom,rankFrom)) {
            while(!hasPiece) {
                const fileTo = fileFrom+(count*fileDirection)
                const rankTo = rankFrom+(count*rankDirection)
                const tileToCheck = this.getSquare(fileTo,rankTo)
                if(tileToCheck.hasPiece!=null) {
                    hasPiece = true
                    if(this.isPieceCapturable(fileFrom,rankFrom,fileTo,rankTo)) {
                        moves.push([fileTo,rankTo])
                    }
                } else {
                    moves.push([fileTo,rankTo])
                    count++
                }
                if(this.isOnBoardEdge(direction,fileTo,rankTo)) { break }
            }
        }
        return moves
    }

    generateRookMoves(file,rank) {
        const moves =  this.generateDirectionMoves("A-H",file,rank).concat(
                        this.generateDirectionMoves("H-A",file,rank),
                        this.generateDirectionMoves("1-8",file,rank),
                        this.generateDirectionMoves("8-1",file,rank));
        return moves
    }
    generateBishopMoves(file,rank) {
        const moves = this.generateDirectionMoves("A1-H8",file,rank).concat(
                        this.generateDirectionMoves("A8-H1",file,rank),
                        this.generateDirectionMoves("H1-A8",file,rank),
                        this.generateDirectionMoves("H8-A1",file,rank));
        return moves
    }
    generateQueenMoves(file,rank) {
        const moves = this.generateDirectionMoves("A-H",file,rank).concat(
                      this.generateDirectionMoves("H-A",file,rank),
                      this.generateDirectionMoves("1-8",file,rank),
                      this.generateDirectionMoves("8-1",file,rank),
                      this.generateDirectionMoves("A1-H8",file,rank),
                      this.generateDirectionMoves("A8-H1",file,rank),
                      this.generateDirectionMoves("H1-A8",file,rank),
                      this.generateDirectionMoves("H8-A1",file,rank));
        return moves
    }
    generateKnightMoves(file,rank) {
        const moves = []

        //possible directions that knight can jump
        const fileOffset = [-2, -1,  1,  2, -2, -1,  1,  2]
        const rankOffset = [-1, -2, -2, -1,  1,  2,  2,  1]

        for(let i=0;i<8;i++) {
            const fileTo = file+fileOffset[i];
            const rankTo = rank+rankOffset[i];
            if(fileTo>8 || fileTo<1 || rankTo>8 || rankTo<1) { continue } //skip iteration if out of board bounds

            const squareTo = this.getSquare(fileTo,rankTo)

            if(squareTo.hasPiece!=null) {
                if(this.isPieceCapturable(file,rank,fileTo,rankTo)) { moves.push([fileTo,rankTo]) }
            } else {
                moves.push([fileTo,rankTo])
            }
        }
        return moves
    }
    generatePawnMoves(fileFrom,rankFrom) {
        const moves = []

        const pieceColour = this.getSquare(fileFrom,rankFrom).hasPiece.colour
        const colourDirection = pieceColour=="white" ? 1 : -1 //1 for white (up), -1 for black (down)
        
        const singlePush = rankFrom+colourDirection
        const doublePush = rankFrom+(colourDirection*2)
        const leftCapture = fileFrom-1
        const rightCapture = fileFrom+1

        if(singlePush>=1 && singlePush<=8) {
            let tileTo = this.getSquare(fileFrom,singlePush)
            //single pawn push
            if(tileTo.hasPiece==null) { 
                moves.push([fileFrom,singlePush])
                //double pawn push
                if((pieceColour=="white" && rankFrom==2) || (pieceColour=="black" && rankFrom==7)) {
                    const tileTo = this.getSquare(fileFrom,doublePush)
                    if(tileTo.hasPiece==null) { moves.push([fileFrom, doublePush]) }
                }
            }
            //left capture
            if(leftCapture>=1 && leftCapture<=8) {
                tileTo = this.getSquare(leftCapture, singlePush)
                if(tileTo.hasPiece!=null && this.isPieceCapturable(fileFrom,rankFrom,leftCapture,singlePush)) { moves.push([leftCapture, singlePush]) }
            }
            //right capture
            if(rightCapture>=1 && rightCapture<=8) {
                tileTo = this.getSquare(rightCapture, singlePush)
                if(tileTo.hasPiece!=null && this.isPieceCapturable(fileFrom,rankFrom,rightCapture,singlePush)) { moves.push([rightCapture, singlePush]) }
            }
            //en passant
            const enPassantMove = this.calculateEnPassantMove(fileFrom,rankFrom,singlePush,pieceColour)
            if(enPassantMove!=null) { moves.push(enPassantMove) }
        }
        return moves
    }
    generateKingMoves(fileFrom,rankFrom) {
        const moves = []

        //Regular Moves
        const fileOffset = [-1, -1, -1,  0,  0,  1,  1,  1]
        const rankOffset = [-1,  0,  1, -1,  1, -1,  0,  1]
        for(let i=0; i<8; i++) {
            const fileTo = fileFrom+fileOffset[i];
            const rankTo = rankFrom+rankOffset[i];
            if(fileTo>8 || fileTo<1 || rankTo>8 || rankTo<1) { continue } //skip iteration if out of board bounds
            
            const tileToCheck = this.getSquare(fileTo,rankTo)
            if(tileToCheck.hasPiece==null) {
                moves.push([fileTo,rankTo])
            } else {
                if(this.isPieceCapturable(fileFrom,rankFrom,fileTo,rankTo)) { moves.push([fileTo,rankTo]) }
            }
        }
        return moves
    }



    /*
    ============================
    ====SPECIAL MOVE HELPERS====
    ============================
    */
    //en passant moves
    calculateEnPassantMove(fileFrom, rankFrom, singlePush, pieceColour) {
        if((pieceColour=="white" && rankFrom==5) || (pieceColour=="black" && rankFrom==4)) {
            const epFile = this.getEnPassantSquare()[0]
            const epRank = this.getEnPassantSquare()[1]

            if((fileFrom+1==epFile || fileFrom-1==epFile) && singlePush==epRank) {
                return [epFile,epRank]
            }
        }
        return null
    }
    //CASTLING




    /*
    ============================
    ===PRINT ATTACKED SQUARES===
    ============================
    */
    //mark board squares with 'x' for any coordinates attacked
    printAttackedSquares(attackingColour) {
        const attackedSquares = this.generateAllAttackedSquares(attackingColour)
        const markedSquares = new Array(8).fill(".").map(() => new Array(8).fill("."))

        attackedSquares.forEach(attackedSquare => {
            const file = attackedSquare[0]-1
            const rank = attackedSquare[1]-1
            markedSquares[file][rank] = "x"
        })

        let boardString = ""
        for(let rank=8;rank>=1;rank--) {
            boardString+=`${rank} `
            for(let file=1;file<=8;file++) {
                boardString+=`${markedSquares[file-1][rank-1]} `
            }
            boardString+="\n"
        }
        boardString+="  a b c d e f g h"
        console.log(boardString)
    }





    /*
    ===================
    ==MOVE GENERATION==
    ===================
    */
    //check whether king is attacked
    isKingInCheck(kingFile,kingRank,kingColour) {
        let isInCheck = false
        const attackedSquares = kingColour=="white" ? this.generateAllAttackedSquares("black") : this.generateAllAttackedSquares("white")
        attackedSquares.forEach(square => {
            if(kingFile==square[0] && kingRank==square[1]) {
                isInCheck = true
            }
        })
        return isInCheck
    }
    //check whether suggested pseudo-moves will expose the king (and therefore illegal move)
    isValidMove(fileFrom,rankFrom,fileTo,rankTo) {
        //create a board copy to test on
        const currentFen = this.getFen()
        const boardCopy = new Chessboard(currentFen)
        boardCopy.createEmptyChessboard()
        boardCopy.importFen()

        //move piece and check validate that king is not in check
        const colourFrom = boardCopy.getSquare(fileFrom,rankFrom).hasPiece.colour
        boardCopy.movePiece(fileFrom,rankFrom,fileTo,rankTo)
        const kingPosition = colourFrom=="white" ? boardCopy.getWhiteKingPosition() : boardCopy.getBlackKingPosition()
        return !boardCopy.isKingInCheck(kingPosition[0],kingPosition[1],colourFrom)
    }
    //generate all possible moves for a piece, whether illegal or not
    generatePiecePseudoMoves(fileFrom,rankFrom) {
        const pieceType = this.getSquare(fileFrom,rankFrom).hasPiece.type
        let pseudoMoves = [];

        switch(pieceType) {
            case("rook"): pseudoMoves=this.generateRookMoves(fileFrom,rankFrom); break
            case("bishop"): pseudoMoves=this.generateBishopMoves(fileFrom,rankFrom); break
            case("queen"): pseudoMoves=this.generateQueenMoves(fileFrom,rankFrom); break
            case("king"): pseudoMoves=this.generateKingMoves(fileFrom,rankFrom); break
            case("knight"): pseudoMoves=this.generateKnightMoves(fileFrom,rankFrom); break
            case("pawn"): pseudoMoves=this.generatePawnMoves(fileFrom,rankFrom); break
        }

        return pseudoMoves
    }
    //generate all attacked squares of specific colour
    generateAllAttackedSquares(attackingColour) {
        let attackedSquares = []
        this.getBoardSquares().forEach(file => {
            file.forEach(square => {
                if(square.hasPiece && square.hasPiece.colour==attackingColour) { 
                    attackedSquares = attackedSquares.concat(this.generatePiecePseudoMoves(square.file,square.rank))
                }
            })
        })
        return attackedSquares
    }
    //generate all valid moves for a piece (removes illegal pseudo moves)
    generatePieceValidMoves(fileFrom,rankFrom) {
        const pseudoMoves = this.generatePiecePseudoMoves(fileFrom,rankFrom)
        const validMoves = []

        pseudoMoves.forEach(move => {
            if(this.isValidMove(fileFrom,rankFrom,move[0],move[1])) { validMoves.push([move[0],move[1]]) }
        })
        return validMoves
    }
    //generate all valid moves of a specific colour
    generateAllValidMoves(attackingColour) {
        let attackedSquares = []
        this.getBoardSquares().forEach(file => {
            file.forEach(square => {
                if(square.hasPiece && square.hasPiece.colour==attackingColour) { 
                    attackedSquares = attackedSquares.concat(this.generatePieceValidMoves(square.file,square.rank))
                }
            })
        })
        return attackedSquares
    }
}






class ChessGame {
    constructor(fen) {
        this._chessboard = new Chessboard(fen),  //the game board to operate within
        this._gameState = "in-progress",    //current game state : in-progress, checkmate: white wins, checkmate: black wins, draw: stalemate, draw: 3-fold repetition, draw: 50 move rule
        this._selectedSquare = [],    //the currently selected piece's square
        this._selectedPieceMoves = [], //the tiles that the current selected piece is attacking
        this.eventHandlers = {  //bind methods. otherwise, 'this' refers to the global variable (this.window). also gives reference so we can remove event listeners
            clickTile: this.clickTile.bind(this)
        }
    }


    //Getters
    getChessboard() {
        return this._chessboard;
    }
    getGameState() {
        return this._gameState;
    }
    getCurrentTurn() {
        return this._currentTurn;
    }
    getNextTurn() {
        return this._currentTurn=="white" ? "black" : "white";
    }
    getSelectedSquare() {
        return this._selectedSquare;
    }
    getSelectedPieceMoves() {
        return this._selectedPieceMoves;
    }
    getCurrentKingIsInCheck() {
        return this._currentKingIsInCheck;
    }


    //Setters
    setCurrentTurn(newColour) {
        this._currentTurn = newColour;
    }
    setGameState(newGameState) {
        this._gameState = newGameState;
    }
    setSelectedSquare(newFile,newRank) {
        this._selectedSquare = [newFile,newRank];
    }
    setSelectedPieceMoves(newMoves) {
        this._selectedPieceMoves = newMoves;
    }
    setCurrentKingIsInCheck(isChecked) {
        this._currentKingIsInCheck = isChecked;
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
    clickTile(e) {
        const newTileHtml = e.target.classList.contains("board-piece") ? e.target.parentNode : e.target; //to select tile that the piece is on
        const newFile = Number(newTileHtml.dataset.boardFile)
        const newRank = Number(newTileHtml.dataset.boardRank)
        const newSelectedSquareObject = this.getChessboard().getSquare(newFile,newRank) 
        const newSelectedValue = `${newFile}${newRank}`
        const previousSelectedValue = this.getSelectedSquare().join("")
        const previousSquareHtml = document.querySelector(`[data-board-file='${previousSelectedValue[0]}'][data-board-rank='${previousSelectedValue[1]}']`)

        if(!previousSelectedValue && newSelectedSquareObject.hasPiece!=null && newSelectedSquareObject.hasPiece.colour==this.getCurrentTurn()) { 
            //if no previous piece selected, select newly clicked piece
            this.setSelectedSquare(newFile,newRank)
            newTileHtml.classList.toggle("selected-square")
            const validMoves = this.getChessboard().generatePieceValidMoves(newFile,newRank)
            this.setSelectedPieceMoves(validMoves)
            this.toggleValidMovesHighlight(validMoves)
        } else if (previousSelectedValue==newSelectedValue) {
            //if same piece is re-selected, disable the piece's selection
            this.setSelectedSquare([])
            newTileHtml.classList.toggle("selected-square")
            const validMoves = this.getChessboard().generatePieceValidMoves(newFile,newRank)
            this.setSelectedPieceMoves(validMoves)
            this.toggleValidMovesHighlight(validMoves)
        } else if (previousSelectedValue!=newSelectedValue && newSelectedSquareObject.hasPiece!=null && newSelectedSquareObject.hasPiece.colour==this.getCurrentTurn()) {    
            //if new valid piece is selected, un-select previous and re-select new
            this.setSelectedSquare(newFile,newRank)
            previousSquareHtml.classList.toggle("selected-square")
            newTileHtml.classList.toggle("selected-square")

            this.toggleValidMovesHighlight(this.getSelectedPieceMoves())

            const validMoves = this.getChessboard().generatePieceValidMoves(newFile,newRank)
            this.setSelectedPieceMoves(validMoves)
            this.toggleValidMovesHighlight(validMoves)
        } else {
            //otherwise, move piece
            this.handleMovePiece(newFile,newRank)
        }
    }
    toggleValidMovesHighlight(pieceMoves) {
        pieceMoves.forEach(validMove => {
            const file = validMove[0]
            const rank = validMove[1]
            const validTileHtml = document.querySelector(`[data-board-file='${file}'][data-board-rank='${rank}']`)
            validTileHtml.classList.toggle("highlighted-square")
        })
    }
    handleMovePiece(boardFileTo,boardRankTo) { 
        // const boardFileFrom = this.getSelectedTile()[0]
        // const boardRankFrom = this.getSelectedTile()[1]
        // this.getSelectedPieceMoves().forEach(validMove => {
        //     const boardFileValid = validMove[0]
        //     const boardRankValid = validMove[1]
        //     if(boardFileTo==boardFileValid && boardRankTo==boardRankValid) {
        //         const pieceFrom = this.getChessboard().getTile(boardFileFrom,boardRankFrom).hasPiece
        //         const pieceTo = this.getChessboard().getTile(boardFileTo,boardRankTo).hasPiece
        //         this.movePiece(boardFileFrom,boardRankFrom,boardFileTo,boardRankTo)
        //         this.setupNextTurn(pieceFrom,pieceTo)
        //         this.updateGameState(this.getCurrentTurn())
        //         this.updateBoardDisplay()
        //     }
        // })
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
                `<div class="board-square" data-square-coordinate=${square.coordinate} data-square-colour=${square.colour} data-board-file=${square.file} data-board-rank=${square.rank}>
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
    }
}




// ==== T E S T ====
// test = new Chessboard("rnbqkbnr/ppp2ppp/8/8/Q7/8/PPPPPPPP/RNBQKBNR")
// test.createEmptyChessboard()
// test.importFen()
// test.printBoard()

game = new ChessGame("rnbqkbnr/pppp1ppp/8/4pP2/8/8/PPPPPPPP/RNBQKBNR w KQkq e6 0 1")
game.getChessboard().createEmptyChessboard()
game.getChessboard().importFen()
game.renderBoard()
game.addPieceEventListeners()