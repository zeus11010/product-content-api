import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';

// Charger les variables d'environnement
dotenv.config();

// Initialiser l'application Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Initialiser le client OpenAI avec la clé API du serveur
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Route pour tester que le serveur fonctionne
app.get('/', (req, res) => {
  res.json({ 
    message: 'API de génération de contenu produit', 
    status: 'opérationnelle'
  });
});

// Route pour obtenir la réponse de l'API OpenAI
app.post('/api/generate', async (req, res) => {
  try {
    const { model, messages, temperature, max_tokens } = req.body;
    
    // Vérification des paramètres requis
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ 
        error: 'Le format des messages est invalide' 
      });
    }
    
    // Appel à l'API OpenAI
    const response = await openai.chat.completions.create({
      model: model || 'gpt-3.5-turbo',
      messages,
      temperature: temperature !== undefined ? temperature : 0.7,
      max_tokens: max_tokens !== undefined ? max_tokens : 1000
    });

    // Retourner la réponse
    res.json(response);
  } catch (error) {
    console.error('Erreur lors de l\'appel à l\'API OpenAI:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la génération du contenu',
      details: error.message
    });
  }
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
