const socket = io();

const chess  = new Chess();
const chessbord = document.querySelector(".chessboard");

let dragedpiece = null ;
let sourcesquare = null ;
let playersRole = null ;

const renderBord = function(){
    const board = chess.board();
    chessbord.innerHTML = "";
    board.forEach((row, rowindex) => {
        row.forEach((column, columnindex) => {
            const squireElem = document.createElement("div")
            squireElem.classList.add("squire",
                (rowindex + columnindex)%2 ===0? "light":"dark"
             );  
             squireElem.dataset.row = rowindex;
             squireElem.dataset.col = columnindex;
             
             if(column){
                const pieceElem = document.createElement("div")
                    pieceElem.classList.add(
                        "piece",
                        column.colour === "w"? "White" :"Black"
                );
                pieceElem.innerText = GetPieceUnicode(column);
                pieceElem.draggable = playersRole === column.colour;
                pieceElem.addEventListener("dragstart",(e)=>{
                    if(pieceElem.draggable){
                        dragedpiece = pieceElem;
                        sourcesquare = {row:rowindex,col:columnindex};
                        e.dataTransfer.setData("text/plain","");
                    }
                });
                pieceElem.addEventListener("dragend",(e)=>{
                    dragedpiece = null;
                    sourcesquare = null;
                })
                squireElem.appendChild(pieceElem);
             }
             squireElem.addEventListener("dragover",function(e){
                e.preventDefault();
             })
             squireElem.addEventListener("drop",function(e){
                e.preventDefault();
                if (dragedpiece){
                    const targatedSource = {
                        row:parseInt(squireElem.dataset.row),
                        column:parseInt(squireElem.dataset.column),
                    }
                    handleMove(sourcesquare,targatedSource)
                }
            })

            chessbord.appendChild(squireElem)
        });
    });            
    };

const handleMove = function(){};
const GetPieceUnicode = function(piece) {
    const unicodePices = {
        r:"♜",
        n:"♞",
        q:"♛",
        k:"♚",
        b:"♝",
        p:"♟",
        R:"♖",
        N:"♘",
        B:"♗",
        Q:"♕",
        K:"♔",
        R:"♖",
        P:"♙",
    }
     return unicodePices[piece.type] || "";
};

renderBord();