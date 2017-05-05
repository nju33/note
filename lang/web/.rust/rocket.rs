#![feature(plugin)]
#![plugin(rocket_codegen)]

extern crate rocket;
extern crate rocket_contrib;
// extern crate serde;
// extern crate serde_json;
// #[macro_use]
// extern crate serde_derive;
#[macro_use]
extern crate mysql;

use rocket::Request;
use rocket_contrib::Template;
use mysql::Pool;

// 2017.05
//    |
// 33 |     Template::render("index", &context)
//    |     ^^^^^^^^^^^^^^^^ the trait `serde::ser::Serialize` is not implemented for `TemplateContext`
//
// #[derive(Serialize, Deserialize)]
// struct TemplateContext {
//     template_name: String,
//     users: Option[Vec<User>],
// }
//

//
// こんな感じにして `Pool::new(*get_mysql_opts())` するとライフタイムを求められる
//
// fn get_mysql_opts<'a>() -> &'a mut OptsBuilder {
//     let mut builder: &'a OptsBuilder = mysql::OptsBuilder::new();
//     builder
//         .ip_or_hostname(Some("0.0.0.0"))
//         .tcp_port(3307)
//         .user(Some("root"))
//         .pass(Some("pass"))
// }
//
// ```
// = note: expected type `&'a mysql::OptsBuilder`
//         found type `mysql::OptsBuilder`
// = help: try with `&mysql::OptsBuilder::new()`
// ```
//
// ただ、戻り値を`-> &mut OptsBuilder`としても
// builderのライフライムが短い（get_mysql_opts()の値を取得する時点）と怒られてコンパイルできないので
// OptsBuilderとPool::newの部分は同じライフタイム間でやるしかない？
// だから`get_opts`とかじゃなくて`get_pool`？
//
// ---
//
// `get_pool`をconstで定義してしまおうと思ったけど、immutableじゃないとダメっぽいので断念
// `static`もよく分からん
//
// ---
//
// const url: &'static str = "mysql://root:pass@0.0.0.0:3307";
// Pool::new(url)
// でもいい
//
fn get_pool() -> Pool {
    let mut builder = mysql::OptsBuilder::new();
    builder
        .ip_or_hostname(Some("0.0.0.0"))
        .tcp_port(3307)
        .user(Some("root"))
        .pass(Some("pass"));
    match Pool::new(builder) {
        Err(e) => panic!("{:?}", e),
        Ok(pool) => pool
    }
}

#[derive(Debug, PartialEq, Eq)]
struct User {
    id: i32,
    name: String
}

#[get("/")]
fn index() -> &'static str {
    "hello"
}

#[get("/hello/<who>")]
fn who(who: &str) -> String {
    format!("Hello {}", who)
}

#[get("/users")]
fn users() -> Template {
    // 2017.05
    // ref: @struct
    //
    // let users = get_users().unwrap_or(Vec::new());
    // let ctx = TemplateContext {
    //     template_name: String::from("users"),
    //     users: users
    // };

    let mut map = std::collections::HashMap::new();
    map.insert("template_name", "users");
    Template::render("users", &map)
}

#[error(404)]
fn not_found(_: &Request) -> String {
    format!("Not found")
}

#[allow(dead_code)]
fn get_users() -> Result<Vec<User>, mysql::Error> {
    let pool = get_pool();
    pool.prep_exec("SELECT * from tmp.users", ()).map(|list| {
        list.map(|item| {
            let (id, name) = mysql::from_row(item.unwrap());
            User {id: id, name: name}
        // let x: <T> みたいに宣言してないからタイプを指定しないといけない
        }).collect::<Vec<User>>()
    })
}

fn prepare() {
    // TEMPORARYを付けるとうまくいかない
    // Insterなどでtmp.usersテーブルが見つからない
    //
    // pool.prep_exec(
    //     "CREATE TEMPORARY TABLE tmp.users
    //     (id int not null, name varchar(255) not null)",
    //     ()
    // ).unwrap();
    //

    let pool = get_pool();
    // ここも1つのprep_execでDROP->CREATEとしかたかったけど
    // 何故かできないので分ける
    pool.prep_exec("DROP TABLE tmp.users", ())
        .and_then(|_| {
            pool.prep_exec(r#"
                CREATE TABLE tmp.users (
                    id int not null UNIQUE AUTO_INCREMENT,
                    name varchar(255) not null
                )"#, ()
            )
        }).unwrap();

    //
    // pool.parepare(..x) の時点で Ok(..a)
    // pool.parepare(..x).into_iter() の時点で IntoIter { inner: Some (..a)}
    // || One benefit of implementing IntoIterator is that your type will work
    // || with Rust's for loop syntax.
    // ちなみに
    // pool.parepare(..x).iter() -> Iter { inner: Some (..a)}
    //
    // ---
    //
    // iter(), which iterates over &T.
    // iter_mut(), which iterates over &mut T.
    // into_iter(), which iterates over T.
    //
    // ---
    //
    // こんなでもいける
    // 1. let mut stmt = pool.prepare("INSERT INTO tmp.users (name) values (:name)").unwrap();
    // 2. let x = pool.prepare("INSERT INTO tmp.users (name) values (:name)"):
    //    let insert = x.iter_mut();
    //    続けて書くと `temporary value dropped here while still borrowed`
    //    iterとinter_mutはownershipを取られて
    //
    // ---
    //
    // http://stackoverflow.com/questions/43694366/what-is-the-difference-between-assigning-an-expression-to-a-variable-vs-just-inl
    // iterとiter_mutが使ってるのは参照で
    // pool.prepare(...).iter()みたいなのは参照をラップしたみたいなものを返すけど、
    // pool.prepare(...)は式分の直接のターゲットじゃないので、iter()が返したタイミングで開放されてしまう
    // と、うまくiter()が使えなくなるのでエラーになる？
    // into_iter()は自身を含めiteratorに変える
    //
    let insert = pool.prepare("INSERT INTO tmp.users (name) values (:name)").into_iter();
    for mut stmt in insert {
        for u in &[
           User {id: 1, name: String::from("foo")},
           User {id: 2, name: String::from("bar")}
        ] {
            stmt.execute(params!{"name" => &u.name}).unwrap();
        }
    }
}

fn main() {
    prepare();

    rocket::ignite()
        .mount("/", routes![index, who, users])
        .catch(errors![not_found])
        .launch();
}
