// thực hiện thao tác CRUD với monggo

const productModel = require("./product.model");
const categoryModel = require("./categories.model");
// const categoriesModel = require('./categories.model');
const Product = require("../mongo/product.model");
module.exports = {
  insert,
  gettAll,
  getByKey,
  updateById,
  remove,
  getNew,
  getById,
  search,
  getHot,
  getRelatedProductsByProductId,
  getProView,
  getDecrease,
  getAscending,
};

// xử lí dữ liệu ở contronller
async function insert(req, res) {
  try {
    const { name, img, price, quantity, category, description, hot, view } =
      req.body;
    const product = new Product({
      name,
      img,
      price,
      quantity,
      category,
      description,
      hot,
      view,
    });
    const savedProduct = await product.save();
    res.status(200).json(savedProduct);
  } catch (error) {
    console.error("Error", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function gettAll() {
  try {
    const result = await productModel.find();
    return result;
  } catch (error) {
    console.log("Lỗi lấy sp", error);
    throw error;
  }
}

async function getByKey(key, value) {
  try {
    const pro = await productModel.find({ [key]: value });
    return pro;
  } catch (error) {
    console.log("Lỗi lấy sp theo key", error);
    throw error;
  }
}

// cập nhật sp theo id

async function updateById(id, body) {
  try {
    const pro = await productModel.findById(id);
    if (!pro) {
      throw new Error("Không tìm thấy sản phẩm");
    }
    const { name, price, img, quantity, category, description, view, hot } =
      body;
    const result = await productModel.findByIdAndUpdate(
      id,
      { name, price, img, quantity, category, description, view, hot },
      { new: true }
    );
    return result;
  } catch (error) {
    console.log("Lỗi khi cập nhật sản phẩm:", error);
    throw error;
  }
}

// xóa sp theo id
async function remove(id) {
  try {
    const result = await productModel.findByIdAndDelete(id);
    return result;
  } catch (error) {
    console.log("LỖI XÓA SP THEO ID", error);
    throw error;
  }
}

async function getNew() {
  try {
    const result = await productModel.find().sort({ _id: -1 }).limit(4);
    return result;
  } catch (error) {
    console.log("LỖI", error);
    throw error;
  }
}

async function getHot() {
  try {
    const result = await productModel.find({ hot: 1 }).limit(4);
    return result;
  } catch (error) {
    console.log("LỖI", error);
    throw error;
  }
}

async function getById(id) {
  try {
    const proId = await productModel.findById(id);
    return proId;
  } catch (error) {
    console.log("LỖI LAAYS CHI TIẾT SP", error);
    throw error;
  }
}
// Trong product.controller.js

async function getRelatedProductsByProductId(id) {
  try {
    // Tìm sản phẩm với productId được cung cấp
    const product = await productModel.findById(id);
    // Trích xuất categoryId từ sản phẩm tìm được
    const categoryId = product.category.categoryId;

    // Tìm tất cả các sản phẩm trong cùng một category
    const relatedProducts = await productModel
      .find({
        "category.categoryId": categoryId,
        _id: { $ne: id }, // loại trừ sản phẩm hiện tại
      })
      .limit(4);
    console.log("Related Products in controller:", relatedProducts); // Kiểm tra kết quả trả về từ database

    return relatedProducts;
  } catch (error) {
    console.log("Lỗi lấy sản phẩm liên quan", error);
    throw error;
  }
}

async function search(name) {
  try {
    const result = await productModel.find(
      {
        name: { $regex: name, $options: "i" }, // i :không phân biệt hoa thường
      },
      { name: 1, price: 1, quantity: 1, img: 1 }
    );
    return result;
  } catch (error) {
    console.log("Lỗi lấy sp", error);
    throw error;
  }
}

async function getDecrease() {
  try {
    const result = await productModel.find().sort({ price: -1 }); // -1 laf giamr daanf
    return result;
  } catch (error) {
    console.log("Lỗi lấy sp", error);
    throw error;
  }
}
async function getAscending() {
  try {
    const result = await productModel.find().sort({ price: 1 });
    return result;
  } catch (error) {
    console.log("Lỗi lấy sp theo key", error);
    throw error;
  }
}

async function getProView() {
  try {
    const result = await productModel
      .find({ view: { $gte: 50 } })
      .sort({ view: -1 })
      .limit(4);
    return result;
  } catch (error) {
    console.log("Lỗi lấy sp", error);
    throw error;
  }
}
