CREATE TABLE fields (
  id SERIAL PRIMARY KEY,
  name VARCHAR(80) NOT NULL,
  price_per_hour NUMERIC(10,2) NOT NULL
);

CREATE TABLE reservations (
  id SERIAL PRIMARY KEY,
  field_id INTEGER REFERENCES fields(id),
  customer_name VARCHAR(100) NOT NULL,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO fields (name, price_per_hour) VALUES
  ('Lapangan A', 100000),
  ('Lapangan B', 120000),
  ('Lapangan C', 150000);

-- Data dummy tahun 2020 (200.000 baris) agar query OVERLAPS terasa berat saat load test.
INSERT INTO reservations (field_id, customer_name, start_time, end_time)
SELECT 1 + (g % 3),
       'Dummy ' || g,
       TIMESTAMP '2020-01-01' + g * INTERVAL '1 hour',
       TIMESTAMP '2020-01-01' + g * INTERVAL '1 hour' + INTERVAL '30 minutes'
FROM generate_series(1, 200000) g;
