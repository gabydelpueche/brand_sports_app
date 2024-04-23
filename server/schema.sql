-- @block
-- created
CREATE TABLE user_info(
    id UUID PRIMARY KEY UNIQUE,                 -- Added unique
    first_name VARCHAR(32) NOT NULL,               -- Save size
    last_name VARCHAR(32) NOT NULL,
    username VARCHAR(32) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,         -- Added unique
    password VARCHAR(255) NOT NULL,             -- Use hash size to save space
    created_at TIMESTAMP                        -- Added created at 
);

-- @block
CREATE TABLE work_schedule(
    id UUID PRIMARY KEY UNIQUE,             -- Add unique
    worker UUID REFERENCES user_info(id),
    start_time TIMESTAMP,                        -- Use timestamp instead of time to store date as well 
    end_time TIMESTAMP                           -- This can also be used to determine the day of the week
);

-- @block
CREATE TABLE time_off(
    id UUID PRIMARY KEY UNIQUE,                 -- Add unique
    worker UUID REFERENCES user_info(id),
    approved BOOLEAN,
    start_time TIMESTAMP,                       -- Switched these to timestamp as well to store the dates
    end_time TIMESTAMP,                         -- This allows the users to take of a large block of days (eg: 1/12/24 12:00 - 1/13/24 12:00)
    reason VARCHAR(511),                        -- Larger messages
    created_at TIMESTAMP
);

-- @block
CREATE TABLE switch_shifts(
    id UUID PRIMARY KEY UNIQUE,                     -- Add unique
    worker_1 UUID REFERENCES user_info(id),
    worker_2 UUID REFERENCES user_info(id),
    approved BOOLEAN,
    shift_requested TIMESTAMP,                      -- Same as other issues
    shift_traded TIMESTAMP,
    reason VARCHAR(511),                            -- Larger messages
    created_at TIMESTAMP
);

-- @block
DROP TABLE IF EXISTS user_info;

-- @block
SELECT * FROM user_info