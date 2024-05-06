const { database } = require("./db");

async function availability(start, end){
    
    const records = await database.query("SELECT * FROM time_off");

    for(i = 0; i < records.rows[0].length; i++){
        const time_start = records.rows[0].start_time;
        const time_end = records.rows[0].end_time;

        const check_time = await database.query("SELECT * check_time($1, $2, $3, $4) as within_range", [time_start, time_end, start.getTime(), end.getTime()]);
        
        if(check_time.rows[0].within_range == false){
            return {
                status: 200,
                worker: data.rows[0].worker, 
                available: true
            };
        };

        if(check_time.rows[0].within_range == true) {
            // retrieve date from db
            // const start_day = new Date(data.rows[0].start_time);
            // const end_day = new Date(data.rows[0].end_time);
            // console.log("Start:" + start_day + "End:" + end_day);

            // convert date to month & day
            // const start_date = start_day.getDate();
            // const end_date = start_end.getDate();
            // console.log("New Start:" + start_date + "New End:" + end_date);

            return {
                status: 200,
                worker: data.rows[0].worker,
                available: false,
                from: data.rows[0].start_time,
                to: data.rows[0].end_time,
                message: data.rows[0].reason
            };
        };
    };
};

exports.availability = availability