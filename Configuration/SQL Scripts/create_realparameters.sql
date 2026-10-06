CREATE TABLE real_parameters(
    UUID        BIGSERIAL PRIMARY KEY,

    name        VARCHAR(20) NOT NULL,
    value       REAL,
    record_time TIMESTAMP NOT NULL DEFAULT now()

    -- Add in foriegn key here --
    batch_id    INTEGER REFERENCES batch(UUID)
);