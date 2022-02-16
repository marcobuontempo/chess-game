class Chessboard {
    constructor(fen) {
        this._fen = fen || "rnbbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        this._turn = "white",
        this._castleRights = ["K","Q","k","q"],
        this._enPassantSquare = [null,null],
        this._halfMoveCount = 0,
        this._fullMoveCount = 1,
        this._boardSquares = [],
        this._pieceIcons = { k:"♚", q:"♛", r:"♜", b:"♝", n:"♞", p:"♟", 
                             K:"♔", Q:"♕", R:"♖", B:"♗", N:"♘", P:"♙" }
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
    getSquare(boardFile,boardRank) {
        return this._boardSquares[boardFile-1][boardRank-1];
    }
    getPieceIcons() {
        return this._pieceIcons;
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
    setSquarePiece(boardFile,boardRank,newPiece) {
        this._boardSquares[boardFile-1][boardRank-1].hasPiece = newPiece;
    }





    /*
    ==================
    ==CONVERT VALUES==
    ==================
    */
   //get piece type from fen key input
    convertPieceFenKeyToName(fenKey) {
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




    /*
    =================
    ==CREATE  BOARD==
    =================
    */
    //generate square coordinate string
    generateSquareCoordinate(boardFile, boardRank) {
        let fileLetter;
        switch(boardFile) {
            case(1): fileLetter="A"; break
            case(2): fileLetter="B"; break
            case(3): fileLetter="C"; break
            case(4): fileLetter="D"; break
            case(5): fileLetter="E"; break
            case(6): fileLetter="F"; break
            case(7): fileLetter="G"; break
            case(8): fileLetter="H"; break
        }
        return fileLetter+boardRank
    }
    //generate square colour
    generateSquareColour(boardFile,boardRank) {
        if((boardFile%2==0 && boardRank%2!=0) || (boardFile%2!=0 && boardRank%2==0)) {
            return "white"
        } else {
            return "black"
        }
    }
    //create board square
    createSquare(squareCoordinate, squareColour, boardFile, boardRank, hasPiece) {
        return {
            squareCoordinate,
            squareColour,
            boardFile,
            boardRank,
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
        const boardSquares = [];
        for(let boardFile=1; boardFile<=8; boardFile++) {
            const file = [];
            for(let boardRank=1; boardRank<=8; boardRank++) {
                const squareCoordinate = this.generateSquareCoordinate(boardFile,boardRank)
                const squareColour = this.generateSquareColour(boardFile,boardRank)
                const hasPiece = null
                const square = this.createSquare(squareCoordinate,squareColour,boardFile,boardRank,hasPiece)
                file.push(square)
            }
            boardSquares.push(file)
        }
        this.setBoardSquares(boardSquares)
    }





    /*
    =================
    ===IMPORT  FEN===
    =================
    */
    //set the chessboard squares to match the fen position
    importFenPosition() {
        const fenPosition = this.getFen().split(" ")[0].split("/").reverse()
        const newBoard = []

        for(let rank=1;rank<=8;rank++) {
            for(let file=1;file<=8;file++) {
                const fenPieceKey = fenPosition[rank-1][file-1]
                if(isNaN(fenPieceKey)) { 
                    const colour = fenPieceKey==fenPieceKey.toUpperCase() ? "white" : "black"
                    const type = this.convertPieceFenKeyToName(fenPieceKey)
                    const piece = this.createPiece(colour,type)
                    this.setSquarePiece(file,rank,piece)
                } else {
                    file+=fenPieceKey
                }
            }
        }
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

        for(let boardRank=1; boardRank<=8; boardRank++) {
            let emptySquareCount = 0;
            for(let boardFile=1; boardFile<=8; boardFile++) {
                const piece = this.getSquare(boardFile,boardRank).hasPiece
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
        for(let rank=1;rank<=8;rank++) {
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
}







// ==== T E S T ====
test = new Chessboard()
