const registerationSchema = `
CREATE TABLE IF NOT EXISTS event_registrations (
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  event_id INT REFERENCES events(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, event_id)
);
`;

export default registerationSchema;
