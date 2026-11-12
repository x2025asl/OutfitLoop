// All names and listings are fictional. Images are served by Unsplash.
const STARTUP = {
  name: "OutfitLoop",
  tagline: "Good outfits. Better stories.",
  pitch: "Find your next favorite look, pass a good thing along, and make the most of what’s already in your closet."
};

const OUTFITS = [
  { id: "look-1", title: "Coffee, then everywhere", creator: "Mia R.", style: "Everyday", likes: 128, image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=85", alt: "Friends in relaxed everyday outfits", items: "Trench coat · white tee · straight-leg denim" },
  { id: "look-2", title: "A little after-hours", creator: "Jules T.", style: "Going out", likes: 96, image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=85", alt: "A dressed-up street-style look", items: "Black blazer · satin skirt · boots" },
  { id: "look-3", title: "Soft layers, sunny day", creator: "Avery K.", style: "Everyday", likes: 74, image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=800&q=85", alt: "Layered casual outfit in warm colors", items: "Knit sweater · relaxed trousers · tote" },
  { id: "look-4", title: "The art of the in-between", creator: "Sam P.", style: "Street style", likes: 112, image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=85", alt: "A confident, colorful street-style outfit", items: "Vintage jacket · wide-leg jeans · sneakers" },
  { id: "look-5", title: "Sunday, on repeat", creator: "Noah L.", style: "Everyday", likes: 63, image: "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&w=800&q=85", alt: "A relaxed, thoughtfully styled outfit", items: "Striped shirt · easy trousers · loafers" },
  { id: "look-6", title: "One good little black dress", creator: "Remy D.", style: "Going out", likes: 89, image: "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=800&q=85", alt: "A classic black dress styled for an evening out", items: "Vintage dress · gold hoops · barely-there heels" }
];

const MARKET_LISTINGS = [
  { id: "market-1", name: "The always-right trench", category: "Outerwear", description: "Lightweight, roomy, ready for its next rainy-day walk.", condition: "Very good", seller: "Mia R.", price: 42, offer: "sale", image: "https://images.unsplash.com/photo-1548126032-079a0fb0099d?auto=format&fit=crop&w=700&q=85", alt: "Classic neutral trench coat" },
  { id: "market-2", name: "Soft knit, big-sleeve energy", category: "Tops", description: "Cozy oatmeal knit. Hoping to swap for a similar green one.", condition: "Like new", seller: "Avery K.", price: 0, offer: "swap", image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=700&q=85", alt: "Soft neutral knit sweater" },
  { id: "market-3", name: "Denim that gets better", category: "Bottoms", description: "A broken-in favorite with lots of life left in it.", condition: "Good", seller: "Jules T.", price: 28, offer: "both", image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=700&q=85", alt: "A pair of classic blue jeans" },
  { id: "market-4", name: "A little black dress", category: "Dresses", description: "The perfect plus-one for dinner plans and dance floors.", condition: "Very good", seller: "Remy D.", price: 36, offer: "sale", image: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=700&q=85", alt: "A versatile black dress" },
  { id: "market-5", name: "Weekend canvas tote", category: "Accessories", description: "Room for a book, a snack, and whatever the day brings.", condition: "Like new", seller: "Noah L.", price: 0, offer: "swap", image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=700&q=85", alt: "A simple everyday canvas tote" },
  { id: "market-6", name: "Your next favorite boots", category: "Shoes", description: "Comfy ankle boots looking for a new city to explore.", condition: "Good", seller: "Sam P.", price: 54, offer: "both", image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=700&q=85", alt: "A pair of timeless ankle boots" }
];

const CLOSET_STARTER_ITEMS = [
  { id: "closet-1", name: "Sunday white tee", category: "Tops", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=500&q=80", alt: "A white cotton t-shirt" },
  { id: "closet-2", name: "Favorite straight-leg jeans", category: "Bottoms", image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=500&q=80", alt: "A pair of blue jeans" },
  { id: "closet-3", name: "The light layer", category: "Outerwear", image: "https://images.unsplash.com/photo-1548126032-079a0fb0099d?auto=format&fit=crop&w=500&q=80", alt: "A light neutral jacket" },
  { id: "closet-4", name: "Everyday canvas tote", category: "Accessories", image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=500&q=80", alt: "A neutral everyday tote bag" }
];
