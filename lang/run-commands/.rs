use std::io::prelude::*;
use std::io::Error;
use std::str;
use std::process::{Command, Stdio, Child, ChildStdout};
use std::time::Duration;
use std::thread::sleep;

#[derive(Debug)]
enum CommandError {
    Utf8(str::Utf8Error),
    Err(Error)
}

impl From<str::Utf8Error> for CommandError {
    fn from(err: str::Utf8Error) -> CommandError {
        CommandError::Utf8(err)
    }
}

impl From<Error> for CommandError {
    fn from(err: Error) -> CommandError {
        CommandError::Err(err)
    }
}

fn wc_proc() -> Result<Child, Error> {
    Command::new("wc")
        .stdin(Stdio::piped())
        .stdout(Stdio::piped())
        .spawn()
}

fn stdout(child: &mut ChildStdout) -> Result<String, Error> {
    let mut s = String::new();
    child.read_to_string(&mut s).map(|_| s)
}

fn run() -> Result<String, CommandError> {
    let wc_process = try!(wc_proc());
    let date_output = try!(Command::new("date").arg("+%H:%M:%S").output());
    // 別にそのまま渡せばいいけど、エラーハンドルの練習
    let date_stdout = try!(str::from_utf8(&date_output.stdout));

    try!(wc_process.stdin.unwrap().write_all(date_stdout.as_bytes()));
    let stdout = try!(stdout(&mut wc_process.stdout.unwrap()));
    Ok(stdout.to_owned())
}

fn main() {
    // 1秒待つ
    sleep(Duration::new(1, 0));
    match run() {
        Err(why) => panic!("Caught error: {:?}", why),
        Ok(s) => println!("{}", s)
    }
}
