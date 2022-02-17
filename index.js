class Chessboard {
    constructor(fen) {
        this._fen = fen || "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
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
    getSquare(file,rank) {
        return this._boardSquares[file-1][rank-1];
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
    setSquarePiece(file,rank,newPiece) {
        this._boardSquares[file-1][rank-1].hasPiece = newPiece;
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




    /*
    =================
    ==CREATE  BOARD==
    =================
    */
    //generate square coordinate string
    generateSquareCoordinate(file, rank) {
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
                const squareCoordinate = this.generateSquareCoordinate(file,rank)
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
    //set the chessboard squares to match the fen position
    importFenPosition() {
        const fenPosition = this.getFen().split(" ")[0].split("/").reverse()

        for(let rank=1;rank<=8;rank++) {
            let fenPieceIndex = 0
            for(let file=1;file<=8;file++) {
                const fenPiece = fenPosition[rank-1][fenPieceIndex]
                if(fenPiece && isNaN(fenPiece)) { 
                    const colour = fenPiece==fenPiece.toUpperCase() ? "white" : "black"
                    const type = this.convertFenPieceToName(fenPiece)
                    const piece = this.createPiece(colour,type)
                    this.setSquarePiece(file,rank,piece)
                } else {
                    file+=Number(fenPiece)-1    //offset the file position to skip the blank tiles. -1 to account for the square currently being checked
                }
                fenPieceIndex+=1
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
        this.setSquarePiece(fileFrom,rankFrom,null)
        this.setSquarePiece(fileTo,rankTo,pieceFrom)
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
}







// ==== T E S T ====
test = new Chessboard()
test.createEmptyChessboard()
test.importFenPosition()
test.printBoard()

test.movePiece(1,1,5,5)
test.printBoard()
console.log(test.generatePiecePseudoMoves(5,5))
console.log(test.generateAllAttackedSquares("white"))
