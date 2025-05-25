const { Client } = require('@notionhq/client');

// Initialize the Notion client
const notion = new Client({
  auth: 'ntn_X66054858264MiUO9AG8M8hMB5rxkyRt03KY9KL16CJboN',
});

async function createStatisticalMechanicsPage() {
  try {
    const response = await notion.pages.create({
      parent: {
        type: 'database_id',
        database_id: '0e1e1a65-a58e-4df8-9dd9-a4726a70af18',
      },
      icon: {
        type: 'emoji',
        emoji: '🔬',
      },
      properties: {
        "Empresa": {
          title: [
            {
              text: {
                content: 'Mecânica Estatística',
              },
            },
          ],
        },
        "APIs": {
          rich_text: [
            {
              text: {
                content: 'Disciplina de Física',
              },
            },
          ],
        },
        "Local": {
          rich_text: [
            {
              text: {
                content: 'IFUSP',
              },
            },
          ],
        },
        "Alternativo": {
          rich_text: [
            {
              text: {
                content: 'Statistical Mechanics',
              },
            },
          ],
        },
      },
      children: [
        {
          object: 'block',
          heading_1: {
            rich_text: [
              {
                text: {
                  content: 'Mecânica Estatística',
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
                  content: 'Disciplina que estuda o comportamento de sistemas físicos com muitos graus de liberdade, utilizando métodos estatísticos e probabilísticos.',
                },
              },
            ],
          },
        },
        {
          object: 'block',
          heading_2: {
            rich_text: [
              {
                text: {
                  content: 'Tópicos',
                },
              },
            ],
          },
        },
        {
          object: 'block',
          bulleted_list_item: {
            rich_text: [
              {
                text: {
                  content: 'Fundamentos da Mecânica Estatística',
                },
              },
            ],
          },
        },
        {
          object: 'block',
          bulleted_list_item: {
            rich_text: [
              {
                text: {
                  content: 'Ensemble Microcanônico',
                },
              },
            ],
          },
        },
        {
          object: 'block',
          bulleted_list_item: {
            rich_text: [
              {
                text: {
                  content: 'Ensemble Canônico',
                },
              },
            ],
          },
        },
        {
          object: 'block',
          bulleted_list_item: {
            rich_text: [
              {
                text: {
                  content: 'Ensemble Grande Canônico',
                },
              },
            ],
          },
        },
        {
          object: 'block',
          bulleted_list_item: {
            rich_text: [
              {
                text: {
                  content: 'Estatística de Boltzmann',
                },
              },
            ],
          },
        },
        {
          object: 'block',
          bulleted_list_item: {
            rich_text: [
              {
                text: {
                  content: 'Estatística de Fermi-Dirac',
                },
              },
            ],
          },
        },
        {
          object: 'block',
          bulleted_list_item: {
            rich_text: [
              {
                text: {
                  content: 'Estatística de Bose-Einstein',
                },
              },
            ],
          },
        },
        {
          object: 'block',
          heading_2: {
            rich_text: [
              {
                text: {
                  content: 'Bibliografia',
                },
              },
            ],
          },
        },
        {
          object: 'block',
          numbered_list_item: {
            rich_text: [
              {
                text: {
                  content: 'Reif, F. Fundamentals of Statistical and Thermal Physics.',
                },
              },
            ],
          },
        },
        {
          object: 'block',
          numbered_list_item: {
            rich_text: [
              {
                text: {
                  content: 'Pathria, R.K. Statistical Mechanics.',
                },
              },
            ],
          },
        },
        {
          object: 'block',
          numbered_list_item: {
            rich_text: [
              {
                text: {
                  content: 'Salinas, S.R.A. Introdução à Física Estatística.',
                },
              },
            ],
          },
        },
        {
          object: 'block',
          heading_2: {
            rich_text: [
              {
                text: {
                  content: 'Avaliação',
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
                  content: 'A avaliação será composta por:',
                },
              },
            ],
          },
        },
        {
          object: 'block',
          bulleted_list_item: {
            rich_text: [
              {
                text: {
                  content: 'Provas (70%)',
                },
              },
            ],
          },
        },
        {
          object: 'block',
          bulleted_list_item: {
            rich_text: [
              {
                text: {
                  content: 'Listas de exercícios (20%)',
                },
              },
            ],
          },
        },
        {
          object: 'block',
          bulleted_list_item: {
            rich_text: [
              {
                text: {
                  content: 'Participação (10%)',
                },
              },
            ],
          },
        },
      ],
    });

    console.log('Success! Page created:', response.url);
    return response;
  } catch (error) {
    console.error('Error creating page:', error);
    throw error;
  }
}

createStatisticalMechanicsPage();
