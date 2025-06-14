const { response } = require("express");
const users = require("../models/users");
const nodemailer = require("nodemailer")
const dotenv = require("dotenv");
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const moment = require('moment');

dotenv.config();
exports.userspost = async (req, resp) => {
    try {
        const myPlaintextPassword = req.body.password;
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(myPlaintextPassword, salt);

        const path = req.file ? `${req.file.filename}` : null;
        if (!path) {
            return resp.status(400).send('Picture is required');
        }

        const data = new users({
            ...req.body,
            picture: path,
            password: hashedPassword,
        });
        console.log(data)
        await data.save();
        sendVerifyMail(req.body.name, req.body.email, data._id);
        resp.status(200).send("Inserted successfully");
    } catch (error) {
        console.error('Error in the post:', error);
        resp.status(500).send("Error in the post");
    }
};
exports.userspostAuthentication = async (req, resp) => {
    try {
        const { email, password } = req.body;

        const user = await users.findOne({ email });

        if (!user) {
            return resp.status(404).json({ message: "Something Went Wrong" });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        let token = jwt.sign({ email: user.email, role: user.role }, process.env.JWT_SECRET_KEY);
        if (!isPasswordValid) {
            return resp.status(401).json({ message: "Something Went Wrong" });
        }

        if (!user.is_verified) {
            return resp.status(403).json({ message: "Something Went Wrong.Not Verified" });
        }

        user.is_active = moment().format('L');
        await user.save();

        const { password: hashedPassword, ...userWithoutPassword } = user._doc;
        resp.cookie("token", token, { httpOnly: true });
        console.log(token);
        resp.status(200).json({
            message: "Login successful",
            user: userWithoutPassword,
            token
        });

    } catch (error) {
        console.error('Error during authentication:', error);
        resp.status(500).json({ message: "An error occurred during authentication" });
    }
};
exports.userLogout = async (req, resp) => {
    try {
        const name = req.body.name;

        const user = await users.findOne({ name });

        if (!user) {
            return resp.status(404).json({ message: "Something Went Wrong" });
        }

        resp.cookie("token", "", { expires: new Date(0) });
        resp.status(200).json({
            message: "Logout successful",

        });

    } catch (error) {
        console.error('Error during authentication:', error);
        resp.status(500).json({ message: "An error occurred during authentication" });
    }
};
//for mail sending
const sendVerifyMail = async (name, email, user_id) => {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: '465',
            secure: true,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            }

        });
        const mailOptions = {
            from: 'ammansajjad42@gmail.com',
            to: email,
            subject: 'For Verification ',
            html: `
                <p>Hi ${name},</p>
                <p>Click here to <a href="http://localhost:2000/users/verify?id=${user_id}"><b>Verify</b></a> your email.</p>
            `
        }
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            }
            else {
                console.log("Email has been sent Successfully", info.response);
            }
        })
    } catch (error) {
        console.log(error.message);
    }
}
exports.verifyMail = async (req, res) => {
  try {
    const updateVerify = await users.updateOne(
      { _id: req.query.id },
      { $set: { is_verified: true } }
    );
    console.log("updated res", updateVerify);

    res.status(200).send(`
      <div style="
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh;
        background-color: #f3f4f6;
        font-family: Arial, sans-serif;
      ">
        <h1 style="color: #22C55E; margin-bottom: 20px;">Email Verified Successfully!</h1>
        <p style="font-size: 18px; margin-bottom: 30px;">Your account has been activated. You can now log in.</p>
        <a href="http://localhost:3000/login" style="
          padding: 10px 20px;
          background-color: #22C55E;
          color: #fff;
          text-decoration: none;
          border-radius: 8px;
          font-size: 16px;
        ">Go to Login</a>
      </div>
    `);
  } catch (error) {
    console.error("Email Verification Error:", error);
    res.status(500).send(`
      <div style="
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh;
        background-color: #fef2f2;
        font-family: Arial, sans-serif;
      ">
        <h1 style="color: #ef4444; margin-bottom: 20px;">Verification Failed!</h1>
        <p style="font-size: 18px; margin-bottom: 30px;">Something went wrong while verifying your email.</p>
        <a href="http://localhost:3000/signup" style="
          padding: 10px 20px;
          background-color: #ef4444;
          color: #fff;
          text-decoration: none;
          border-radius: 8px;
          font-size: 16px;
        ">Back to SignUp</a>
      </div>
    `);
  }
};

exports.usersRoleupdate = async (req, resp) => {
    try {
        const data = await users.findOneAndUpdate({ _id: req.params.id }, {
            $set:
                { role: req.body.role }
        }, { new: true });
        if (data) {
            resp.status(200).send({
                success: true,
                data: data
            })
        }
        else {
            resp.status(400).send({
                success: false,
                data: "no data"
            })
        }
    }
    catch (error) {
        console.log(error.message)
        resp.status(500).send({
            success: false,
            data: error.message
        })
    }
};
exports.usersupdate = async (req, res) => {
    try {
        const updatedData = {
            name: req.body.name,
            phone: req.body.phone,
        };

        if (req.file) {
            const path = req.file ? `${req.file.filename}` : null;
            updatedData.picture = path;
        }


        const user = await users.findByIdAndUpdate(
            req.params.id,
            { $set: updatedData },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.userStatesupdate = async (req, res) => {
    try {
        const email = req.body.email;
        const Day = req.body.CurrentDay;

        const user = await users.updateOne(
            {email:email},
            { $set: { is_active: Day } },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};



exports.usersdelete = async (req, resp) => {
    try {
        const data = await users.deleteMany({ email: req.params.email });
        console.log("data", data.deletedCount);
        if (data.deletedCount === 0) {
            resp.send({
                success: false,
                message: data.deletedCount
            });
        } else {
            resp.send({
                success: true,
                message: data.deletedCount
            });
        }
    } catch (error) {
        console.error(error);
        resp.status(500).send("Internal Server Error");
    }
}
exports.usersTableget = async (req, resp) => {
    try {
        const data = await users.find();

        if (data.length > 0) {
            return resp.status(200).json({ success: true, data: data });
        } else {
            return resp.status(404).json({ success: false, message: "No User Found" });
        }

    } catch (error) {
        return resp.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

exports.usersUserget = async (req, resp) => {
    try {
        const data = await users.find({ role: "user" });
        console.log(data);
        if (data.length != 0) {
            resp.send({
                success: true,
                message: data
            });
        } else {
            resp.send({
                success: false,
                message: "No User Found"
            });
        }
    } catch (error) {
        console.error(error);
        resp.status(500).send("Internal Server Error");
    }
};
exports.usersSingleget = async (req, resp) => {
    try {
        const data = await users.find({ email: req.params.email }).populate('rank_ID').populate('role_ID');
        console.log(data);
        if (data.length != 0) {
            resp.send({
                success: true,
                message: data
            });
        } else {
            resp.send({
                success: false,
                message: "No User Found"
            });
        }
    } catch (error) {
        console.error(error);
        resp.status(500).send("Internal Server Error");
    }
};