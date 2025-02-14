// const { getUserInfo } = require("@replit/repl-auth")
var express = require("express");
// Cookie parser will be needed for authentication system
var cookieParser = require("cookie-parser");
// Starting express

var app = express();
var easyinvoice = require("easyinvoice");
var fs = require("fs");
// Using json
require("dotenv").config();
app.use(express.json());
app.use(cookieParser());
app.use(express.static("public"));
const mongoose = require("mongoose");
const mongodb = require("mongodb");
var cors = require("cors");
const { response } = require("express");
const { on } = require("events");

app.use(
  cors({
    optionsSuccessStatus: 200,
    credentials: true,
    origin: process.env["ALLOWED_HOST"],
  })
);
app.use(express.static("public"));

const url = process.env["MONGO_URI"];

mongoose
  .connect(url)
  .then(() => {
    console.log("Connected to the database ");
  })
  .catch((err) => {
    console.error(`Error connecting to the database. n${err}`);
  });

const dataSchema = mongoose.Schema({
  productName: {
    type: String,
    required: true,
  },
  costPrice: {
    type: Number,
    required: true,
  },
  sellingPrice: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  subCategory: {
    type: String,
    required: true,
  },
  gst: {
    type: Number,
    required: true,
  },
});

const userSchema = mongoose.Schema(
  {
    uname: {
      type: String,
      required: true,
    },
    passwd: {
      type: String,
      required: true,
    },
    SID: {
      type: String,
    },
    admin: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
);

const customerSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    paid: {
      type: Number,
      required: true,
    },
    discounted: {
      type: Boolean,
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    amazon: {
      type: Boolean,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    products: {
      type: Array,
      required: true,
    },
    due: {
      type: Boolean,
      required: true,
    },
    employee: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const sellerSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  }
});

const purchasedSchema = mongoose.Schema({
  seller: {
    type: String,
    required: true
  },
  products: {
    type: Array,
    required: true
  },
  invoiceNumber: {
    type: String, 
    required: true
  }
})

const userModel = mongoose.model("users", userSchema);
const dataModel = mongoose.model("data", dataSchema);
const customerModel = mongoose.model("customer", customerSchema);
const sellerModel = mongoose.model("seller", sellerSchema);
const purchaseModel = mongoose.model("purchased", purchasedSchema)

app.post("/api/login", (req, res) => {
  async function setSID(id) {
    await userModel
      .updateOne(
        {
          uname: req.body.uname,
        },
        {
          $set: {
            SID: id,
          },
        }
      )
      .exec();
  }

  async function check() {
    const query = await userModel
      .findOne({
        uname: req.body.uname,
        passwd: req.body.passwd,
      })
      .exec();
    if (query !== null) {
      try {
        const rand = () => {
          return Math.random().toString(36).substr(2);
        };
        const token = () => {
          return rand() + rand();
        };
        const id = token();
        setSID(id);
        res.cookie("SID", id, {
          maxAge: 1000 * 60 * 60 * 24 * 30,
          secure: false,
        });
        res.cookie("uname", req.body.uname, {
          maxAge: 1000 * 60 * 60 * 24 * 30,
          secure: false,
        });
        res.status(200).send({
          loggedIn: true,
        });
      } catch (error) {
        console.log(error);
      }
    } else {
      res.status(200).send({
        LoggedIn: false,
      });
    }
  }
  check();
});

app.get("/api/verify", (req, res) => {
  async function check() {
    const query = await userModel
      .findOne({
        uname: req.cookies.uname,
        SID: req.cookies.SID,
      })
      .exec();
    if (query !== null) {
      res.send({ Verified: true });
    } else {
      res.send({ Verified: false });
    }
  }
  check();
});

app.post("/api/new-product", (req, res) => {
  const data = req.body.data;
  async function check() {
    const query = await userModel
      .findOne({
        uname: req.cookies.uname,
        SID: req.cookies.SID,
      })
      .exec();
    if (query !== null) {
      return true;
    } else {
      return false;
    }
  }
  async function checkAndSave(ele) {
    const query = await dataModel
      .findOne({
        productName: ele.productName,
      })
      .exec();
    if (query === null) {
      const eachData = {
        productName: ele.productName,
        costPrice: ele.costPrice,
        sellingPrice: ele.sellingPrice,
        quantity: ele.quantity,
        category: req.body.category,
        subCategory: req.body.subCategory,
        gst: ele.gst,
      };
      const save = dataModel(eachData);
      save.save();
    }
  }

  if (check()) {
    data.map((ele) => {
      checkAndSave(ele);
    });
    res.status(200).send({ saved: true });
  } else {
    res.status(302).send({ saved: [] });
    return;
  }
});

app.get("/api/products-data/", (req, res) => {
  async function checkAndReturn() {
    const verify = await userModel
      .findOne({
        uname: req.cookies.uname,
        SID: req.cookies.SID,
      })
      .exec();
    if (verify !== null) {
      const data = await dataModel.find({});
      res.status(200).send({ data: data });
    } else {
      res.status(302).send({ status: "Unauthorized Access" });
    }
  }
  checkAndReturn();
});

app.post("/api/sell/", (req, res) => {
  const data = req.body.data;
  const customerData = req.body.customerData;
  async function decreaseProducts(realData) {
    const objId = new mongodb.ObjectId(realData._id);
    await dataModel.updateOne(
      { _id: objId },
      { $inc: { quantity: -1 * Number(realData.sellingQuantity) } }
    );
  }

  async function recordReciepts(realData, productsData) {
    if (realData.total > realData.paid && !realData.discounted) {
      const data = new customerModel({
        ...realData,
        products: productsData,
        due: true,
        employee: req.cookies.uname,
      });
      data.save();
    } else {
      const data = new customerModel({
        ...realData,
        products: productsData,
        due: false,
        employee: req.cookies.uname,
      });
      data.save();
    }
  }
  try {
    data.map((ele) => {
      decreaseProducts(ele);
    });
    recordReciepts(customerData, data);
    res.status(200).send({ sold: true });
  } catch (e) {
    res.status(500).send({ sold: false, error: e });
  }
});

app.get("/api/reciept/", (req, res) => {
  async function createReciept(data, id) {
    const result = await easyinvoice.createInvoice(data);
    await fs.writeFileSync("bills/" + id + ".pdf", result.pdf, "base64");
    res.sendFile(id + ".pdf", { root: __dirname + "/bills" });
  }
  async function main() {
    console.log(req.param("id"));
    const id = new mongodb.ObjectId(req.param("id"));
    const data = await customerModel.findById(id);
    const productsData = [];
    data.products.map((ele) => {
      const newEle = {
        quantity: ele.sellingQuantity,
        description: ele.productName,
        price: ele.sellingPrice,
        "tax-rate": 0,
      };
      productsData.push(newEle);
    });
    let date1 = data.createdAt;
    let localDate = new Date(date1);
    let finalDate =
      localDate.getFullYear() +
      "-" +
      (localDate.getMonth() + 1 < 10
        ? "0" + (localDate.getMonth() + 1)
        : localDate.getMonth() + 1) +
      "-" +
      (localDate.getDate() < 10
        ? "0" + localDate.getDate()
        : localDate.getDate());
    var d = {
      // Customize enables you to provide your own templates
      // Please review the documentation for instructions and examples
      customize: {
        //  "template": fs.readFileSync('template.html', 'base64') // Must be base64 encoded html
      },
      images: {
        // The logo on top of your invoice
        logo: fs.readFileSync("logo.png", "base64"),
        // The invoice background
      },
      // Your own data
      sender: {
        company: "BookWithUVA",
        address: "Acharya Narendra Dev College Govindpuri,",
        zip: "110019",
        city: "New Delhi",
        country: "India",
      },
      // Your recipient
      client: {
        company: data.name + "<br />" + (data.phoneNumber || " "),
      },
      information: {
        // Invoice number

        // Invoice data
        number: req.param("id"),
        date: finalDate,
        "due-date": "",
      },
      // The products you would like to see on your invoice
      // Total values are being calculated automatically
      products: productsData,
      "bottom-notice": "Visit bookwithuva.com for online shopping",
      // Settings to customize your invoice
      settings: {
        currency: "INR", // See documentation 'Locales and Currency' for more info. Leave empty for no currency.
      },
    };
    createReciept(d, req.param("id"));
  }

  main();
});

app.get("/api/customer-data/", (req, res) => {
  async function fetchData() {
    const response = await customerModel.find({});
    res.status(200).send({ data: response });
  }
  fetchData();
});

app.post("/api/delete-due", (req, res) => {
  async function deleteDue(id) {
    const response = await customerModel.updateOne(
      { _id: id },
      { $set: { due: false } }
    );
    if (response.modifiedCount === 1) {
      res.status(200).send({ delete: true });
    } else res.status(200).send({ delete: false });
  }
  deleteDue(req.body.id);
});

app.post("/api/delete-advance", (req, res) => {
  async function deleteAdvance(id) {
    const findRequest = await customerModel.find({ _id: id });

    if (findRequest[0].paymentMethod === "Advanced-Online") {
      const deleteResponse = await customerModel.updateOne(
        { _id: id },
        { $set: { paymentMethod: "Online", paid: findRequest[0].total } }
      );

      if (deleteResponse.modifiedCount === 1) {
        res.status(200).send({ delete: true });
      } else {
        res.status(200).send({ delete: false });
      }
    } else if (findRequest[0].paymentMethod === "Advanced-Offline") {
      const deleteResponse = await customerModel.updateOne(
        { _id: id },
        { $set: { paymentMethod: "Offline", paid: findRequest[0].total } }
      );
      if (deleteResponse.modifiedCount === 1) {
        res.status(200).send({ delete: true });
      } else {
        res.status(200).send({ delete: false });
      }
    } else {
      const deleteResponse = await customerModel.updateOne(
        { _id: id },
        { $set: { paid: findRequest[0].total } }
      );
      if (deleteResponse.modifiedCount === 1) {
        res.status(200).send({ delete: true });
      } else {
        res.status(200).send({ delete: false });
      }
    }
  }
  deleteAdvance(req.body.id);
});

app.post("/api/update-stock/", (req, res) => {
  async function checkAndReturn() {
    const verify = await userModel
      .findOne({
        uname: req.cookies.uname,
        SID: req.cookies.SID,
      })
      .exec();
    if (verify !== null) {
      const data = req.body.data;
      data.map(async function update(ele) {
        const objId = new mongodb.ObjectId(ele._id);
        const returnQuery = await dataModel
          .updateOne(
            { _id: objId },
            { $inc: { quantity: Number(ele.newQuantity) } }
          )
          .exec();
      });
      res.status(200).send({ Updated: true });
    } else {
      res.status(302).send({ status: "Unauthorized Access" });
    }
  }
  checkAndReturn();
});

app.post("/api/update-info/", (req, res) => {
  async function checkAndReturn() {
    const verify = await userModel
      .findOne({
        uname: req.cookies.uname,
        SID: req.cookies.SID,
      })
      .exec();
    if (verify !== null) {
      const data = req.body.data;
      data.map(async function update(ele) {
        const objId = new mongodb.ObjectId(ele._id);
        await dataModel
          .updateOne(
            { _id: objId },
            {
              $set: {
                productName: ele.productName,
                sellingPrice: ele.sellingPrice,
                costPrice: ele.costPrice,
              },
            }
          )
          .exec();
      });
      res.status(200).send({ Updated: true });
    } else {
      res.status(302).send({ status: "Unauthorized Access" });
    }
  }
  checkAndReturn();
});

app.post("/api/delete-product", (req, res) => {
  async function checkAndReturn() {
    const verify = await userModel
      .findOne({
        uname: req.cookies.uname,
        SID: req.cookies.SID,
        admin: true,
      })
      .exec();
    if (verify !== null) {
      const data = req.body.id;

      const objId = new mongodb.ObjectId(data);
      const response = await dataModel.deleteOne({ _id: objId }).exec();

      res.status(200).send({ Deleted: true, item: req.body.item });
    } else {
      res.status(302).send({ status: "Unauthorized Access" });
    }
  }
  checkAndReturn();
});

app.post("/api/delete-customer", (req, res) => {
  async function checkAndReturn() {
    const verify = await userModel
      .findOne({
        uname: req.cookies.uname,
        SID: req.cookies.SID,
        admin: true,
      })
      .exec();
    if (verify !== null) {
      const data = req.body.id;

      const objId = new mongodb.ObjectId(data);
      const response = await customerModel.find({ _id: objId }).exec();
      response[0].products.map(async function main(ele) {
        const objId = new mongodb.ObjectId(ele._id);
        await dataModel
          .updateOne(
            { _id: objId },
            { $inc: { quantity: Number(ele.sellingQuantity) } }
          )
          .exec();
      });
      await customerModel.deleteOne({ _id: objId }).exec();
      res.status(200).send({ Deleted: true, item: req.body.item });
    } else {
      res.status(302).send({ status: "Unauthorized Access" });
    }
  }
  checkAndReturn();
});

app.get("/api/pps/:name", (req, res) => {
  res.sendFile("./pps/" + req.params.name + ".jpeg", { root: __dirname });
});

app.get("/api/logout/", (req, res) => {
  res.clearCookie("uname");
  res.clearCookie("SID");
  res.status(200).send({ logout: true });
});

app.post("/api/change-password/", (req, res) => {
  async function checkAndReturn() {
    const verify = await userModel
      .findOne({
        uname: req.cookies.uname,
        SID: req.cookies.SID,
      })
      .exec();
    if (verify !== null) {
      const uname = req.cookies.uname;
      const passwd = req.body.passwd;
      await userModel
        .updateOne(
          { uname: uname, passwd: passwd },
          { $set: { passwd: req.body.newPasswd } }
        )
        .exec();
      res.status(200).send({ Updated: true });
    } else {
      res.status(302).send({ status: "Unauthorized Access" });
    }
  }
  checkAndReturn();
});

app.post("/api/new-user/", (req, res) => {
  async function checkAndReturn() {
    const verify = await userModel
      .findOne({
        uname: req.cookies.uname,
        SID: req.cookies.SID,
        admin: true,
      })
      .exec();
    if (verify !== null) {
      const uname = req.body.user;
      const passwd = req.body.passwd;
      const admin = req.body.admin;
      const data = new userModel({
        uname: uname,
        passwd: passwd,
        admin: admin,
      });
      data.save();
      res.status(200).send({ added: true });
    } else {
      res.status(302).send({ status: "Unauthorized Access" });
    }
  }
  checkAndReturn();
});

app.post("/api/new-distributor/", (req, res) => {
  async function checkAndReturn() {
    const verify = await userModel
      .findOne({
        uname: req.cookies.uname,
        SID: req.cookies.SID,
      })
      .exec();
    if (verify !== null) {
      const name = req.body.name;
      const phoneNumber = req.body.phoneNumber;
      const address = req.body.address;

      const distributorExistence = await sellerModel
        .findOne({ phoneNumber: phoneNumber })
        .exec();
      if (distributorExistence === null) {
        const data = new sellerModel({
          name: name,
          phoneNumber: phoneNumber,
          address: address
        });
        data.save();
        res.status(200).send({ added: true });
      } else {
        res.status(201).send({ unsaved: phoneNumber });
      }
    } else {
      res.status(302).send({ status: "Unauthorized Access" });
    }
  }
  checkAndReturn();
});

app.get("/api/get-distributors/", async (req, res) => {
  const verify = await userModel
    .findOne({
      uname: req.cookies.uname,
      SID: req.cookies.SID,
    })
    .exec();
  if (verify !== null){
    const data = await sellerModel.find({})
    res.status(200).send({data: data})
  }
  else{
    res.status(302).send({ status: "Unauthorized Access" });
  }
});

// listen for requests :)
var listener = app.listen(3001, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
