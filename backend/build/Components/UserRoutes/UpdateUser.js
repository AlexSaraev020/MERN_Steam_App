"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser = void 0;
const UserController_1 = __importDefault(require("../../Models/UserController"));
const bcrypt = require('bcrypt');
function updateUser(app) {
    app.put('/userUpdate', (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { userId, userEmail, userName, userPassword, userDescription } = req.body;
        try {
            let hashedPassword = null;
            if (userPassword) {
                const salt = yield bcrypt.genSalt(10);
                hashedPassword = yield bcrypt.hash(userPassword, salt);
            }
            const updatedFields = {
                name: userName,
                email: userEmail,
                description: userDescription,
            };
            if (hashedPassword) {
                updatedFields.password = hashedPassword;
            }
            const user = yield UserController_1.default.findByIdAndUpdate(userId, updatedFields, { new: true, runValidators: true });
            res.status(200).json(user);
        }
        catch (error) {
            res.status(500).json({ message: 'Error updating user', error });
        }
    }));
    app.delete('/deleteUser/:userId', (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { userId } = req.params;
        try {
            const deletedUser = yield UserController_1.default.findOneAndDelete({ _id: userId });
            if (!deletedUser) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.status(200).json({ message: 'Your account has been deleted' });
        }
        catch (error) {
            res.status(500).json({ message: 'Error deleting user', error });
        }
    }));
}
exports.updateUser = updateUser;
