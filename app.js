const express = require('express');
const app = express();
const port = 3000;
const host = '127.0.0.1';
const {pool, sqlErr} = require('./modules/mysql-conn');


// 서버 구동
app.listen(port, () => {
	console.log(`http://${host}:${port}`);
});

// express 세팅 및 미들웨어 세팅
app.set('view engine', 'pug');
app.set('views', './views');

// 정적라우터 세팅
app.use('/', express.static('./public'));
// body-parser 세팅
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.locals.pretty = true; // 클라이언트에 보내주는 소스를 들여쓰기 해준다.

app.get(["/pug","/pug/:page"],async (req, res) => {
    let page = req.params.page ? req.params.page : "list";
    let vals = {};
    switch(page) {
        case "list":
            vals.title = "게시글 리스트 입니다.";
            let sql = "SELECT * FROM board ORDER BY id DESC";
            const connect  = await pool.getConnection();
            const result = await connect.query(sql);
            vals.lists = result[0];
            /*
            vals.lists = [
                {id:1, title: "첫번째 글", writer: "관리자", wdate: "2020-01-03", rnum: 5},
                {id:2, title: "두번째 글", writer: "관리자2", wdate: "2020-01-04", rnum: 6},
                {id:3, title: "세번째 글", writer: "관리자3", wdate: "2020-01-05", rnum: 4},
            ];
            */
            res.render("list.pug",vals);
            break;
        case "write":
            vals.title = "게시글 작성 입니다.";
            res.render("write.pug",vals);
            break;
        default:
            res.redirect("/");
            break;
    }
});
/*
app.get("/sqltest", (req, res) => {
    conn.getConnection((err, connect) => {
        if(err) {
            res.send("Database 접속에 실패하였습니다.");
        }
        else {
            let sql = ' INSERT INTO board SET title="테스트입니다.",writer="관리자",wdate="2020-01-05 14:55:00" ';
            connect.query(sql, (err, result) => {
                if(err) {
                    res.send("SQL문이 실패하였습니다.");
                }
                else {
                    res.json(result);
                }
            });
        }
    });
});
*/

app.get("/sqltest",async (req,res) => {
    let sql = " INSERT INTO board SET title=?,writer=?,wdate=? ";
    let sqlVals = ["제목입이다2.","관리자2","2020-01-05 15:55:00"];
    const connect = await pool.getConnection();
    const result = await connect.query(sql,sqlVals);
    connect.release();
    res.json(result);
    
});

app.post("/board", async (req, res) => {
    let sql = "INSERT INTO board SET title=?, writer=?, wdate=?";
    let val = [req.body.title, req.body.writer, new Date()];
    const connect = await pool.getConnection();
    const result = await connect.query(sql, val);
    connect.release();
    //res.json(result);
    res.redirect("/pug");
});