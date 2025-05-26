const { Client } = require('@notionhq/client');

// Initialize the Notion client
const notion = new Client({
  auth: 'ntn_X66054858264MiUO9AG8M8hMB5rxkyRt03KY9KL16CJboN',
});

const pageId = '1d0189b7b70281ac9707c396bbb4a8a7';

async function updateNotionPageWithPDFs() {
  try {
    // Get the list of PDF files
    const pdfFiles = [
      { name: 'Boltzmann', path: '/home/lemke/termo/boltzmann.pdf' },
      { name: 'Lagrange Multipliers', path: '/home/lemke/termo/lagrange_multipliers.pdf' },
      { name: 'Multiplicadores de Lagrange', path: '/home/lemke/termo/multiplicadores_lagrange.pdf' },
      { name: 'Probabilidade', path: '/home/lemke/termo/prob.pdf' },
      { name: 'Probabilidade (Corrigido)', path: '/home/lemke/termo/prob_fixed.pdf' }
    ];

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
                  content: file.path,
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
                  content: 'Nota: Os arquivos PDF estão disponíveis localmente no diretório /home/lemke/termo.',
                },
              },
            ],
          },
        },
      ],
    });

    console.log('Success! Page updated with PDF files.');
    return response;
  } catch (error) {
    console.error('Error updating page:', error);
    throw error;
  }
}

updateNotionPageWithPDFs();
