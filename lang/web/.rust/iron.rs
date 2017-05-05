extern crate iron;
extern crate logger;
extern crate env_logger;
#[macro_use]
extern crate router;

use std::env;
use iron::{Iron, Request, Response, IronResult, Chain};
use logger::Logger;
use router::Router;

fn main() {
    env_logger::init().unwrap();

    let router = router!(
        index: get "/" => handle_index,
        who: get "/:who" => handle_who
    );

    let (logger_before, logger_after) = Logger::new(None);
    let mut chain = Chain::new(router);
    // // Link logger_before as your first before middleware.
    chain.link_before(logger_before);
    // // Link logger_after as your *last* after middleware.
    chain.link_after(logger_after);

    let url = match env::var("PORT") {
        Ok(p) => "localhost:".to_owned() + &p,
        Err(_) => "localhost:3333".to_owned()
    };
    Iron::new(chain).http(url).unwrap();
}

// fn no_op_handler(_: &mut Request) -> IronResult<Response> {
//     Ok(Response::with(iron::status::Ok))
// }

fn handle_index(_: &mut Request) -> IronResult<Response> {
    Ok(Response::with((iron::status::Ok, "index page")))
}

fn handle_who(req: &mut Request) -> IronResult<Response> {
    let ref query = req.extensions.get::<Router>().unwrap().find("who").unwrap();
    Ok(Response::with((iron::status::Ok, "Hello ".to_owned() + &query)))
}
