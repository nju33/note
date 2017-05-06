extern crate orm;
extern crate diesel;

use self::orm::*;
use self::orm::models::*;
// http://docs.diesel.rs/diesel/prelude/index.html
use self::diesel::prelude::*;

fn main() {
    use orm::schema::posts::dsl::*;
    // posts::table -> posts
    // posts::published -> published
    // posts::id -> id か?

    let connection = establish_connection();
    let results = posts.filter(published.eq(false))
        .limit(5)
        .load::<Post>(&connection)
        .expect("Error loading posts");

    println!("Displaying {} posts", results.len());
    for post in results {
        println!("{}", post.title);
        println!("----------\n");
        println!("{}", post.body);
    }
}
