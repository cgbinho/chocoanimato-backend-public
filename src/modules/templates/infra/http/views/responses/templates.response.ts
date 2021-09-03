import Template from '@modules/templates/infra/typeorm/entities/Template';

import appConfig from '@config/app';
import storageConfig from '@config/storage';
import { Pagination } from '@shared/infra/typeorm/pagination/entities/Pagination';

export default {
  render(template: Template) {
    const {
      id,
      name,
      description,
      category,
      path,
      duration,
      ratio,
      price
    } = template;

    const video = `${storageConfig[storageConfig.driver].url.templates}/${
      template.path
    }/video.mp4`;

    const thumbnail = `${storageConfig[storageConfig.driver].url.templates}/${
      template.path
    }/thumbnail.jpg`;

    return {
      id,
      name,
      video,
      thumbnail,
      description,
      category,
      duration,
      ratio,
      price
    };
  },
  renderMany(templates: Template[]) {
    return templates.map(template => this.render(template));
  },
  index(data: Pagination<Template>) {
    const { results, page_total, total } = data;

    const templates = results.map(template => this.render(template));

    return { results: templates, page_total, total };
  }
};
