import 'reflect-metadata';
import AppError from '@shared/errors/AppError';

import SendContactEmailService from './SendContactEmailService';
import FakeQueueProvider from '@shared/container/providers/QueueProvider/fakes/FakeQueueProvider';

let fakeQueueProvider: FakeQueueProvider;
let sendContactEmailService: SendContactEmailService;

describe('SendContactEmail', () => {
  beforeEach(() => {
    fakeQueueProvider = new FakeQueueProvider();
    sendContactEmailService = new SendContactEmailService(fakeQueueProvider);
  });

  it('should be able to send a contact email', async () => {
    const sendMail = jest.spyOn(fakeQueueProvider, 'add');

    await sendContactEmailService.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      message: 'Message text'
    });

    expect(sendMail).toHaveBeenCalled();
  });
});
