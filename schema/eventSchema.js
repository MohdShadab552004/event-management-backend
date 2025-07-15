const eventSchema = `
CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  datetime TIMESTAMP NOT NULL,
  location VARCHAR(255) NOT NULL,
  capacity INT CHECK (capacity > 0 AND capacity <= 1000)
);
`;

export default eventSchema;
