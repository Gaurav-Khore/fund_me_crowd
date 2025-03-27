use solana_program::{clock::Clock, sysvar::Sysvar};


pub fn add_days_to_clock(days: i64) -> i64 {
    let clock = Clock::get().unwrap().unix_timestamp + (days * 86400);
    return clock
}
