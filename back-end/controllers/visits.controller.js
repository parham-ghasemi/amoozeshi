const Visit = require('../models/Visit');
const moment = require('moment-timezone');

exports.getVisitStats = async (req, res) => {
  try {
    // Use Iran timezone
    const tz = "Asia/Tehran";

    const today = moment.tz(tz).startOf('day');
    const weekStart = moment.tz(tz).startOf('isoWeek');
    const monthStart = moment.tz(tz).startOf('month');

    const [todayVisits, weekVisits, monthVisits, totalVisits, dailyVisits] = await Promise.all([
      Visit.countDocuments({ createdAt: { $gte: today.toDate() } }),
      Visit.countDocuments({ createdAt: { $gte: weekStart.toDate() } }),
      Visit.countDocuments({ createdAt: { $gte: monthStart.toDate() } }),
      Visit.countDocuments({}),
      Visit.aggregate([
        {
          $group: {
            _id: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$createdAt",
                timezone: tz   // 👈 important
              }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ])
    ]);

    res.json({
      today: todayVisits,
      week: weekVisits,
      month: monthVisits,
      total: totalVisits,
      chartData: dailyVisits
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.trackVisit = async (req, res) => {
  try {
    await Visit.create({});
    res.status(201).json({ message: 'Visit tracked' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error tracking visit' });
  }
};
