interface IJobCacheDTO {
  id: string;
  status: 'pending' | 'completed';
}

/*
UPDATES THE ORDER RENDER STATUS
*/
export function UpdateOrderRenderStatus({
  job,
  projectsToRender
}): IJobCacheDTO[] {
  const job_id = job.id;
  let response: IJobCacheDTO[] = projectsToRender;

  try {
    const jobIndex = projectsToRender.findIndex(
      (project: IJobCacheDTO) => project.id === job_id
    );
    response[jobIndex].status = 'completed';
  } catch (error) {}
  return response;
}

/*
CHECKS IF ALL ORDER RENDERS ARE COMPLETED.
*/
export function IsOrderRendersCompleted(
  projectsToRender: IJobCacheDTO[]
): boolean {
  for (const key in projectsToRender) {
    if (projectsToRender[key].status !== 'completed') return false;
  }
  return true;
}
