CREATE TABLE batch(
    UUID    SERIAL PRIMARY KEY,

    batch_name  VARCHAR(40) NOT NULL,

    start_time  TIMESTAMPTZ NOT NULL DEFAULT now(),
    end_time    TIMESTAMPTZ,

    status      VARCHAR(15)

);