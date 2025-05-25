const { Client } = require('@notionhq/client');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const FormData = require('form-data');

// Initialize the Notion client
const notion = new Client({
  auth: 'ntn_X66054858264MiUO9AG8M8hMB5rxkyRt03KY9KL16CJboN',
});

const pageId = '1d0189b7b70281ac9707c396bbb4a8a7';

// Function to create a data URL for a file
const createDataUrl = (filePath) => {
  try {
    const fileData = fs.readFileSync(filePath);
    const base64Data = fileData.toString('base64');
    return `data:application/pdf;base64,${base64Data}`;
  } catch (error) {
    throw new Error(`Failed to create data URL: ${error.message}`);
  }
};

// Function to add a file block to Notion
const addFileBlockToNotion = async (url, fileName) => {
  try {
    const response = await notion.blocks.children.append({
      block_id: pageId,
      children: [
        {
          object: 'block',
          type: 'file',
          file: {
            type: 'external',
            external: {
              url: url,
            },
            caption: [
              {
                type: 'text',
                text: {
                  content: fileName,
                },
              },
            ],
          },
        },
      ],
    });
    return response;
  } catch (error) {
    console.error(`Error adding file block to Notion: ${error.message}`);
    throw error;
  }
};

// Main function
const main = async () => {
  try {
    // Get the list of PDF files
    const files = fs.readdirSync(__dirname);
    const pdfFiles = files.filter(file => path.extname(file) === '.pdf');

    if (pdfFiles.length === 0) {
      console.log('No PDF files found in the current directory.');
      return;
    }

    console.log(`Found ${pdfFiles.length} PDF files. Creating data URLs and adding to Notion...`);

    // Add a heading for the PDF files
    await notion.blocks.children.append({
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
                  content: 'Aqui estão os arquivos PDF para a disciplina:',
                },
              },
            ],
          },
        },
      ],
    });

    // Create data URLs for each PDF file and add them to Notion
    for (const file of pdfFiles) {
      const filePath = path.join(__dirname, file);
      console.log(`Processing ${file}...`);
      
      try {
        const dataUrl = createDataUrl(filePath);
        console.log(`Created data URL for ${file}`);
        
        await addFileBlockToNotion(dataUrl, file);
        console.log(`Added file block to Notion for ${file}`);
      } catch (error) {
        console.error(`Error processing ${file}: ${error.message}`);
      }
    }

    console.log('All files have been processed.');
  } catch (error) {
    console.error(`An error occurred: ${error.message}`);
  }
};

// Install form-data package if not already installed
const installFormData = () => {
  return new Promise((resolve, reject) => {
    console.log('Installing form-data package...');
    const { exec } = require('child_process');
    exec('npm install form-data', (error, stdout, stderr) => {
      if (error) {
        console.error(`Error installing form-data: ${error.message}`);
        reject(error);
        return;
      }
      console.log('form-data package installed successfully.');
      resolve();
    });
  });
};

// Run the main function
(async () => {
  try {
    await installFormData();
    await main();
  } catch (error) {
    console.error(`Script execution failed: ${error.message}`);
  }
})();
