import redisConfig from '@config/redis';
import ICreateProjectDTO from '@modules/projects/dtos/ICreateProjectDTO';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import {
  IsOrderRendersCompleted,
  UpdateOrderRenderStatus
} from '@shared/container/providers/CacheProvider/utils/OrderCacheUtils';
import IQueueProvider from '@shared/container/providers/QueueProvider/models/IQueueProvider';
import { inject, injectable } from 'tsyringe';

@injectable()
class ProcessOrderRenders {
  constructor(
    @inject('QueueProvider')
    private queueProvider: IQueueProvider,
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider
  ) {}

  queueName(): string {
    return 'OrderRenders';
  }

  async execute(): Promise<any> {
    const result = await this.queueProvider.process(
      'OrderRenders',
      async job => {
        const { order, projects } = job.data as any;
        /*
        SAVE ORDER RENDER STATUS TO CACHE
        // create a redis cache with information about this order render status
        // save a key pair with order.id and an array of project_ids
        */
        // CREATE AN OBJECT WITH ALL PROJECTS TO BE RENDERED
        const projectsToRender = projects.map((project: ICreateProjectDTO) => ({
          id: project.id,
          status: 'pending'
        }));

        /*
        SAVE RENDER ORDERS TO CACHE
        */
        await this.cacheProvider.saveWithExpiration(
          `order-render:${order.id}`,
          projectsToRender,
          redisConfig.token.expiresIn // 24 horas
        );

        /*
        RENDER ALL PROJECTS
        */
        await Promise.all(
          projects.map(async (project: ICreateProjectDTO) => {
            const job = await this.queueProvider.add(
              'RenderVideo',
              {
                project: {
                  id: project.id,
                  name: project.name,
                  path: project.path,
                  fields: project.fields,
                  duration: project.template.duration
                }
              },
              { jobId: project.id, removeOnComplete: true }
            );
            /*
            CACHE RENDER STATUS WHEN RENDERVIDEO IS COMPLETED
            */
            job.queue.on('completed', async (job, result) => {
              /*
            RECOVER RENDER STATUS FROM CACHE
            */
              const projectsToRender = await this.cacheProvider.recover<object>(
                `order-render:${order.id}`
              );
              /*
              UPDATE RENDER STATUS TO CACHE
              */
              const projectsToRenderUpdated = UpdateOrderRenderStatus({
                job,
                projectsToRender
              });

              /*
              CHECKS IF ALL RENDERS COMPLETED
              */
              if (IsOrderRendersCompleted(projectsToRenderUpdated)) {
                /*
                ADD ORDER LINKS AND RECEIPT TO QUEUE - Videos completed, we need to generate links, receipt and delivery email.
                */
                await this.queueProvider.add('OrderLinksAndReceipt', {
                  order,
                  projects
                });
              }
            });
          })
        );
        return { message: 'ok' };
      }
    );
    return result;
  }
}

export default ProcessOrderRenders;
