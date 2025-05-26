const { Client } = require('@notionhq/client');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Initialize the Notion client
const notion = new Client({
  auth: 'ntn_X66054858264MiUO9AG8M8hMB5rxkyRt03KY9KL16CJboN',
});

const pageId = '1d0189b7b70281ac9707c396bbb4a8a7';

// Function to create an HTML page with links to PDF files
const createHtmlPage = (pdfFiles) => {
  const htmlContent = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Arquivos PDF - Mecânica Estatística</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    h1 {
      color: #333;
      border-bottom: 1px solid #ddd;
      padding-bottom: 10px;
    }
    ul {
      list-style-type: none;
      padding: 0;
    }
    li {
      margin-bottom: 15px;
      padding: 10px;
      background-color: #f5f5f5;
      border-radius: 5px;
    }
    a {
      color: #0066cc;
      text-decoration: none;
      font-weight: bold;
    }
    a:hover {
      text-decoration: underline;
    }
    .file-info {
      color: #666;
      font-size: 0.9em;
      margin-top: 5px;
    }
  </style>
</head>
<body>
  <h1>Arquivos PDF - Mecânica Estatística</h1>
  <p>Aqui estão os arquivos PDF disponíveis para a disciplina:</p>
  <ul>
    ${pdfFiles.map(file => {
      const stats = fs.statSync(file.path);
      const fileSizeInKB = Math.round(stats.size / 1024);
      return `
    <li>
      <a href="file://${file.path}" target="_blank">${file.name}</a>
      <div class="file-info">
        Tamanho: ${fileSizeInKB} KB | Caminho: ${file.path}
      </div>
    </li>`;
    }).join('')}
  </ul>
  <p><em>Nota: Os links acima apontam para arquivos locais no seu computador. Certifique-se de que os arquivos estão presentes nos caminhos especificados.</em></p>
</body>
</html>
  `;

  const htmlPath = path.join(__dirname, 'mecanica_estatistica_pdfs.html');
  fs.writeFileSync(htmlPath, htmlContent);
  return htmlPath;
};

// Function to add a bookmark block to Notion
const addBookmarkToNotion = async (url, title) => {
  try {
    const response = await notion.blocks.children.append({
      block_id: pageId,
      children: [
        {
          object: 'block',
          type: 'bookmark',
          bookmark: {
            url: url,
            caption: [
              {
                type: 'text',
                text: {
                  content: title,
                },
              },
            ],
          },
        },
      ],
    });
    return response;
  } catch (error) {
    console.error(`Error adding bookmark to Notion: ${error.message}`);
    throw error;
  }
};

// Function to add a paragraph with instructions to Notion
const addInstructionsToNotion = async () => {
  try {
    const response = await notion.blocks.children.append({
      block_id: pageId,
      children: [
        {
          object: 'block',
          type: 'heading_2',
          heading_2: {
            rich_text: [
              {
                type: 'text',
                text: {
                  content: 'Arquivos PDF',
                },
              },
            ],
          },
        },
        {
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [
              {
                type: 'text',
                text: {
                  content: 'Foi criada uma página HTML local com links para os arquivos PDF da disciplina. Para acessar os arquivos:',
                },
              },
            ],
          },
        },
        {
          object: 'block',
          type: 'numbered_list_item',
          numbered_list_item: {
            rich_text: [
              {
                type: 'text',
                text: {
                  content: 'Abra o arquivo HTML criado em ',
                },
              },
              {
                type: 'text',
                text: {
                  content: '/home/lemke/termo/mecanica_estatistica_pdfs.html',
                },
                annotations: {
                  code: true,
                },
              },
            ],
          },
        },
        {
          object: 'block',
          type: 'numbered_list_item',
          numbered_list_item: {
            rich_text: [
              {
                type: 'text',
                text: {
                  content: 'Clique nos links dos PDFs para abri-los',
                },
              },
            ],
          },
        },
        {
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [
              {
                type: 'text',
                text: {
                  content: 'Nota: Os arquivos PDF estão localizados em /home/lemke/termo/',
                },
              },
            ],
          },
        },
      ],
    });
    return response;
  } catch (error) {
    console.error(`Error adding instructions to Notion: ${error.message}`);
    throw error;
  }
};

// Main function
const main = async () => {
  try {
    // Get the list of PDF files
    const files = fs.readdirSync(__dirname);
    const pdfFiles = files.filter(file => path.extname(file) === '.pdf').map(file => ({
      name: file,
      path: path.join(__dirname, file)
    }));

    if (pdfFiles.length === 0) {
      console.log('No PDF files found in the current directory.');
      return;
    }

    console.log(`Found ${pdfFiles.length} PDF files. Creating HTML page with links...`);

    // Create HTML page with links to PDF files
    const htmlPath = createHtmlPage(pdfFiles);
    console.log(`HTML page created at: ${htmlPath}`);

    // Add instructions to Notion
    await addInstructionsToNotion();
    console.log('Added instructions to Notion page');

    // Open the HTML file
    const command = process.platform === 'darwin' 
      ? `open "${htmlPath}"` 
      : process.platform === 'win32' 
        ? `start "${htmlPath}"` 
        : `xdg-open "${htmlPath}"`;
    
    exec(command, (error) => {
      if (error) {
        console.error(`Error opening HTML file: ${error.message}`);
        return;
      }
      
      console.log('HTML file opened in browser');
    });

    console.log('\nInstructions:');
    console.log('1. The HTML page has been created and opened in your browser');
    console.log('2. Instructions have been added to the Notion page');
    console.log('3. The HTML page contains links to all PDF files in the termo directory');
    console.log('4. You can access the PDF files by clicking on the links in the HTML page');
  } catch (error) {
    console.error(`An error occurred: ${error.message}`);
  }
};

// Run the main function
main();
