import { Router } from 'express';
import { getCustomRepository, getRepository } from 'typeorm';
import { parseISO } from 'date-fns';

import AppointmentsRepository from '../repositories/AppointmentsRepository';
import CreateAppointmentService from '../services/CreateAppointmentService';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const appointmentsRouter = Router();

// appointmentsRouter.use(ensureAuthenticated);

appointmentsRouter.get('/', async (request, response) => {
  const appointmentsRepository = getCustomRepository(
    AppointmentsRepository,
    process.env.NODE_ENV,
  );
  const appointments = await appointmentsRepository.find();

  return response.json(appointments);
});

appointmentsRouter.post('/', async (request, response) => {
  try {
    const { provider_id, date } = request.body;

    if (!provider_id) {
      return response.status(400).json({ error: 'provider_id not informed' });
    }
    if (!date) {
      return response.status(400).json({ error: 'date not informed' });
    }

    const usersRepository = getRepository('users', process.env.NODE_ENV);

    const user = await usersRepository.findOne({ where: { id: provider_id } });
    if (!user) {
      return response
        .status(400)
        .json({ error: 'Does not exist an user with given id' });
    }

    const parsedDate = parseISO(date);

    const createAppointment = new CreateAppointmentService();

    const appointment = await createAppointment.execute({
      date: parsedDate,
      provider_id,
    });

    return response.json(appointment);
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

export default appointmentsRouter;
