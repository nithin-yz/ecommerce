const {
  user,
  product,
  userprofile,
  category,
  banner,
  Order,review1
} = require("../../models/databaseschema");
const fs = require("fs");
const path = require("path");

// const { ObjectId } = require('mongoose').Types;

exports.adminget = async (req, res) => {
  const userCount = await user.countDocuments({ role: "user", verified: true });
  // console.log(userCount)

  const productscount = await product.countDocuments();
  const orders = await Order.find({ status: "delivered" });
  // console.log(orders)

  const totalsales = orders.reduce((sum, ele) => {
    return (sum += ele.totalamount);
  }, 0);
  console.log(totalsales);
  res.render("admin/adminhome", {
    users: userCount,
    productscount,
    totalsales,
  });
};

exports.addproductsget = async (req, res) => {
  const categories = await category.find();

  const subcategories = categories.reduce(function (acc, element) {
    return acc.concat(element.subcategory);
  }, []);

  res.render("admin/addproduct", { error: req.flash("error"), categories });
};

exports.addproductpost = async (req, res) => {
  let imagePath1, imagePath2, imagePath3;

  try {
    const {
      productname,
      price,
      description,
      category,
      newprice,
      stock,
      subcategory,
    } = req.body;

    const image1 = req.files["image1"][0].filename;
    const image2 = req.files["image2"][0].filename;
    const image3 = req.files["image3"][0].filename;

    imagePath1 = path.join(
      __dirname,
      "..",
      "..",
      "..",
      "public",
      "uploads",
      image1
    );
    imagePath2 = path.join(
      __dirname,
      "..",
      "..",
      "..",
      "public",
      "uploads",
      image2
    );
    imagePath3 = path.join(
      __dirname,
      "..",
      "..",
      "..",
      "public",
      "uploads",
      image3
    );

    const newproduct = new product({
      productname,
      price,
      description,
      image1,
      image2,
      image3,
      category,
      newprice,
      stock,
      subcategory,
    });

    await newproduct.save();
    res.redirect("/adminhome");
  } catch (error) {
    if (fs.existsSync(imagePath1)) fs.unlinkSync(imagePath1);
    if (fs.existsSync(imagePath2)) fs.unlinkSync(imagePath2);
    if (fs.existsSync(imagePath3)) fs.unlinkSync(imagePath3);

    req.flash("error", "Please fill all details");
    res.redirect("/adminhome/addproduct");
  }
};

exports.userlistget = async (req, res) => {
  list = await user.find();
  res.render("admin/userslist", { users: list });
};

exports.deleteuser = async (req, res) => {
  console.log(req.params);
  const { id } = req.params;
  console.log(id);
  const finder = await user.findByIdAndDelete(id);

  console.log(finder);

  if (finder) {
    console.log("true");
    return res.json({ sucess: true });
  } else {
    res.send("error");
  }
};

exports.showproductget = async (req, res) => {
  try {
    let prod = await product.find();
    res.status(200).render("admin/showproduct", { product: prod });
  } catch {}
};

exports.deleteproduct = async (req, res) => {
  try {
    console.log(req.params);
    const { id } = req.params;
    console.log(id);
    const finder = await product.findByIdAndDelete(id);
    if (finder) {
      const imagePath1 = path.join(
        __dirname,
        "..",
        "..",
        "..",
        "public",
        "uploads",
        finder.image1
      );
      const imagePath2 = path.join(
        __dirname,
        "..",
        "..",
        "..",
        "public",
        "uploads",
        finder.image2
      );
      const imagePath3 = path.join(
        __dirname,
        "..",
        "..",
        "..",
        "public",
        "uploads",
        finder.image3
      );

      fs.unlinkSync(imagePath1);
      fs.unlinkSync(imagePath2);
      fs.unlinkSync(imagePath3);

      console.log("true");
      // return res.send("true")
      res.json({ success: true });
    } else {
      res.json({ success: false });
    }
  } catch (err) {
    console.log(err);
  }
};

exports.addressdeletepost = async (req, res) => {
  const id = req.body.id;
  // console.log(req.body)
  try {
    const object = await userprofile.findById(id);
    // console.log(object)
    await userprofile.findByIdAndDelete(id);
    res.sendStatus(204);
  } catch (error) {
    console.error("delete error");
    res.status(500).send("error deleting address");
  }
};

exports.subcategoryload = async (req, res) => {
  try {
    const selectedCat = req.body.selectedCat;

    const finder = await category.findOne({ category: selectedCat });

    const subcategories = finder.subcategory;

    if (subcategories) {
      res.json({ subcategories });
    } else {
      console.log("error");
    }
  } catch {
    console.log("error happend somewhere whe taking subcategory");
  }
};

exports.addbannerget = async (req, res) => {
  const banners = await banner.find();
  res.render("admin/addbanner", { banners });
};

exports.addbannerpost = async (req, res) => {
  try {
    const bannername = req.body.bannername;
    const bannercontent = req.body.bannercontent;
    const bannerimage = req.file.filename;

    // Create new banner
    const newbanner = new banner({ bannername, bannerimage, bannercontent });

    await newbanner.save();

    res.redirect("/adminhome/addbanner");
  } catch (err) {
    console.log(err); // Redirect to admin home page even if an error occurs
  }
};

exports.deletebannerget = async (req, res) => {
  const id = req.query.id;

  const finder = await banner.findByIdAndDelete(id);
  console.log(finder);

  const filePath = path.join(
    __dirname,
    "..",
    "..",
    "..",
    "public",
    "uploadbanner",
    finder.bannerimage
  );
  console.log(filePath);

  fs.unlink(filePath, (err) => {
    if (err) {
      console.error("Error deleting file:", err);
      // return res.status(500).json({ error: "Internal server error" });
    }
    console.log("File deleted successfully");
  });

  if (finder) {
    res.json({ ok: "true" });
  } else {
    res.json({ ok: "false" });
  }
};

exports.bannerupdatepost = async (req, res) => {
  try {
    const id = req.body.obid;
    const bannername = req.body.bannername;
    const bannercontent = req.body.bannercontent;
    let bannerimage;

    if (req.file && req.file.filename) {
      bannerimage = req.file.filename;

      await banner.findByIdAndUpdate(id, {
        bannername,
        bannerimage,
        bannercontent,
      });
    } else {
      await banner.findByIdAndUpdate(id, { bannername, bannercontent });
    }

    // Send a JSON response indicating success
    res
      .status(200)
      .json({ success: true, message: "Banner updated successfully" });
  } catch (error) {
    console.error("Error updating banner:", error);
    // Send a JSON response indicating failure
    res
      .status(500)
      .json({
        success: false,
        error: "An error occurred while updating the banner",
      });
  }
};

exports.updateorderstatus = async (req, res) => {
  try {
    console.log(req.query);
    console.log(req.body);
    const userorder = await Order.findByIdAndUpdate(
      { _id: req.query.orderid },
      { status: req.body.status }
    );

    if (userorder) {
      res.redirect("/adminhome/orders");
    }
  } catch (error) {
    console.log(error);
  }
};
exports.userordersfullget = async (req, res) => {
  try {
    const orders = await Order.find();

    console.log(orders);
    res.render("admin/orders", { orders });
  } catch {}
};

const { ObjectId } = require("mongoose").Types;

exports.signupdataget = async (req, res) => {
  try {
    // Fetch all users from the database
    const users = await user.find();

    // Extract signup month from ObjectID timestamp and count occurrences
    const signupData = users.reduce((acc, user) => {
      const month = new Date(new ObjectId(user._id).getTimestamp()).toLocaleString(
        "en-US",
        { month: "long" }
      );
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {});

    console.log(signupData);
    // Convert signupData object to array of objects
    const signupDataArray = Object.keys(signupData).map((month) => ({
      month,
      count: signupData[month],
    }));

    console.log(signupDataArray)

    res.json(signupDataArray);
  } catch (error) {
    console.error("Error fetching user signup data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.productgraphget=async(req,res)=>{

    try {
        const products1 = await product.find();
        console.log(products1)
        res.json({products1})
        
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

exports.updateuserstatuspost = async (req, res) => {
  const { userId, status } = req.body;

  const user1 = await user.findOne({ _id: userId });
  if (!user1) {
      return res.status(404).json({ success: false, message: "User not found." });
  } else {
      if (user1.status === "active") {
          user1.status = "block";
      } else {
          user1.status = "active";
      }
      await user1.save();
      return res.status(200).json({ success: true, message: "User status updated successfully." });
  }
}

exports.submitreviewpost =async(req,res)=>{

  if (req.session.email) {
    console.log("hi")
    const { productid, description, rating } = req.body;
  
    try {
      const finder = await user.findOne({ email: req.session.email });
      const userid = finder._id;
  
      const userreview = await review1.findOne({ userid: userid });
  
      if (userreview) {
        let productExists = false;
  
        for (const ele of userreview.review) {
          if (ele.product == productid) {
            productExists = true;
            return res.status(400).json("Review already submitted");
          }
        }
  
        if (!productExists) {
          userreview.review.push({
            product: productid,
            rating: rating,
            comments: description
          });
          await userreview.save();
          return res.status(204).send();
        }
      } else {
        const newuserreview = new review1({
          userid: userid,
          review: [{ product: productid, rating: rating, comments: description }]
        });
        await newuserreview.save();
        return res.status(204).send();
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  } 
 
  res.status(400).json({login:"login"});
}    