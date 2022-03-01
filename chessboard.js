class Chessboard {
    constructor(fen) {
        this._gameState = "in-progress",   //current game state : in-progress, checkmate: white wins, checkmate: black wins, draw: stalemate, draw: 3-fold repetition, draw: 50 move rule
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
    getGameState() {
        return this._gameState;
    }
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
    setGameState(newGameState) {
        this._gameState = newGameState;
    }
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
            let fenTurn = importedFen[1]==null ? "w" : importedFen[1]
            let newTurn
            switch(fenTurn) {
                case "w": newTurn = "white"; break
                case "b": newTurn = "black"; break
                default: newTurn = "white"; break
            }
            this.setTurn(newTurn)

            //castle rights
            let fenCastle = importedFen[2]==null ? "KQkq" : importedFen[2]

            const newCastle = Array(4).fill(null)
            if(fenCastle.includes("K")) { newCastle[0]="K" }
            if(fenCastle.includes("Q")) { newCastle[1]="Q" }
            if(fenCastle.includes("k")) { newCastle[2]="k" }
            if(fenCastle.includes("q")) { newCastle[3]="q" }
            this.setCastleRights(newCastle)

            //en passant coordinate
            let fenEnPassant = importedFen[3]==null ? "-" : importedFen[3]
            if(fenEnPassant!="-") {
                const newEnPassant = this.convertCoordinateToSquare(fenEnPassant)
                this.setEnPassantSquare([newEnPassant[0],newEnPassant[1]])
            }

            //halfmove counter
            let fenHalfMove = importedFen[4]==null ? 0 : importedFen[4]
            this.setHalfMoveCount(Number(fenHalfMove))
        
            //fullmove counter
            let fenFullMove = importedFen[5]==null ? 1 : importedFen[5]
            this.setFullMoveCount(Number(fenFullMove))

            //is current king in check
            this.updateKingIsInCheck()
        }
        catch (error)
        {
            throw "Invalid FEN"
        }
    }

    updateKingIsInCheck() {
        const currentColour = this.getTurn()
        const currentKingPosition = currentColour=="white" ? this.getWhiteKingPosition() : this.getBlackKingPosition()
        const isInCheck = this.isKingInCheck(currentKingPosition[0],currentKingPosition[1],currentColour)
        this.setCurrentKingIsInCheck(isInCheck)
    }



    /*
    =================
    ===FEN HELPERS===
    =================
    */
    //toggle turn
    toggleTurn() {
        const newTurn = this.getTurn()=="white" ? "black" : "white"
        this.setTurn(newTurn)
    }
    //add 1 to half move counter
    addHalfMoveCount() {
        const newHalfMoveCount = this.getHalfMoveCount()+1
        this.setHalfMoveCount(newHalfMoveCount)
    }
    //reset half move counter
    resetHalfMoveCount() {
        this.setHalfMoveCount(0)
    }
    //add 1 to full move counter
    addFullMoveCount() {
        const newFullMoveCount = this.getFullMoveCount()+1
        this.setFullMoveCount(newFullMoveCount)
    }
    //reset full move counter
    resetFullMoveCount() {
        this.setFullMoveCount(0)
    }





    /*
    =================
    ===CREATE  FEN===
    =================
    */
    //create fen from current position
    generateCurrentFen() {
        const newFen = Array(6)

        //board position
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
        newFen[0] = newFenPosition
    
        
        //current turn
        const newTurn = this.getTurn()=="white" ? "w" : "b"
        newFen[1] = newTurn
    
        //castle rights
        let newCastleRights = this.getCastleRights().join("")
        if(newCastleRights=="") { newCastleRights="-" }
        newFen[2] = newCastleRights

        //en passant coordinate
        const currentEnPassant = this.getEnPassantSquare()
        let newEnPassantSquare = "-"
        if(currentEnPassant[0]!=null && currentEnPassant[1]!=null) {
            newEnPassantSquare = this.convertSquareToCoordinate(currentEnPassant[0],currentEnPassant[1]).toLowerCase()
        }
        newFen[3] = newEnPassantSquare

        //halfmove counter
        newFen[4] = this.getHalfMoveCount()

        //fullmove counter
        newFen[5] = this.getFullMoveCount()

        return newFen.join(" ")
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
                    boardString+=`${this.getSquare(file,rank).hasPiece.fenPieceKey} `
                } else {
                    boardString+=". "
                }
            }
            boardString+="\n"
        }
        boardString+="  a b c d e f g h"
        console.log(`%c${boardString}`, "color:green; font-size:20px; font-family:monospace")
    }




    
    /*
    =================
    ===MOVE PIECES===
    =================
    */
    //move piece object from one square to another
    movePiece(fileFrom,rankFrom,fileTo,rankTo,promoteTo) {
        const pieceFrom = this.getSquare(fileFrom,rankFrom).hasPiece
        this.setSquarePiece(fileTo,rankTo,pieceFrom)
        this.setSquarePiece(fileFrom,rankFrom,null)

        if(pieceFrom.type=="king") {
            //castling
            if(fileFrom==5 && fileTo==7) { 
                this.moveRookCastleKingSide(fileFrom,rankFrom) 
            } else if(fileFrom==5 && fileTo==3) { 
                this.moveRookCastleQueenSide(fileFrom,rankFrom)
            }

            //update king position
            if(pieceFrom.colour=="white") {
                this.setWhiteKingPosition(fileTo,rankTo)
            } else if (pieceFrom.colour=="black") {
                this.setBlackKingPosition(fileTo,rankTo)
            }
        } else if(pieceFrom.type=="pawn") {
            //en passant capture
            const enPassantSquare = this.getEnPassantSquare()
            const captureRank = pieceFrom.colour=="white" ? rankTo-1 : rankTo+1
            if(fileTo==enPassantSquare[0] && rankTo==enPassantSquare[1]) {
                this.setSquarePiece(fileTo,captureRank,null)
            }

            //pawn promotion
            if(rankTo==1 || rankTo==8) {
                this.promotePawn(fileTo,rankTo,promoteTo)
            }
        }
    }

    //make actual move of piece on board
    makeMove(fileFrom,rankFrom,fileTo,rankTo) {
        this.updateBoardStateFromMove(fileFrom,rankFrom,fileTo,rankTo)
        
        this.movePiece(fileFrom,rankFrom,fileTo,rankTo)

        //check whether king is in check and update state
        this.updateKingIsInCheck() 

        //update fen
        const newFen = this.generateCurrentFen()
        this.setFen(newFen)

        //check game end
        const endGame = this.checkEndGame()
        this.setGameState(endGame)
    }
    //END GAME
    checkEndGame() {
        const currentTurn = this.getTurn()
        const opponentTurn = currentTurn=="white" ? "Black" : "White"
        const validMoves = this.generateAllValidMoves(currentTurn)
        const kingIsInCheck = this.getCurrentKingIsInCheck()
        const halfMoveCount = this.getHalfMoveCount()

        if(validMoves.length==0) {
            if(kingIsInCheck) {
                return `Checkmate: ${opponentTurn} wins!`
            } else if(!kingIsInCheck) {
                return "Draw: Stalemate"
            }
        } else if(halfMoveCount>=100) {
            return "Draw: 50 Move Rule"
        }
        return "in-progress"
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
    //check whether piece can move from one square to another
    isPieceCapturable(fileFrom,rankFrom,fileTo,rankTo) {
        const tileFrom = this.getSquare(fileFrom,rankFrom)
        const tileTo = this.getSquare(fileTo,rankTo)
        if(tileTo.hasPiece==null || tileFrom.hasPiece.colour != tileTo.hasPiece.colour) {
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

    generatePseudoRookMoves(file,rank) {
        const moves =  this.generateDirectionMoves("A-H",file,rank).concat(
                        this.generateDirectionMoves("H-A",file,rank),
                        this.generateDirectionMoves("1-8",file,rank),
                        this.generateDirectionMoves("8-1",file,rank));
        return moves
    }
    generatePseudoBishopMoves(file,rank) {
        const moves = this.generateDirectionMoves("A1-H8",file,rank).concat(
                        this.generateDirectionMoves("A8-H1",file,rank),
                        this.generateDirectionMoves("H1-A8",file,rank),
                        this.generateDirectionMoves("H8-A1",file,rank));
        return moves
    }
    generatePseudoQueenMoves(file,rank) {
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
    generatePseudoKnightMoves(file,rank) {
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
    generatePseudoPawnMoves(fileFrom,rankFrom) {
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
    generatePseudoKingMoves(fileFrom,rankFrom) {
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

        //Castle Moves
                const kingCastle = this.calculateCastleMove(fileFrom,rankFrom,"king")
                    if(kingCastle!=null) { moves.push(kingCastle) }
                const queenCastle = this.calculateCastleMove(fileFrom,rankFrom,"queen")
                    if(queenCastle!=null) { moves.push(queenCastle) }

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
    //pawn promotion
    promotePawn(file,rank,promoteTo="queen") {
        const colour = this.getSquare(file,rank).hasPiece.colour
        const newPiece = this.createPiece(colour,promoteTo)

        this.setSquarePiece(file,rank,newPiece)
    }

    //castling
    calculateCastleMove(file,rank,castleSide) {
        const newFile = castleSide=="king" ? file+2 : file-2
        if(this.checkCastleIsValid(file,rank,castleSide)) {
            return [newFile,rank]
        }
        return null
    }
    checkCastleIsValid(file,rank,castleSide) {        
        const castleRights = this.getCastleRights()
        if(castleRights=="-") { return false }

        const kingColour = this.getSquare(file,rank).hasPiece.colour

        if(this.getTurn()!=kingColour || this.getCurrentKingIsInCheck()==true) { return false } //prevent infinite loop of generating king moves // isKingInCheck(colour1) => generateAllMoves => isKingInCheck(colour2) ...

        if(castleSide=="king" && ((kingColour=="white" && castleRights[0]=="K") || (kingColour=="black" && castleRights[2]=="k"))) {
            if(this.isValidMove(file,rank,file+1,rank) && this.isValidMove(file,rank,file+2,rank)) {
                return true
            }
        } else if (castleSide=="queen" && ((kingColour=="white" && castleRights[1]=="Q") || (kingColour=="black" && castleRights[3]=="q"))) {
            if(this.isValidMove(file,rank,file-1,rank) && this.isValidMove(file,rank,file-2,rank) && this.getSquare(file-3,rank).hasPiece==null) {
                return true
            }
        }
        return false
    }
    moveRookCastleKingSide(file,rank) {
        const rookFile = file+3
        const newRookFile = rookFile-2
        this.movePiece(rookFile,rank,newRookFile,rank)
    }
    moveRookCastleQueenSide(file,rank) {
        const rookFile = file-4
        const newRookFile = rookFile+3
        this.movePiece(rookFile,rank,newRookFile,rank)
    }



    updateBoardStateFromMove(fileFrom,rankFrom,fileTo,rankTo) {
        //castling
        const newCastleRights = this.getCastleRights()
        const pieceType = this.getSquare(fileFrom,rankFrom).hasPiece.type
        const pieceColour = this.getSquare(fileFrom,rankFrom).hasPiece.colour

        if(pieceType=="king") {
            if(pieceColour=="white") { 
                newCastleRights[0] = null
                newCastleRights[1] = null
            } else if(pieceColour=="black") {
                newCastleRights[2] = null
                newCastleRights[3] = null
            }
        } else if(pieceType=="rook") {
            if(fileFrom==8) {
                if(pieceColour=="white") {
                    newCastleRights[0] = null
                } else if(pieceColour=="black") {
                    newCastleRights[2] = null
                }
            } else if (fileFrom==1) {
                if(pieceColour=="white") {
                    newCastleRights[1] = null
                } else if(pieceColour=="black") {
                    newCastleRights[3] = null
                }
            }
        }
        this.setCastleRights(newCastleRights)


        //en passant
        let newEnPassantSquare = [null,null]
        if(pieceType=="pawn") {
            const offset = pieceColour=="white" ? 1 : -1
            const doublePushRank = rankFrom+(2*offset)
            if(doublePushRank==rankTo) {
                newEnPassantSquare = [fileFrom,rankFrom+offset]
            }
        }
        this.setEnPassantSquare(newEnPassantSquare)


        //half move count
        const pieceTo = this.getSquare(fileTo,rankTo).hasPiece
        if(pieceTo!=null || pieceType=="pawn") {
            this.resetHalfMoveCount()
        } else {
            this.addHalfMoveCount()
        }


        //full move count
        if(this.getTurn()=="black") {
            this.addFullMoveCount()
        }


        //current turn
        this.toggleTurn()
    }






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
        console.log(`%c${boardString}`, "color:red; font-size:20px; font-family:monospace")
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
        boardCopy.initialiseBoard()

        //move piece and check validate that king is not in check
        const colourFrom = boardCopy.getSquare(fileFrom,rankFrom).hasPiece.colour
        if(boardCopy.isPieceCapturable(fileFrom,rankFrom,fileTo,rankTo)) {
            boardCopy.movePiece(fileFrom,rankFrom,fileTo,rankTo)
            boardCopy.updateKingIsInCheck()
            const kingPosition = colourFrom=="white" ? boardCopy.getWhiteKingPosition() : boardCopy.getBlackKingPosition()
            return !boardCopy.isKingInCheck(kingPosition[0],kingPosition[1],colourFrom)
        }
        return false
    }
    //generate all possible moves for a piece, whether illegal or not
    generatePiecePseudoMoves(fileFrom,rankFrom) {
        const pieceType = this.getSquare(fileFrom,rankFrom).hasPiece.type
        let pseudoMoves = [];

        switch(pieceType) {
            case("rook"): pseudoMoves=this.generatePseudoRookMoves(fileFrom,rankFrom); break
            case("bishop"): pseudoMoves=this.generatePseudoBishopMoves(fileFrom,rankFrom); break
            case("queen"): pseudoMoves=this.generatePseudoQueenMoves(fileFrom,rankFrom); break
            case("king"): pseudoMoves=this.generatePseudoKingMoves(fileFrom,rankFrom); break
            case("knight"): pseudoMoves=this.generatePseudoKnightMoves(fileFrom,rankFrom); break
            case("pawn"): pseudoMoves=this.generatePseudoPawnMoves(fileFrom,rankFrom); break
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
            if(this.isValidMove(fileFrom,rankFrom,move[0],move[1])) { validMoves.push([fileFrom,rankFrom,move[0],move[1]]) }
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


    //methods to call to first create board
    initialiseBoard() {
        this.createEmptyChessboard()
        this.importFen()
    }






    //=== EVALUATE POSITION ===

    evaluateCurrentPosition() {
        let materialDifference = 0

        this.getBoardSquares().forEach(file => {
            file.forEach(square => {
                if(square.hasPiece!=null) {
                    let pieceWorth
                    const offset = square.hasPiece.colour=="white" ? 1 : -1
    
                    switch(square.hasPiece.type) {
                        case "rook": pieceWorth=50; break
                        case "knight": pieceWorth=30; break
                        case "bishop": pieceWorth=30; break
                        case "pawn": pieceWorth=10; break
                        case "queen": pieceWorth=90; break
                        case "king": pieceWorth=999; break
                    }
        
                    materialDifference+=(pieceWorth*offset)
                }
            })
        })

        return materialDifference
    }


    //find best move
    findBestMoveFromCurrentPosition() {
        let currentBest = { move:null,score:null }

        const currentColour = this.getTurn()
        const currentFen = this.getFen()

        const colourOffset = currentColour=="white" ? 1 : -1
        
        const moves = this.generateAllValidMoves(currentColour)
        this.shuffleMoves(moves)

        for(let i=0;i<moves.length;i++) {
            const moveTest = moves[i]

            const boardCopy = new Chessboard(currentFen)
            boardCopy.initialiseBoard()
            boardCopy.makeMove(moveTest[0],moveTest[1],moveTest[2],moveTest[3])
            const evaluationScore = boardCopy.evaluateCurrentPosition()*colourOffset

            if(evaluationScore>currentBest.score || currentBest.score==null) { currentBest.move=moveTest; currentBest.score=evaluationScore } //set best move if new evaluation is better
        }
        
        return currentBest
    }


    shuffleMoves(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

}