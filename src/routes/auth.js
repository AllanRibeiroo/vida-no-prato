const express = require('express');
const router = express.Router();
// O nome da função no seu model é 'criar', vamos corrigir isso aqui
const Usuario = require('../models/usuario'); 
const bcrypt = require('bcryptjs');

router.post('/register', async (req, res) => {
  try {
    // Receber dados do corpo da requisição
    const { nome, email, telefone, senha, cnpj } = req.body;
    if (!nome || !email || !senha) {
      return res.status(400).json({ success: false, message: 'Nome, email e senha são obrigatórios' });
    }
    const existenteEmail = await Usuario.buscarPorEmail(email);
    if (existenteEmail) {
      return res.status(400).json({ success: false, message: 'Email já cadastrado' });
    }
    if (cnpj) {
      const existenteCnpj = await Usuario.buscarPorCnpj(cnpj);
      if (existenteCnpj) {
        return res.status(400).json({ success: false, message: 'CNPJ já cadastrado' });
      }
    }
    
    const id = await Usuario.criar({ nome, email, telefone, senha, cnpj });
    res.status(201).json({ success: true, message: 'Cadastro realizado com sucesso!', usuario: { id, nome, email } });
  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(500).json({ success: false, message: 'Erro interno ao criar usuário: ' + error.message });
  }
});

router.post('/login-collaborator', async (req, res) => {
  const { cnpj, senha } = req.body;
  if (!cnpj || !senha) {
    return res.status(400).json({ success: false, message: 'CNPJ e senha são obrigatórios' });
  }
  try {
    const usuario = await Usuario.buscarPorCnpj(cnpj);
    if (!usuario) {
      return res.status(401).json({ success: false, message: 'CNPJ não encontrado' });
    }

    const valido = await bcrypt.compare(senha, usuario.senha);
    if (!valido) {
      return res.status(401).json({ success: false, message: 'Senha incorreta' });
    }

    res.json({ success: true, message: 'Login bem-sucedido!', usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email, cnpj: usuario.cnpj } });
  } catch (error) {
    console.error('Erro no login de colaborador:', error);
    res.status(500).json({ success: false, message: 'Erro interno ao fazer login.' });
  }
});

router.post('/login', async (req, res) => {
  const { email, senha } = req.body;
  const usuario = await Usuario.buscarPorEmail(email);
  if (!usuario) return res.status(401).json({ success: false, message: 'Usuário não encontrado' });

  const valido = await bcrypt.compare(senha, usuario.senha);
  if (!valido) return res.status(401).json({ success: false, message: 'Senha incorreta' });

  res.json({ success: true, message: 'Login bem-sucedido!', usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email } });
});

module.exports = router;