/* ============================================================
   Marhaba Delivery — FAKE / DEMO DATA seed script (Node.js)
   ------------------------------------------------------------
   Fills every collection: roles, statuses, users, categories,
   produits, payements, commands.

   HOW TO RUN (from the "server" folder):
     node seed.js

   It reads DATABASE_URL from server/.env, so no connection
   string to type and no mongosh needed.

   It is RE-RUNNABLE: it wipes the demo content collections and
   the demo users, then reinserts. Do NOT run it on a database
   that holds real data you want to keep.

   All demo users share the password:  111111
   Accounts:
     manager@gmail.com   (manager)
     client@gmail.com    (client)
     client2@gmail.com   (client)
     livreur@gmail.com   (delivery)
   ============================================================ */

require("dotenv").config();
const mongoose = require("mongoose");

const Role      = require("./models/roleModal");
const Status    = require("./models/statusModal");
const User      = require("./models/userModal");
const Categorie = require("./models/categorieModal");
const Produit   = require("./models/produitModal");
const Payement  = require("./models/payementModal");
const Command   = require("./models/commandModal");

// bcrypt hash of "111111"
const PW = "$2a$10$7NEUjRYTMSeMP4cXvSK/iOWGz7ywnSoTZtR6YDYT00F2JeWS50eru";

async function upsert(Model, name) {
  return Model.findOneAndUpdate(
    { name },
    { $setOnInsert: { name } },
    { upsert: true, new: true }
  );
}

async function seed() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is missing in server/.env");

  await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log("Connected to", mongoose.connection.name);

  // ---- 1. ROLES (idempotent) --------------------------------
  const roleManager = (await upsert(Role, "manager"))._id;
  const roleLivreur = (await upsert(Role, "livreur"))._id;
  const roleClient  = (await upsert(Role, "client"))._id;

  // ---- 2. STATUSES (idempotent) -----------------------------
  const stDemande   = (await upsert(Status, "demandé"))._id;
  const stLivraison = (await upsert(Status, "livraison..."))._id;
  const stLivre     = (await upsert(Status, "livré"))._id;

  // ---- 3. WIPE demo content so the script is re-runnable -----
  await Categorie.deleteMany({});
  await Produit.deleteMany({});
  await Payement.deleteMany({});
  await Command.deleteMany({});
  await User.deleteMany({
    email: { $in: ["manager@gmail.com", "client@gmail.com", "client2@gmail.com", "livreur@gmail.com"] },
  });

  // ---- 4. USERS ---------------------------------------------
  const manager = (await User.create({ username: "manager", email: "manager@gmail.com", password: PW, roles: [roleManager], verification: true, status: true }))._id;
  const client  = (await User.create({ username: "client",  email: "client@gmail.com",  password: PW, roles: [roleClient],  verification: true, status: true }))._id;
  const client2 = (await User.create({ username: "sara",    email: "client2@gmail.com", password: PW, roles: [roleClient],  verification: true, status: true }))._id;
  const livreur = (await User.create({ username: "livreur", email: "livreur@gmail.com", password: PW, roles: [roleLivreur], verification: true, status: true }))._id;

  // ---- 5. CATEGORIES ----------------------------------------
  const cat = await Categorie.insertMany([
    { name: "Burgers", status: true }, // 0
    { name: "Pasta",   status: true }, // 1
    { name: "Salads",  status: true }, // 2
    { name: "Sushi",   status: true }, // 3
    { name: "Baked",   status: true }, // 4
  ]);

  // ---- 6. PRODUITS (dishes) ---------------------------------
  // Each dish points at a real photo in server/public/ so the
  // name matches the picture. Drop the meal-images into
  // server/public/ for the photos to display.
  const prod = await Produit.insertMany([
    // Burgers
    { title: "Classic Beef Burger",  quantity: 50, categorie: [cat[0]._id], description: "Grilled beef patty, cheddar, lettuce and house sauce, served with fries.", price: 45, image: ["1671722306453.jpg"], status: true },
    { title: "Cheeseburger & Fries", quantity: 45, categorie: [cat[0]._id], description: "Double beef patty, melted cheese and crispy golden fries.",             price: 52, image: ["1671997304736.jpg"], status: true },
    { title: "Chicken Burger",       quantity: 40, categorie: [cat[0]._id], description: "Crispy chicken fillet, fresh lettuce and creamy sauce in a soft bun.",     price: 40, image: ["1671721663182.jpg"], status: true },
    { title: "Veggie Burger",        quantity: 35, categorie: [cat[0]._id], description: "Grilled veggie patty with lettuce, tomato and vegan mayo.",               price: 38, image: ["1671997421387.jpg"], status: true },
    // Pasta
    { title: "Spaghetti Napolitana", quantity: 30, categorie: [cat[1]._id], description: "Spaghetti tossed in tomato sauce with cherry tomatoes and spinach.",       price: 48, image: ["1671722518148.jpg"], status: true },
    { title: "Penne Alfredo",        quantity: 28, categorie: [cat[1]._id], description: "Penne pasta in a rich, creamy parmesan Alfredo sauce.",                   price: 55, image: ["1671972107682.jpg"], status: true },
    { title: "Creamy Penne",         quantity: 26, categorie: [cat[1]._id], description: "Penne with a creamy herb sauce, freshly plated.",                        price: 50, image: ["1672218829571.jpg"], status: true },
    // Salads
    { title: "Garden Salad",         quantity: 40, categorie: [cat[2]._id], description: "Fresh mixed greens, cucumber, carrots and boiled egg.",                  price: 32, image: ["1671722881374.jpg"], status: true },
    { title: "Chef's Salad",         quantity: 38, categorie: [cat[2]._id], description: "Crisp lettuce, sweet corn, veggies and a light vinaigrette.",            price: 35, image: ["1671997345624.jpg"], status: true },
    // Sushi
    { title: "Salmon Maki Set",      quantity: 18, categorie: [cat[3]._id], description: "Eight pieces of fresh maki rolls served with soy and ginger.",          price: 90, image: ["1671723048463.jpg"], status: true },
    // Baked
    { title: "Chicken Gratin",       quantity: 22, categorie: [cat[4]._id], description: "Oven-baked chicken and pasta in a golden, cheesy cream sauce.",          price: 60, image: ["1671723122383.jpg"], status: true },
    { title: "Baked Pasta Casserole",quantity: 20, categorie: [cat[4]._id], description: "Hearty baked pasta casserole topped with bubbling melted cheese.",       price: 58, image: ["1671723126509.jpg"], status: true },
  ]);

  // ---- 7. PAYEMENTS (cash only) -----------------------------
  const pay1 = (await Payement.create({ client: [client],  adresse: "12 Rue Hassan II, Casablanca", phone: 212661223344, price: "90",  mode: "cash on delivery" }))._id;
  const pay2 = (await Payement.create({ client: [client2], adresse: "45 Av. Mohammed V, Rabat",     phone: 212677889900, price: "127", mode: "cash on delivery" }))._id;
  const pay3 = (await Payement.create({ client: [client],  adresse: "8 Bd Zerktouni, Marrakech",    phone: 212612345678, price: "55",  mode: "cash on delivery" }))._id;

  // ---- 8. COMMANDS (orders) ---------------------------------
  await Command.insertMany([
    { client: [client],  livreur: [livreur], produit: [prod[0]._id], quantite: 2, total: 90,  payement: [pay1], status: [stLivre] },
    { client: [client2], livreur: [livreur], produit: [prod[4]._id], quantite: 1, total: 55,  payement: [pay2], status: [stLivraison] },
    { client: [client2], livreur: [],        produit: [prod[8]._id], quantite: 1, total: 110, payement: [pay2], status: [stDemande] },
    { client: [client],  livreur: [],        produit: [prod[4]._id], quantite: 1, total: 55,  payement: [pay3], status: [stDemande] },
  ]);

  // ---- SUMMARY ----------------------------------------------
  console.log("Done.");
  console.log("  roles:      " + (await Role.countDocuments()));
  console.log("  statuses:   " + (await Status.countDocuments()));
  console.log("  users:      " + (await User.countDocuments()));
  console.log("  categories: " + (await Categorie.countDocuments()));
  console.log("  produits:   " + (await Produit.countDocuments()));
  console.log("  payements:  " + (await Payement.countDocuments()));
  console.log("  commands:   " + (await Command.countDocuments()));
  console.log("Login with any account below, password = 111111");
  console.log("  manager@gmail.com | client@gmail.com | client2@gmail.com | livreur@gmail.com");
}

seed()
  .catch((err) => console.error("Seed error:", err))
  .finally(() => mongoose.disconnect());