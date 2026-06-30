const admin = require('../config/firebase');

const seedResources = async () => {
  try {
    const db = admin.firestore();
    console.log('Seeding resources...');

    const MOCK_RESOURCES = [
      {
        title: 'freeCodeCamp Full Stack Curriculum',
        description: 'Comprehensive curriculum covering HTML, CSS, React, Node, and more.',
        category: 'Useful Platforms',
        link: 'https://www.freecodecamp.org/',
        domain: 'Web Development'
      },
      {
        title: 'MDN Web Docs',
        description: 'The official documentation for Web technologies by Mozilla.',
        category: 'Official Documentation',
        link: 'https://developer.mozilla.org/',
        domain: 'Web Development'
      },
      {
        title: 'Frontend Developer Roadmap',
        description: 'Step by step guide to becoming a modern frontend developer.',
        category: 'Learning Roadmaps',
        link: 'https://roadmap.sh/frontend',
        domain: 'Web Development'
      },
      {
        title: 'Hugging Face Courses',
        description: 'Learn Natural Language Processing and transformers.',
        category: 'Useful Platforms',
        link: 'https://huggingface.co/course',
        domain: 'Artificial Intelligence'
      },
      {
        title: 'OpenAI API Documentation',
        description: 'Official docs for integrating GPT models.',
        category: 'Official Documentation',
        link: 'https://platform.openai.com/docs/',
        domain: 'Artificial Intelligence'
      }
    ];

    for (const res of MOCK_RESOURCES) {
      await db.collection('resources').add({
        ...res,
        createdAt: new Date().toISOString()
      });
    }

    console.log('Resources seeded successfully!');
    process.exit();
  } catch (err) {
    console.error('Error seeding resources:', err);
    process.exit(1);
  }
};

seedResources();
