import Project from '@modules/projects/infra/typeorm/entities/Project';
import Template from '@modules/templates/infra/typeorm/entities/Template';

import appConfig from '@config/app';
import storageConfig from '@config/storage';
import { Pagination } from '@shared/infra/typeorm/pagination/entities/Pagination';

interface IProjectResponse {
  id: string;
  name: string;
  path: string;
  status: string;
  user_id: string;
  template_id: string;
  sections: object[];
  fields: object[];
  form_values: { [key: string]: string }[];
  template: Template;
}
export default {
  render(project: any) {
    return getProject(project);
  },
  renderMany(projects: any) {
    return projects.map(project => this.render(getProject(project)));
  },
  index(data: Pagination<Project>) {
    const { results, page_total, total } = data;

    const projects = results.map(project => this.render(getProject(project)));

    return { results: projects, page_total, total };
  }
};

function getProject(project) {
  const {
    id,
    name,
    path,
    status,
    user_id,
    template_id,
    sections,
    fields,
    form_values,
    template,
    lottie = null
  } = project;

  const video = `${storageConfig[storageConfig.driver].url.templates}/${
    template.path
  }/video.mp4`;

  const thumbnail = `${storageConfig[storageConfig.driver].url.templates}/${
    template.path
  }/thumbnail.jpg`;

  return {
    id,
    name,
    // path,
    status,
    user_id,
    template_id,
    sections,
    fields,
    form_values,
    template: {
      ...project.template,
      video,
      thumbnail
    },
    lottie
  };
}
