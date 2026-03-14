const express = require("express");
const cors = require("cors");
const db = require("./scr/db");

const app = express();

app.use(cors());
app.use(express.json());

// HEALTH CHECK
app.get("/", (req, res) =>
    res.json({ ok: true, msg: "API RODANDO" })
);

/**********************************************************************
 * GET 1 - LISTAR TODOS OS ALUNOS
 **********************************************************************/
app.get("/alunos", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM aluno;");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ erro: "Erro ao listar alunos", detalhe: err.message });
    }
});

/**********************************************************************
 * GET 2 - BUSCAR ALUNO POR ID
 **********************************************************************/
app.get("/alunos/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.query("SELECT * FROM alunos WHERE id = ?;", [id]);

        if (rows.length === 0) {
            return res.status(404).json({ erro: "Aluno não encontrado" });
        }

        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ erro: "Erro ao buscar aluno", detalhe: err.message });
    }
});

/**********************************************************************
 * PUT 1 - ATUALIZAR TODOS OS CAMPOS DO ALUNO
 **********************************************************************/
app.put("/alunos/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, idade, curso } = req.body;

        if (!nome || idade === undefined || !curso) {
            return res.status(400).json({ erro: "nome, idade e curso são obrigatórios" });
        }

        const [result] = await db.query(
            "UPDATE aluno SET nome = ?, idade = ?, curso = ? WHERE id = ?;",
            [nome, Number(idade), curso, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ erro: "Aluno não encontrado para atualizar" });
        }

        res.json({ mensagem: "Aluno atualizado com sucesso" });
    } catch (err) {
        res.status(500).json({ erro: "Erro ao atualizar aluno", detalhe: err.message });
    }
});

/**********************************************************************
 * PUT 2 - ATUALIZAR APENAS O CURSO DO ALUNO
 **********************************************************************/
app.put("/alunos/:id/curso", async (req, res) => {
    try {
        const { id } = req.params;
        const { curso } = req.body;

        if (!curso) {
            return res.status(400).json({ erro: "curso é obrigatório" });
        }

        const [result] = await db.query(
            "UPDATE aluno SET curso = ? WHERE id = ?;",
            [curso, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ erro: "Aluno não encontrado para atualizar o curso" });
        }

        res.json({ mensagem: "Curso atualizado com sucesso" });
    } catch (err) {
        res.status(500).json({ erro: "Erro ao atualizar curso", detalhe: err.message });
    }
});

/**********************************************************************
 * DELETE 1 - DELETAR ALUNO POR ID
 **********************************************************************/
app.delete("/alunos/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await db.query("DELETE FROM aluno WHERE id = ?;", [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ erro: "Aluno não encontrado para deletar" });
        }

        res.json({ mensagem: "Aluno deletado com sucesso" });
    } catch (err) {
        res.status(500).json({ erro: "Erro ao deletar aluno", detalhe: err.message });
    }
});

/**********************************************************************
 * INICIAR O SERVIDOR
 **********************************************************************/
app.listen(3000, () =>
    console.log("API rodando em http://localhost:3000")
);