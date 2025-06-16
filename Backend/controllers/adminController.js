const user = require("../models/userModel");

const deleteUser = async (req, res) => {
    try {
        const deletedUser = await user.findByIdAndDelete(req.params.id);
        return res.status(200).json({ message: "User deleted succesfully", deletedUser });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = { deleteUser };