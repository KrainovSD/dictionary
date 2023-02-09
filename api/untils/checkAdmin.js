import User from '../models/Users.js';

export default async (req, res, next) => {
  try {
    let user = await User.findOne({ _id: req.userId });
    if (!user)
      return res.status(500).json({ message: 'Не удалось выполнить операцию' });
    if (user.role !== 'admin')
      return res.status(500).json({ message: 'Не удалось выполнить операцию' });
    next();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Не удалось выполнить операцию' });
  }
};
