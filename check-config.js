// Script de vérification de la configuration
// À exécuter avec : node check-config.js

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Vérification de la configuration...\n');

// Vérifier le fichier .env
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  console.log('✅ Fichier .env trouvé');
  const envContent = fs.readFileSync(envPath, 'utf8');
  
  if (envContent.includes('your-project.supabase.co')) {
    console.log('⚠️  ATTENTION: Variables d\'environnement Supabase non configurées');
    console.log('   Veuillez modifier le fichier .env avec vos vraies clés Supabase');
  } else {
    console.log('✅ Variables d\'environnement Supabase configurées');
  }
} else {
  console.log('❌ Fichier .env manquant');
  console.log('   Création du fichier .env...');
  
  const envContent = `# Variables d'environnement Supabase
# Remplacez ces valeurs par vos propres clés Supabase

VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
`;
  
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Fichier .env créé');
}

// Vérifier les dépendances
const packagePath = path.join(__dirname, 'package.json');
if (fs.existsSync(packagePath)) {
  console.log('✅ package.json trouvé');
  
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  const requiredDeps = ['@supabase/supabase-js', 'react', 'react-dom', 'react-router-dom'];
  
  const missingDeps = requiredDeps.filter(dep => !packageJson.dependencies[dep]);
  
  if (missingDeps.length > 0) {
    console.log('❌ Dépendances manquantes:', missingDeps.join(', '));
    console.log('   Exécutez: npm install');
  } else {
    console.log('✅ Toutes les dépendances requises sont installées');
  }
} else {
  console.log('❌ package.json manquant');
}

// Vérifier les fichiers TypeScript
const srcPath = path.join(__dirname, 'src');
if (fs.existsSync(srcPath)) {
  console.log('✅ Dossier src trouvé');
  
  const requiredFiles = [
    'App.tsx',
    'main.tsx',
    'lib/supabase.ts',
    'store/useAuthStore.ts',
    'store/useAppStore.ts'
  ];
  
  const missingFiles = requiredFiles.filter(file => {
    const filePath = path.join(srcPath, file);
    return !fs.existsSync(filePath);
  });
  
  if (missingFiles.length > 0) {
    console.log('❌ Fichiers manquants:', missingFiles.join(', '));
  } else {
    console.log('✅ Tous les fichiers requis sont présents');
  }
} else {
  console.log('❌ Dossier src manquant');
}

console.log('\n📋 Actions recommandées:');
console.log('1. Configurez vos variables d\'environnement Supabase dans .env');
console.log('2. Exécutez le script SQL fix-rls-policies.sql dans Supabase');
console.log('3. Redémarrez le serveur de développement: npm run dev');
console.log('4. Testez la création d\'événements après connexion'); 