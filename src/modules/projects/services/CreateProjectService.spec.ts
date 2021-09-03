import FakeTemplatesRepository from '@modules/templates/repositories/fakes/FakeTemplatesRepository';
import CreateTemplateService from '@modules/templates/services/CreateTemplateService';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import CreateUserService from '@modules/users/services/CreateUserService';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeQueueProvider from '@shared/container/providers/QueueProvider/fakes/FakeQueueProvider';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import 'reflect-metadata';
import FakeProjectsRepository from '../../projects/repositories/fakes/FakeProjectsRepository';
import * as CreateFormFields from '../utils/createFormFields';
import CreateProjectService from './CreateProjectService';

beforeAll(async () => {});

let fakeTemplatesRepository: FakeTemplatesRepository;
let fakeProjectsRepository: FakeProjectsRepository;

let fakeHashProvider: FakeHashProvider;
let fakeStorageProvider: FakeStorageProvider;
let fakeQueueProvider: FakeQueueProvider;
let fakeCacheProvider: FakeCacheProvider;
let createUser: CreateUserService;
let createTemplate: CreateTemplateService;
let createProject: CreateProjectService;

describe('CreateProject', () => {
  /*
  CREATES A TEMPLATE
  */
  beforeEach(() => {
    fakeTemplatesRepository = new FakeTemplatesRepository();
    fakeProjectsRepository = new FakeProjectsRepository();
    fakeStorageProvider = new FakeStorageProvider();
    fakeCacheProvider = new FakeCacheProvider();

    createProject = new CreateProjectService(
      fakeProjectsRepository,
      fakeTemplatesRepository,
      fakeStorageProvider
    );
  });

  it('should be able to create a new project', async () => {
    const template = await fakeTemplatesRepository.create({
      name: 'Template Teste',
      description: 'Template Teste Description',
      category: ['video-explicativo'],
      duration: 60,
      ratio: '16:9',
      price: 99.99,
      path: 'Template_Teste',
      status: 'active'
    });

    jest.spyOn(CreateFormFields, 'default').mockImplementation(async () => ({
      project_name: 'Template 001',
      text_promo: 'Promoção',
      color_primary: '247,147,30,1',
      image_logo: 'image.png'
    }));

    const project = await createProject.execute({
      template_id: template.id,
      user_id: '123456'
    });
    expect(project).toHaveProperty('id');
  });

  // it('should not be able to create a new project', async () => {
  //   const fakeProjectsRepository = new FakeProjectsRepository();

  //   const createProject = new CreateProjectService(fakeProjectsRepository);

  //   const project = await createProject.execute({
  //     name: 'Project Teste',
  //     description: 'Project Teste Description',
  //     category: 'video-explicativo',
  //     duration: 60,
  //     ratio: '16:9',
  //     price: 99.99,
  //     path: 'Project_Teste',
  //     status: 0
  //   });

  //   expect(
  //     createProject.execute({
  //       name: 'Project Teste',
  //       description: 'Project Teste Description',
  //       category: 'video-explicativo',
  //       duration: 60,
  //       ratio: '16:9',
  //       price: 99.99,
  //       path: 'Project_Teste',
  //       status: 0
  //     })
  //   ).rejects.toBeInstanceOf(AppError);
  // });
});
