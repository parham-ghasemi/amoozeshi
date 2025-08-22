const Footer = require('../models/Footer');

exports.getFooterData = async (req, res) => {
  try {
    const footer = await Footer.findOne();
    if (!footer) {
      const newFooter = new Footer();
      await newFooter.save();
      return res.status(200).json(newFooter);
    }
    res.status(200).json(footer);
  } catch (error) {
    console.error('Fetch footer data error:', error);
    res.status(500).json({ message: 'Failed to fetch footer data' });
  }
};

exports.updateFooterData = async (req, res) => {
  try {
    const { title, description } = req.body;

    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;

    const updatedFooter = await Footer.findOneAndUpdate(
      {},
      { $set: updateData },
      { new: true, upsert: true }
    );

    res.status(200).json({
      message: 'Footer data updated successfully',
      footer: updatedFooter,
    });
  } catch (error) {
    console.error('Update footer data error:', error);
    res.status(500).json({ message: 'Failed to update footer data', error: error.message });
  }
};