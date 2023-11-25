const express = require("express");
const app = express();
const cors = require("cors");
const http = require("http").Server(app);
const PORT = 3000;
const fs = require("fs");
const socketIO = require("socket.io")(http, {
    cors: {
        origin: "http://localhost:3001",
    },
});
app.use(cors());
//imports + cors

const dataFilePath = "data.json";


function encontrarProduto(nomeChave, meuArray, ultimoArrematante, valor, image, descricao) {
    const produtoIndex = meuArray.findIndex((item) => item.nome_prod === nomeChave);

    if (produtoIndex !== -1) {
        meuArray[produtoIndex].ultimo_lance = ultimoArrematante;
        meuArray[produtoIndex].valor = valor;
        meuArray[produtoIndex].image = image;
        meuArray[produtoIndex].descricao = descricao;

        const dadosString = JSON.stringify({ products: meuArray }, null, 2);

        try {
            fs.writeFileSync(dataFilePath, dadosString);
        } catch (error) {
            console.error("Erro ao escrever no arquivo:", error);
        }
    }
}

socketIO.on("connection", (socket) => {
    console.log(`⚡: ${socket.id} usuário acabou de se conectar!`);

    socket.on("disconnect", () => {
        console.log("🔥: Um usuário desconectou");
    });

    socket.on("addProduct", (data) => {
        try {
            const dadosSalvos = fs.readFileSync(dataFilePath);
            const dadosObjeto = JSON.parse(dadosSalvos);
    
            // Use the new keys and add the new properties
            dadosObjeto.products.push({
                nome_prod: data.nome_prod,
                descricao: data.descricao,
                valor: data.valor,
                dono: data.dono,
                ultimo_lance: data.ultimo_lance,
                image: data.image
            });
    
            const dadosString = JSON.stringify(dadosObjeto, null, 2);
            fs.writeFileSync(dataFilePath, dadosString);
            console.log(dadosObjeto);
            socket.broadcast.emit("addProductResponse", data);
        } catch (error) {
            console.error("Erro ao adicionar produto:", error);
        }
    });

    socket.on("bidProduct", (data) => {
        try {
            const dadosSalvos = fs.readFileSync(dataFilePath);
            const dadosObjeto = JSON.parse(dadosSalvos);
    
            // Adjust the call to `encontrarProduto` to include the new parameters
            encontrarProduto(
                data.nome_prod,
                dadosObjeto.products,
                data.ultimo_lance,
                data.valor,
                data.image,
                data.descricao
            );
            console.log(dadosObjeto);
            socket.broadcast.emit("bidProductResponse", data);
        } catch (error) {
            console.error("Erro ao dar lance no produto:", error);
        }
    });
});

app.get("/api", (req, res) => {
    try {
        const dadosSalvos = fs.readFileSync(dataFilePath);
        const dados = JSON.parse(dadosSalvos);
        res.json(dados);
    } catch (error) {
        console.error("Erro ao obter dados:", error);
        res.status(500).json({ error: "Erro ao obter dados" });
    }
});

http.listen(PORT, () => {
    console.log(`Servidor ouvindo na porta ${PORT}`);
});