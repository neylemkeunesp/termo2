const express = require('express');
const path = require('path');
const fs = require('fs');
const { Client } = require('@notionhq/client');

const app = express();
const PORT = 3000;

// Serve PDF files from the current directory
app.use('/pdf', express.static(path.join(__dirname), {
  setHeaders: (res, filePath) => {
    if (path.extname(filePath) === '.pdf') {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename="${path.basename(filePath)}"`);
    }
  }
}));

// Initialize the Notion client
const notion = new Client({
  auth: 'ntn_X66054858264MiUO9AG8M8hMB5rxkyRt03KY9KL16CJboN',
});

const pageId = '1d0189b7b70281ac9707c396bbb4a8a7';

// Get the list of PDF files
const getPdfFiles = () => {
  const files = fs.readdirSync(__dirname);
  return files.filter(file => path.extname(file) === '.pdf').map(file => ({
    name: path.basename(file, '.pdf'),
    path: file,
    url: `http://localhost:${PORT}/pdf/${encodeURIComponent(file)}`
  }));
};

// Update Notion page with PDF links
const updateNotionPageWithPDFs = async () => {
  try {
    const pdfFiles = getPdfFiles();
    
    console.log('PDF files available at:');
    pdfFiles.forEach(file => {
      console.log(`- ${file.name}: ${file.url}`);
    });

    // Create blocks for the PDF files
    const response = await notion.blocks.children.append({
      block_id: pageId,
      children: [
        {
          object: 'block',
          heading_2: {
            rich_text: [
              {
                text: {
                  content: 'Materiais em PDF',
                },
              },
            ],
          },
        },
        {
          object: 'block',
          paragraph: {
            rich_text: [
              {
                text: {
                  content: 'Aqui estão os materiais em PDF disponíveis para a disciplina:',
                },
              },
            ],
          },
        },
        ...pdfFiles.map(file => ({
          object: 'block',
          bulleted_list_item: {
            rich_text: [
              {
                text: {
                  content: `${file.name}: `,
                },
                annotations: {
                  bold: true,
                },
              },
              {
                text: {
                  content: 'Abrir PDF',
                  link: {
                    url: file.url,
                  },
                },
              },
            ],
          },
        })),
        {
          object: 'block',
          paragraph: {
            rich_text: [
              {
                text: {
                  content: 'Nota: Os PDFs estão sendo servidos por um servidor local na porta 3000. O servidor deve estar rodando para acessar os arquivos.',
                },
              },
            ],
          },
        },
      ],
    });

    console.log('Success! Page updated with PDF links.');
    console.log('Server is running. Keep this terminal open to serve the PDF files.');
    console.log('Press Ctrl+C to stop the server.');
  } catch (error) {
    console.error('Error updating page:', error);
  }
};

// Start the server
app.listen(PORT, () => {
  console.log(`PDF server running at http://localhost:${PORT}`);
  updateNotionPageWithPDFs();
});
