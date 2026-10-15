#[derive(Debug)]
pub struct OrderIntent {
    pub symbol: String,
    pub quantity: u32,
    pub side: String,
}

impl OrderIntent {
    pub fn new(symbol: &str, quantity: u32, side: &str) -> Self {
        Self {
            symbol: symbol.to_string(),
            quantity,
            side: side.to_string(),
        }
    }
}

