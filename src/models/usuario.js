const pool = require("../config/banco-dados");
const bcrypt = require('bcryptjs'); // Certifique-se de que bcryptjs está instalado

class Usuario {
  static async listar() {
    const [rows] = await pool.query("SELECT id, nome, email, telefone, cnpj, nota FROM usuarios");
    return rows;
  }

  static async criar({ nome, email, telefone, senha, cnpj }) {
    // Criptografa a senha antes de salvar
    const hash = await bcrypt.hash(senha, 10);

    // Se cnpj for vazio ou undefined, passa null
    const cnpjValue = cnpj && cnpj.trim() ? cnpj : null;

    const [result] = await pool.query(
      "INSERT INTO usuarios (nome, email, telefone, senha, cnpj, nota) VALUES (?, ?, ?, ?, ?, 5.00)",
      [nome, email, telefone, hash, cnpjValue]
    );
    return result.insertId;
  }

  // Buscar usuário por CNPJ
  static async buscarPorCnpj(cnpj) {
    const [rows] = await pool.query("SELECT * FROM usuarios WHERE cnpj = ?", [cnpj]);
    return rows[0];
  }

  // Buscar usuário por Email
  static async buscarPorEmail(email) {
    const [rows] = await pool.query("SELECT * FROM usuarios WHERE email = ?", [email]);
    return rows[0];
  }

  // Buscar usuário por ID (para exibir perfil)
  static async buscarPorId(id) {
    const [rows] = await pool.query("SELECT id, nome, email, telefone, cnpj, nota, descricao_estabelecimento FROM usuarios WHERE id = ?", [id]);
    return rows[0];
  }

  // Atualizar nota do estabelecimento
  static async atualizarNota(id, nota) {
    const [result] = await pool.query("UPDATE usuarios SET nota = ? WHERE id = ?", [nota, id]);
    return result.affectedRows;
  }

  // Atualizar descrição do estabelecimento
  static async atualizarDescricao(id, descricao) {
    const [result] = await pool.query("UPDATE usuarios SET descricao_estabelecimento = ? WHERE id = ?", [descricao, id]);
    return result.affectedRows;
  }
}

module.exports = Usuario;