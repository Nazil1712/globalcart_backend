const { WishList } = require("../model/WishList");

exports.addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    const existingItem = await WishList.findOne({
      user: req.user.id,
      product: productId,
    });

    if (existingItem) {
      return res.status(400).json({
        success: false,
        message: "Product already exists in wishlist",
      });
    }

    const wishlistItem = await WishList.create({
      user: req.user.id,
      product: productId,
    });

    res.status(201).json({
      success: true,
      message: "Product added to wishlist",
      data: wishlistItem,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Logged In User Wishlist
exports.getWishlist = async (req, res) => {
  console.log("Req", req);
  try {
    const wishlist = await WishList.find({
      user: req.user.id,
    }).populate("product");

    res.status(200).json({
      success: true,
      totalItems: wishlist.length,
      data: wishlist,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Remove Product From Wishlist
exports.removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    await WishList.findOneAndDelete({
      user: req.user.id,
      product: productId,
    });

    res.status(200).json({
      success: true,
      message: "Product removed from wishlist",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
