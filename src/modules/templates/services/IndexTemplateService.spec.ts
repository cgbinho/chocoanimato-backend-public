// import 'reflect-metadata';
import FakeTemplatesRepository from '../../templates/repositories/fakes/FakeTemplatesRepository';
import CreateTemplateService from './CreateTemplateService';
import IndexTemplateService from './IndexTemplateService';
// import createConnection from '@shared/infra/typeorm';
import AppError from '@shared/errors/AppError';

// beforeAll(async () => {
//   await createConnection();
// });

let fakeTemplatesRepository: FakeTemplatesRepository;
let createTemplate: CreateTemplateService;
let indexTemplate: IndexTemplateService;

beforeEach(() => {
  fakeTemplatesRepository = new FakeTemplatesRepository();
  createTemplate = new CreateTemplateService(fakeTemplatesRepository);
  indexTemplate = new IndexTemplateService(fakeTemplatesRepository);
});

describe('IndexTemplate', () => {
  it('should be able to index templates', async () => {
    /*
    CREATE TEMPLATES
    */
    await createTemplate.execute({
      name: 'Template Teste',
      description: 'Template Teste Description',
      category: ['video-explicativo'],
      duration: 60,
      ratio: '16:9',
      price: 99.99,
      path: 'Template_Teste',
      status: 'active'
    });

    await createTemplate.execute({
      name: 'Template Teste2',
      description: 'Template Teste Description',
      category: ['video-explicativo'],
      duration: 60,
      ratio: '16:9',
      price: 99.99,
      path: 'Template_Teste2',
      status: 'active'
    });

    /*
    INDEX ALL TEMPLATES
    */
    const response = await indexTemplate.execute({
      category: ['video-explicativo'],
      duration: 60,
      page: 0,
      sort: 'DESC',
      take: 6
    });

    expect(response).toHaveProperty('total');
    expect(response).toHaveProperty('results');
  });
});
