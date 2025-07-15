import {Router} from 'express';
import { cancelRegisteredController, createEventController, eventStatsController, getEventController, listUpcomingEventsController, registeredController } from '../controllers/eventController.js';
const eventRoutes = Router();

eventRoutes.post('/create',createEventController);
eventRoutes.get('/detail',getEventController);
eventRoutes.post('/register',registeredController);
eventRoutes.post('/register/cancel',cancelRegisteredController);
eventRoutes.get('/stats/:eventId',eventStatsController);
eventRoutes.get('/upcoming',listUpcomingEventsController);

export default eventRoutes;