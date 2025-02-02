    // const { getUserInfo } = require("@replit/repl-auth")
    var express = require("express");
    // Cookie parser will be needed for authentication system
    var cookieParser = require("cookie-parser")
    // Starting express

    var app = express();
    var easyinvoice = require('easyinvoice');

    var fs = require("fs");
    // Using json 
    require('dotenv').config()
    app.use(express.json());
    app.use(cookieParser());
    app.use(express.static('public'));
    const mongoose = require('mongoose');
    const mongodb = require("mongodb")
    var cors = require("cors");
    const {
        response
    } = require("express");
    const { on } = require("events");

    app.use(cors({ optionsSuccessStatus: 200, credentials: true, origin: 'http://localhost:5173' }));
    app.use(express.static("public"));

    const url = process.env['MONGO_URI']

    mongoose.connect(url)
        .then(() => {
            console.log('Connected to the database ')
        })
        .catch((err) => {
            console.error(`Error connecting to the database. n${err}`);
        })


    const dataSchema = mongoose.Schema({
        productName: {
            type: String,
            required: true,
        },
        costPrice: {
            type: Number,
            required: true
        },
        sellingPrice: {
            type: Number,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        category: {
            type: String,
            required: true
        },
        subCategory: {
            type: String,
            required: true
        }
    })

    const userSchema = mongoose.Schema({
        uname: {
            type: String,
            required: true
        },
        passwd: {
            type: String,
            required: true
        },
        SID: {
            type: String
        },
        admin: {
            type: Boolean,
            required: true
        }
    }, { timestamps: true })

    const customerSchema = mongoose.Schema({
        name: {
            type: String,
            required: true
        },
        phoneNumber: {
            type: String,
            required: true
        },
        paid: {
            type: Number,
            required: true,
        },
        discounted: {
            type: Boolean,
            required: true
        },
        paymentMethod: {
            type: String,
            required: true
        },
        amazon: {
            type: Boolean,
            required: true
        },
        total: {
            type: Number,
            required: true
        },
        products: {
            type: Array,
            required: true
        },
        due: {
            type: Boolean,
            required: true
        },
        employee: {
            type: String,
            required: true
        }


    }, { timestamps: true })


    const vendorSchema = new mongoose.Schema({
        name: { type: String, required: true },
        address: String,
        phone: String,
    });
    
    const purchaseSchema = new mongoose.Schema({
        products: Array,
        vendorData: Object,
        purchaseData: Object,
    });   
    
    const invoiceCounterSchema = new mongoose.Schema({
        _id: { type: String, required: true },
        invoiceNumber: { type: Number, required: true, default: 1 }
    });
    
    const invoiceCounterModel = mongoose.model('InvoiceCounter', invoiceCounterSchema);
    
    // Initialize the counter on first use
    invoiceCounterModel.findOneAndUpdate({ _id: 'invoiceCounter' }, { $setOnInsert: { invoiceNumber: 1 } }, { upsert: true });
    

    const Purchase = mongoose.model('Purchase', purchaseSchema);
    const Vendor = mongoose.model('Vendor', vendorSchema);
    const userModel = mongoose.model("users", userSchema)
    const dataModel = mongoose.model("data", dataSchema)
    const customerModel = mongoose.model("customer", customerSchema)
    app.post("/api/login", (req, res) => {
        async function setSID(id) {
            await userModel.updateOne({
                uname: req.body.uname
            }, {
                $set: {
                    SID: id
                }
            }).exec()
        }

        async function check() {

            const query = await userModel.findOne({
                uname: req.body.uname,
                passwd: req.body.passwd
            }).exec();
            if (query !== null) {
                try {
                    const rand = () => {
                        return Math.random().toString(36).substr(2);
                    };
                    const token = () => {
                        return rand() + rand();
                    };
                    const id = token();
                    setSID(id)
                    res.cookie("SID", id, { maxAge: 1000 * 60 * 60 * 24 * 30, secure: process.env.NODE_ENV === "development" ? false : true })
                    res.cookie("uname", req.body.uname, { maxAge: 1000 * 60 * 60 * 24 * 30, secure: process.env.NODE_ENV === "development" ? false : true })
                    res.status(200).send({
                        loggedIn: true
                    })
                } catch (error) {
                    console.log(error)
                }

            } else {
                res.status(200).send({
                    LoggedIn: false
                })
            }
        }
        check();
    })

    app.get("/api/verify", (req, res) => {
        async function check() {
            const query = await userModel.findOne({
                uname: req.cookies.uname,
                SID: req.cookies.SID
            }).exec();
            if (query !== null) {
                res.send({ Verified: true })
            } else {
                res.send({ Verified: false })

            }
        }
        check()
    })


    app.post("/api/new-product", (req, res) => {

        const data = req.body.data;

        async function check() {
            const query = await userModel.findOne({
                uname: req.cookies.uname,
                SID: req.cookies.SID
            }).exec();
            if (query !== null) {
                return true
            } else {
                return false

            }
        }
        async function checkAndSave(ele) {

            const query = await dataModel.findOne({
                productName: ele.productName
            }).exec();
            if (query === null) {

                const eachData = {
                    productName: ele.productName,
                    costPrice: ele.costPrice,
                    sellingPrice: ele.sellingPrice,
                    quantity: ele.quantity,
                    category: req.body.category,
                    subCategory: req.body.subCategory
                }
                const save = dataModel(eachData)
                save.save()
            }
        }

        if (check()) {
            data.map((ele) => {
                checkAndSave(ele)
            })
            res.status(200).send({ saved: true })

        }
        else {
            res.status(302).send({ saved: [] })
            return
        }
    })

    app.get("/api/products-data/", (req, res) => {
        async function checkAndReturn() {
            const verify = await userModel.findOne({
                uname: req.cookies.uname,
                SID: req.cookies.SID
            }).exec();
            if (verify !== null) {
                const data = await dataModel.find({})
                res.status(200).send({ data: data })
            } else {
                res.status(302).send({ status: "Unauthorized Access" })
            }
        }
        checkAndReturn()
    })

    app.post("/api/purchase", async (req, res) => {
        const { products, vendorData, purchaseData } = req.body;
    
        try {
            const newPurchase = new Purchase({ products, vendorData, purchaseData });
            await newPurchase.save();
            res.status(201).json({ purchased: true });
        } catch (error) {
            res.status(500).json({ purchased: false, error: error.message });
        }
    });
    
    // GET endpoint to fetch all purchases
    // Assuming you're using Express.js in your backend
app.get('/api/purchase', async (req, res) => {
    try {
      const purchases = await Purchase.find(); // Replace with your actual data-fetching logic
      res.json(purchases);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch purchases' });
    }
  });
  


  app.post("/api/sell/", async (req, res) => {
    const data = req.body.data;
    const customerData = req.body.customerData;

    // Function to decrease product quantities
    async function decreaseProducts(realData) {
        const objId = new mongodb.ObjectId(realData._id);
        await dataModel.updateOne({ _id: objId }, { $inc: { quantity: -1 * Number(realData.sellingQuantity) } });
    }

    // Function to record receipts and handle discount logic
    async function recordReciepts(realData, productsData) {
        if ((realData.total > realData.paid) && (!realData.discounted)) {
            const data = new customerModel({ ...realData, products: productsData, due: true, employee: req.cookies.uname });
            await data.save();
        } else {
            const data = new customerModel({ ...realData, products: productsData, due: false, employee: req.cookies.uname });
            await data.save();
        }
    }

    // Function to get and increment the invoice number
    async function getInvoiceNumber() {
        const counter = await invoiceCounterModel.findOneAndUpdate(
            { _id: 'invoiceCounter' },
            { $inc: { invoiceNumber: 1 } },
            { new: true, upsert: true }
        );
        return counter.invoiceNumber;
    }

    try {
        // Get the next invoice number
        const invoiceNumber = await getInvoiceNumber();

        // Update the customer data with the invoice number
        customerData.invoiceNumber = invoiceNumber;

        // Apply discount if applicable (e.g., reduce the paid amount based on the discount)
        if (customerData.discounted) {
            const discountAmount = customerData.total * 0.1; // Example: 10% discount
            customerData.paid += discountAmount;
        }

        // Update the products quantities and save the receipt
        await Promise.all(data.map((ele) => decreaseProducts(ele)));
        await recordReciepts(customerData, data);

        // Respond with success and invoice number
        res.status(200).send({ sold: true, invoiceNumber: invoiceNumber });

    } catch (e) {
        res.status(500).send({ sold: false, error: e.message });
    }
});

    
    app.get("/api/reciept/", (req, res) => {
    async function createReciept(data, id) {
        const result = await easyinvoice.createInvoice(data);
        await fs.writeFileSync("bills/" + id + ".pdf", result.pdf, 'base64');
        res.sendFile(id + ".pdf", { root: __dirname + "/bills" });
    }

    async function main() {
        const id = new mongodb.ObjectId(req.params.id);  // Updated for correct parameter access
        const data = await customerModel.findById(id);
        const productsData = [];

        data.products.map((ele) => {
            const newEle = {
                "quantity": ele.sellingQuantity,
                "description": ele.productName,
                "price": ele.sellingPrice,
                "tax-rate": 0
            };
            productsData.push(newEle);
        });

        let date1 = data.createdAt;
        let localDate = new Date(date1);
        let finalDate = localDate.getFullYear() + "-" + (localDate.getMonth() + 1 < 10 ? "0" + (localDate.getMonth() + 1) : localDate.getMonth() + 1) + "-" + (localDate.getDate() < 10 ? "0" + localDate.getDate() : localDate.getDate());

        // Define invoice data
        var d = {
            "images": {
                "logo": fs.readFileSync('logo.png', 'base64'),
            },
            "sender": {
                "company": "BookWithUVA",
                "address": "Acharya Narendra Dev College Govindpuri,",
                "contact": "8804578500",
                "zip": "110019",
                "city": "New Delhi",
                "country": "India"
            },
            "client": {
                "company": data.name + "<br />" + (data.phoneNumber || " "),
            },
            "information": {
                "number": req.params.id,  // Invoice number
                "date": finalDate,
                "due-date": ""
            },
            "products": productsData,
            "bottom-notice": "Visit bookwithuva.com for online shopping",
            "settings": {
                "currency": "INR",
            },
        };

        // Call function to create the receipt
        createReciept(d, req.params.id);
    }

    main();
});



    app.get("/api/customer-data/", (req, res) => {

        async function fetchData() {
            const response = await customerModel.find({})
            res.status(200).send({ data: response })
        }
        fetchData()
    })



    app.post("/api/delete-due", (req, res) => {
        async function deleteDue(id) {
            const response = await customerModel.updateOne({ _id: id }, { $set: { due: false } })
            if (response.modifiedCount === 1) {
                res.status(200).send({ delete: true })
            }
            else res.status(200).send({ delete: false })
        }
        deleteDue(req.body.id)
    })

    app.post("/api/delete-advance", (req, res) => {
        async function deleteAdvance(id) {
            const findRequest = await customerModel.find({ _id: id })

            if (findRequest[0].paymentMethod === "Advanced-Online") {

                const deleteResponse = await customerModel.updateOne({ _id: id }, { $set: { paymentMethod: "Online", paid: findRequest[0].total } })

                if (deleteResponse.modifiedCount === 1) {
                    res.status(200).send({ delete: true })
                }
                else {
                    res.status(200).send({ delete: false })
                }
            }
            else if (findRequest[0].paymentMethod === "Advanced-Offline") {
                const deleteResponse = await customerModel.updateOne({ _id: id }, { $set: { paymentMethod: "Offline", paid: findRequest[0].total } })
                if (deleteResponse.modifiedCount === 1) {
                    res.status(200).send({ delete: true })
                }
                else {
                    res.status(200).send({ delete: false })
                }
            }
            else {
                const deleteResponse = await customerModel.updateOne({ _id: id }, { $set: { paid: findRequest[0].total } })
                if (deleteResponse.modifiedCount === 1) {
                    res.status(200).send({ delete: true })
                }
                else {
                    res.status(200).send({ delete: false })
                }
            }
        }
        deleteAdvance(req.body.id)
    })


    app.post("/api/update-stock/", (req, res) => {
        async function checkAndReturn() {
            const verify = await userModel.findOne({
                uname: req.cookies.uname,
                SID: req.cookies.SID
            }).exec();
            if (verify !== null) {
                const data = req.body.data;
                data.map(async function update(ele) {
                    const objId = new mongodb.ObjectId(ele._id);
                    const returnQuery = await dataModel.updateOne({ _id: objId }, { $inc: { quantity: Number(ele.newQuantity) } }).exec()

                })
                res.status(200).send({ Updated: true })
            } else {
                res.status(302).send({ status: "Unauthorized Access" })
            }
        }
        checkAndReturn()
    })

    app.post("/api/update-info/", (req, res) => {
        async function checkAndReturn() {
            const verify = await userModel.findOne({
                uname: req.cookies.uname,
                SID: req.cookies.SID
            }).exec();
            if (verify !== null) {
                const data = req.body.data;
                data.map(async function update(ele) {
                    const objId = new mongodb.ObjectId(ele._id);
                    await dataModel.updateOne({ _id: objId }, { $set: { productName: ele.productName, sellingPrice: ele.sellingPrice, costPrice: ele.costPrice } }).exec()

                })
                res.status(200).send({ Updated: true })
            } else {
                res.status(302).send({ status: "Unauthorized Access" })
            }
        }
        checkAndReturn()
    })


    app.post("/api/delete-product", (req, res) => {
        async function checkAndReturn() {
            const verify = await userModel.findOne({
                uname: req.cookies.uname,
                SID: req.cookies.SID,
                admin: true
            }).exec();
            if (verify !== null) {
                const data = req.body.id;

                const objId = new mongodb.ObjectId(data);
                const response = await dataModel.deleteOne({ _id: objId }).exec()


                res.status(200).send({ Deleted: true, item: req.body.item })
            } else {
                res.status(302).send({ status: "Unauthorized Access" })
            }
        }
        checkAndReturn()
    })

    app.post("/api/delete-customer", (req, res) => {
        async function checkAndReturn() {
            const verify = await userModel.findOne({
                uname: req.cookies.uname,
                SID: req.cookies.SID,
                admin: true
            }).exec();
            if (verify !== null) {
                const data = req.body.id;

                const objId = new mongodb.ObjectId(data);
                const response = await customerModel.find({ _id: objId }).exec()
                response[0].products.map(async function main(ele) {
                    const objId = new mongodb.ObjectId(ele._id);
                    await dataModel.updateOne({ _id: objId }, { $inc: { quantity: Number(ele.sellingQuantity) } }).exec()
                })
                await customerModel.deleteOne({ _id: objId }).exec()
                res.status(200).send({ Deleted: true, item: req.body.item })
            } else {
                res.status(302).send({ status: "Unauthorized Access" })
            }
        }
        checkAndReturn()
    })


    app.get("/api/pps/:name", (req, res) => {

        res.sendFile("./pps/" + req.params.name + ".jpeg", { root: __dirname })
    })



    app.get("/api/logout/", (req, res) => {
        res.clearCookie("uname");
        res.clearCookie("SID")
        res.status(200).send({ logout: true })
    })

    app.post("/api/change-password/", (req, res) => {
        async function checkAndReturn() {
            const verify = await userModel.findOne({
                uname: req.cookies.uname,
                SID: req.cookies.SID
            }).exec();
            if (verify !== null) {
                const uname = req.cookies.uname;
                const passwd = req.body.passwd
                await userModel.updateOne({ uname: uname, passwd: passwd }, { $set: { passwd: req.body.newPasswd } }).exec()
                res.status(200).send({ Updated: true })
            } else {
                res.status(302).send({ status: "Unauthorized Access" })
            }
        }
        checkAndReturn()
    })

    app.post("/api/new-user/", (req, res) => {
        async function checkAndReturn() {
            const verify = await userModel.findOne({
                uname: req.cookies.uname,
                SID: req.cookies.SID,
                admin: true
            }).exec();
            if (verify !== null) {
                const uname = req.body.user;
                const passwd = req.body.passwd;
                const admin = req.body.admin;
                const data = new userModel({
                    uname: uname,
                    passwd: passwd,
                    admin: admin
                })
                data.save()
                res.status(200).send({ added: true })
            } else {
                res.status(302).send({ status: "Unauthorized Access" })
            }
        }
        checkAndReturn()
    })

    app.get('/vendors', async (req, res) => {
        try {
        const vendors = await Vendor.find();
        res.json(vendors);
        } catch (error) {
        res.status(500).json({ error: 'Failed to fetch vendors' });
        }
    });
    
    // POST /vendors: Add a new vendor
    app.post('/vendors', async (req, res) => {
        const { name, address, phone } = req.body;
        try {
        const newVendor = new Vendor({ name, address, phone });
        await newVendor.save();
        res.status(201).json(newVendor);
        } catch (error) {
        res.status(500).json({ error: 'Failed to add vendor' });
        }
    });
    
    // DELETE /vendors/:id: Delete a vendor by its ID
    app.delete("/vendors/:id", async (req, res) => {
        const { id } = req.params;

        try {
            // Find the vendor to delete
            const vendor = await Vendor.findById(id);
            if (!vendor) {
                return res.status(404).json({ error: "Vendor not found" });
            }

            // Delete all purchases associated with the vendor
            await Purchase.deleteMany({ vendor: vendor._id });

            // Delete the vendor
            await Vendor.findByIdAndDelete(id);
            res.status(200).json({ message: "Vendor and associated purchases deleted successfully" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Failed to delete vendor" });
        }
    });


    // listen for requests :) 
    var listener = app.listen(8080, function () {
        console.log("Your app is listening on port " + listener.address().port);
    });