const product = require("../model/product.model");
const Users = require("../model/login.model");
const Cart = require("../model/cart.model");

const addToCart = async (req, res) => {
  if (req.user.id !== req.params.AdminId) {
    return res
      .status(400)
      .json("Unauthorized User. You are not allowed to Add Products in Cart");
  }
  const { userID, items } = req.body;
  // const userID=req.params.AdminId;
  try {
    const cart = await Cart.findOne({ userID });
    if (cart) {
      // console.log(items[0].productID);
      const productId = items[0].productID;
      const Product = await product.findById(productId);

      if (!Product) {
        return res.status(404).json({ message: "Product not found" });
      } else {
        const existingItem = cart.items.find(
          (item) => item.productID.toString() === productId
        );
        if (existingItem) {
          existingItem.quantity += items[0].quantity;
          // console.log({existingItem});
          existingItem.price += items[0].price;
        } else {
          // console.log(items[0]);
          cart.items.push(items[0]);
          //    console.log("hello");
        }

        const cartData = await cart.save();
        const result = await Cart.findById(cartData._id)
          .populate("userID")
          .populate("items.productID", "-productQuantity");
        res.status(201).json({ result });
      }
    } else {
      const cart = await Cart.create({
        userID,
        items,
      });

      const cartData = await Cart.findById(cart._id)
        .populate("userID")
        .populate("items.productID", "-productQuantity");
      // const cart
      res.status(201).json({ cartData });
    }
  } catch (error) {
    return res
      .status(500)
      .json({
        error: { error_name: error.name, error_message: error.message },
      });
  }
};

const removeFromCart = async (req, res) => {
  if (req.user.id !== req.params.AdminId) {
    return res
      .status(400)
      .json(
        "Unauthorized User. You are not allowed to Remove Products from Cart"
      );
  }
  const { userID, items } = req.body;
  // const userID=req.params.AdminId;
  try {
    const cart = await Cart.findOne({ userID });
    if (cart) {
      // console.log({cart});
      // console.log(items[0].productID);
      const productId = items[0].productID;
      const Product = await product.findById(productId);
      if (!Product) {
        return res.status(404).json({ message: "Product not found" });
      } else {
        const existingItemIndex = cart.items.findIndex(
          (item) => item.productID.toString() === productId
        );
        if (existingItemIndex !== -1) {
          const existingItem = cart.items[existingItemIndex];
          // console.log(existingItem);
          existingItem.quantity -= items[0].quantity;
          existingItem.price -= items[0].price;
          if (existingItem.quantity === 0) {
            cart.items.splice(existingItemIndex, 1);
          }
        } else {
          return res.status(404).json({ message: "Product not found in cart" });
        }
        const cartData = await cart.save();
        const result = await Cart.findById(cartData._id).populate(
          "items.productID",
          "-productQuantity"
        );
        res.status(201).json({ result });
      }
    } else {
      return res.status(404).json({ message: `First add items in cart` });
    }
  } catch (error) {
    return res
      .status(500)
      .json({
        error: { error_name: error.name, error_message: error.message },
      });
  }
};

const getCart = async (req, res) => {
  if (req.user.id !== req.params.AdminId) {
    return res
      .status(400)
      .json("Unauthorized User. You are not allowed to See Cart");
  }
  // const user=req.params.AdminId;
  try {
    const cart = await Cart.find({
      userID: { $in: [req.params.AdminId] },
    }).populate("items.productID");
    if (cart) {
      res.status(200).json(cart);
    } else {
      return res.status(404).json("Cart Not found");
    }
  } catch (error) {
    return res
      .status(500)
      .json({
        error: { error_name: error.name, error_message: error.message },
      });
  }
};
module.exports = {
  addToCart,
  removeFromCart,
  getCart,
};
