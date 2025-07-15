import pool from "../config/db.js"

export const createEventController = async (req, res) => {
    const { title, datetime, location, capacity } = req.body;

    if (!title || !datetime || !location || !capacity) {
        return res.status(400).json({ 
            message: "all field is required" 
        });
    }
    if (capacity <= 0 || capacity > 1000) {
        return res.status(401).json({ 
            message: "capactiy must be between 1 to 1000" 
        });
    }

    try {
        const newEvent = await pool.query(
            `INSERT INTO events (title, datetime, location, capacity)
            VALUES ($1, $2, $3, $4) RETURNING *`,
            [title, datetime, location, capacity]
        );
        const eventId = newEvent.rows[0].id;
        res.status(201).json({ eventId, message: "event created successfull" });
    } catch (error) {
        return res.status(500).json({ error });
    }
}


export const getEventController = async (req, res) => {
    try {
        const events = await pool.query(
            `SELECT * FROM events 
            WHERE datetime > NOW()`
        );

        const eventDetails = await Promise.all(
            events.rows.map(async (event) => {
                const userRegistered = await pool.query(
                    `
                    SELECT users.id, users.name, users.email
                    FROM event_registrations
                    JOIN users ON users.id = event_registrations.user_id
                    WHERE event_registrations.event_id = $1
                    `,
                    [event.id]

                );
                return {
                    ...event,
                    userRegistered: userRegistered.rows
                }
            })
        )
        return res.status(200).json(eventDetails);

    } catch (error) {
        console.log(error)
        return res.status(500).json({ error });
    }
}

export const registeredController = async (req, res) => {
    const { userId, eventId } = req.body;

    try {
        const event = await pool.query(
            `SELECT * FROM event_registrations 
            WHERE user_id = $1 AND event_id = $2`,
            [userId, eventId]
        );

        if (event.rows.length !== 0) {
            res.status(400).json({ 
                message: "user already registered" 
            });
        }

        if (new Date(event.datetime) < new Date()) {
            return res.status(400).json({ 
                message: 'Cannot register for past events' 
            })
        }

        const checkDuplicate = await pool.query(
            `SELECT * FROM event_registrations 
            WHERE user_id = $1 AND event_id = $2`,
            [userId, eventId]
        );

        if (checkDuplicate.rows.length > 0) {
            return res.status(400).json({ 
                message: 'User already registered' 
            });
        }

        const registrationCount = await pool.query(
            `SELECT COUNT(*) FROM event_registrations 
            WHERE event_id = $1`,
            [eventId]
        );

        if (parseInt(registrationCount.rows[0].count) >= event.capacity) {
            return res.status(400).json({ 
                message: 'Event is full' 
            });
        }

        await pool.query(
            `INSERT INTO event_registrations (user_id, event_id)
            VALUES ($1, $2)`,
            [userId, eventId]
        );

        return res.status(200).json({ 
            message: 'Registration successful' 
        });

    } catch (error) {
        return res.status(500).json({ error });
    }

}

export const cancelRegisteredController = async (req, res) => {
    const { userId, eventId } = req.body;

    try {
        const check = await pool.query(
            `SELECT * FROM event_registrations 
            WHERE user_id = $1 AND event_id = $2`,
            [userId, eventId]
        );

        if (check.rows.length === 0) {
            return res.status(400).json({ 
                message: 'User is not registered for this event' 
            });
        }

        await pool.query(
            `DELETE FROM event_registrations 
            WHERE user_id = $1 AND event_id = $2`,
            [userId, eventId]
        );

        return res.status(200).json({ 
            message: 'Registration cancelled successfully' 
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }

}


export const eventStatsController = async (req, res) => {
    const { eventId } = req.params;
    try {
        const event = await pool.query(
            `SELECT * FROM events 
            WHERE id = $1`,
            [eventId]
        );
        if (event.rows.length === 0) {
            return res.status(404).json({ 
                message: 'Event not found' 
            });
        }


        const totalRegistrationCount = await pool.query(
            `SELECT COUNT(*) FROM event_registrations 
            WHERE event_id = $1`,
            [eventId]
        );

        const totalRegistrations = parseInt(totalRegistrationCount.rows[0].count);
        const remainingCapacity = event.rows[0].capacity - totalRegistrations;
        const percentageUsed = ((totalRegistrations / event.rows[0].capacity) * 100).toFixed(2);

        return res.status(200).json({
            total_registrations: totalRegistrations,
            remaining_capacity: remainingCapacity,
            percent_filled: `${percentageUsed}%`
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ 
            error: 'Internal Server Error' 
        });
    }
}


export const listUpcomingEventsController = async (req, res) => {
    try {
        const sortedEvent = await pool.query(
            `SELECT * FROM events 
            WHERE datetime > NOW() 
            ORDER BY datetime ASC,location ASC`
        )
        return res.status(200).json({
            message: "Upcoming events fetched successfully",
            events: sortedEvent.rows,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}