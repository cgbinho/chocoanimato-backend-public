// import 'reflect-metadata';
import FakeTemplatesRepository from '../../templates/repositories/fakes/FakeTemplatesRepository';
import CreateTemplateService from './CreateTemplateService';
import UpdateTemplateService from './UpdateTemplateService';
// import createConnection from '@shared/infra/typeorm';
import AppError from '@shared/errors/AppError';

let fakeTemplatesRepository: FakeTemplatesRepository;
let createTemplate: CreateTemplateService;
let showTemplate: UpdateTemplateService;

beforeEach(() => {
  fakeTemplatesRepository = new FakeTemplatesRepository();
  createTemplate = new CreateTemplateService(fakeTemplatesRepository);
  showTemplate = new UpdateTemplateService(fakeTemplatesRepository);
});

describe('UpdateTemplate', () => {
  it('should be able to show a valid template', async () => {
    /*
    CREATES A TEMPLATE
    */
    const newTemplate = await createTemplate.execute({
      name: 'Template Teste',
      description: 'Template Teste Description',
      category: ['video-explicativo'],
      duration: 60,
      ratio: '16:9',
      price: 99.99,
      path: 'Template_Teste',
      status: 'pending'
    });

    /*
    SHOW A TEMPLATE
    */
    const template = await showTemplate.execute({ id: newTemplate.id });

    expect(template).toHaveProperty('id');
  });

  it('should NOT be able to show an INEXISTENT template', async () => {
    /*
    RETURN AN INVALID TEMPLATE (ERROR)
    */
    expect(showTemplate.execute({ id: '1234567890' })).rejects.toBeInstanceOf(
      AppError
    );
  });
});
