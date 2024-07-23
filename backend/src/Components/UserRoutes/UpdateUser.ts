import { Express } from 'express';
import UserModel from '../../Models/UserController';
const bcrypt = require('bcrypt');

export function updateUser(app: Express) {
    app.put('/userUpdate', async (req, res) => {
        const { userId, userEmail, userName, userPassword, userDescription } = req.body;
        try {
            let hashedPassword = null
            if (userPassword) {
                const salt = await bcrypt.genSalt(10);
                hashedPassword = await bcrypt.hash(userPassword, salt);
            }
            const updatedFields: any = {
                name: userName,
                email: userEmail,
                description: userDescription,
            }
            if (hashedPassword) {
                updatedFields.password = hashedPassword
            }
            const user = await UserModel.findByIdAndUpdate(
                userId,
                updatedFields,
                { new: true, runValidators: true },
            )
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ message: 'Error updating user', error });
        }
    })

    app.delete('/deleteUser/:userId', async (req, res) => {
        const { userId } = req.params
        try {
            const deletedUser = await UserModel.findOneAndDelete({ _id: userId });
            if (!deletedUser) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.status(200).json({ message: 'Your account has been deleted' });
        } catch (error) {
            res.status(500).json({ message: 'Error deleting user', error });
        }
    })
}