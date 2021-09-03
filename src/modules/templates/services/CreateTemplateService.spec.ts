// import 'reflect-metadata';
import FakeTemplatesRepository from '../../templates/repositories/fakes/FakeTemplatesRepository';
import CreateTemplateService from './CreateTemplateService';
import AppError from '@shared/errors/AppError';

let fakeTemplatesRepository: FakeTemplatesRepository;
let createTemplate: CreateTemplateService;

beforeEach(() => {
  fakeTemplatesRepository = new FakeTemplatesRepository();
  createTemplate = new CreateTemplateService(fakeTemplatesRepository);
});

describe('CreateTemplate', () => {
  it('should be able to create a new template', async () => {
    const template = await createTemplate.execute({
      name: 'Template Teste',
      description: 'Template Teste Description',
      category: ['video-explicativo'],
      duration: 60,
      ratio: '16:9',
      price: 9999,
      path: 'Template_Teste',
      status: 'active'
    });

    expect(template).toHaveProperty('id');
  });

  it('should NOT be able to create a new template with the same name as existing template', async () => {
    await createTemplate.execute({
      name: 'Template Teste',
      description: 'Template Teste Description',
      category: ['video-explicativo'],
      duration: 60,
      ratio: '16:9',
      price: 9999,
      path: 'Template_Teste',
      status: 'active'
    });

    expect(
      createTemplate.execute({
        name: 'Template Teste',
        description: 'Template Teste Description',
        category: ['video-explicativo'],
        duration: 60,
        ratio: '16:9',
        price: 9999,
        path: 'Template_Teste',
        status: 'active'
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
