use market_primitives::OrderIntent;

fn main() {
    let intent = OrderIntent::new("NIFTY", 50, "SELL");
    println!("Execution kernel bootstrap: {:?}", intent);
}

