const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Notion page URL
const notionPageUrl = 'https://www.notion.so/Mec-nica-Estat-stica-1d0189b7b70281ac9707c396bbb4a8a7';

// Get the list of PDF files
const getPdfFiles = () => {
  const files = fs.readdirSync(__dirname);
  return files.filter(file => path.extname(file) === '.pdf').map(file => ({
    name: path.basename(file, '.pdf'),
    path: path.join(__dirname, file)
  }));
};

// Print instructions
const printInstructions = (pdfFiles) => {
  console.log('\n=== INSTRUÇÕES PARA UPLOAD DE ARQUIVOS PDF NO NOTION ===\n');
  console.log('1. Um navegador será aberto com a página do Notion');
  console.log('2. Faça login na sua conta do Notion se necessário');
  console.log('3. Na página, clique onde deseja adicionar os arquivos');
  console.log('4. Digite "/upload" ou "/file" e selecione a opção para fazer upload de arquivo');
  console.log('5. Navegue até o diretório "/home/lemke/termo" e selecione os arquivos PDF:');
  
  pdfFiles.forEach(file => {
    console.log(`   - ${file.name}.pdf (${file.path})`);
  });
  
  console.log('\nArquivos PDF disponíveis para upload:');
  pdfFiles.forEach(file => {
    console.log(`- ${file.name}.pdf`);
  });
  
  console.log('\nDepois de fazer o upload de todos os arquivos, você pode fechar o navegador.');
  console.log('\n=== FIM DAS INSTRUÇÕES ===\n');
};

// Main function
const main = () => {
  const pdfFiles = getPdfFiles();
  
  if (pdfFiles.length === 0) {
    console.log('Nenhum arquivo PDF encontrado no diretório atual.');
    return;
  }
  
  printInstructions(pdfFiles);
  
  // Open the browser with the Notion page
  const command = process.platform === 'darwin' 
    ? `open "${notionPageUrl}"` 
    : process.platform === 'win32' 
      ? `start "${notionPageUrl}"` 
      : `xdg-open "${notionPageUrl}"`;
  
  exec(command, (error) => {
    if (error) {
      console.error(`Erro ao abrir o navegador: ${error.message}`);
      return;
    }
    
    console.log('Navegador aberto com a página do Notion. Siga as instruções acima para fazer o upload dos arquivos.');
  });
};

// Run the main function
main();
