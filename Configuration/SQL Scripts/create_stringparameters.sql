CREATE TABLE bool_parameters(
    UUID        BIGSERIAL PRIMARY KEY,

    name        VARCHAR(20) NOT NULL,
    value       VARCHAR(256),
    record_time TIMESTAMP NOT NULL DEFAULT now()

    -- foreign key --
    batch_id    INTEGER REFERENCES batch(UUID)
);