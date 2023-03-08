const router = require("express").Router();
const { body, param } = require("express-validator");
const prisma = require("../utils/dbClient");
const validateRequest = require("../utils/validateRequest");
const { addWeekdaysWithoutHolidays } = require("../utils");

const baseURL = "";

router.get(`${baseURL}/`, async (req, res, next) => {
  try {
    const cals = await prisma.calendar.findMany({
      orderBy: {
        year: "desc",
      },
      include: { planner: true },
    });
    res.send(cals);
  } catch (error) {
    next(error);
  }
});

router.get(
  `${baseURL}/:year`,
  validateRequest([
    param("year")
      .isNumeric()
      .withMessage("Year must be a valid number")
      .customSanitizer((value, { req }) => Number(value)),
  ]),
  async (req, res, next) => {
    try {
      const { year } = req.params;
      const yrCal = await prisma.calendar.findUnique({
        where: {
          year,
        },
        include: { planner: true },
      });
      res.send(yrCal);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  `${baseURL}/`,
  validateRequest([
    body("year")
      .isNumeric()
      .withMessage("Year must be a valid number")
      .customSanitizer((value, { req }) => Number(value)),
    body("holidays").isArray().withMessage("Holidays must be an array"),
  ]),
  async (req, res, next) => {
    try {
      const yrCal = await prisma.calendar.create({
        data: req.body,
      });
      res.send(yrCal);
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  `${baseURL}/:year`,
  validateRequest([
    param("year")
      .isNumeric()
      .withMessage("Year must be a valid number")
      .customSanitizer((value, { req }) => Number(value)),
  ]),
  async (req, res, next) => {
    try {
      const { year } = req.params;
      const yrCal = await prisma.calendar.delete({
        where: {
          year,
        },
      });
      res.send(yrCal);
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  `${baseURL}/:year`,
  validateRequest([
    param("year")
      .isNumeric()
      .withMessage("Year must be a valid number")
      .customSanitizer((value, { req }) => Number(value)),
    body("holidays").isArray().withMessage("Holidays must be an array"),
  ]),
  async (req, res, next) => {
    try {
      const { year } = req.params;
      const yrCal = await prisma.calendar.update({
        where: {
          year,
        },
        data: req.body,
        include: {
          planner: {
            include: {
              activities: true,
            },
          },
        },
      });

      const holidays = (yrCal.holidays || []).map((v) =>
        new Date(v.date).toLocaleDateString()
      );

      const planners = yrCal.planner;
      for (let i = 0; i < planners.length; i++) {
        const planner = planners[i];

        let startDate = new Date(planner.startDate);
        const acitivites = planner.activities;

        const calculatedDates = [];

        for (let i = 0; i < acitivites.length; i++) {
          const foundActivity = acitivites[i];
          if (foundActivity.type === "RELATIVE") {
            const newDate = addWeekdaysWithoutHolidays(
              holidays,
              startDate,
              foundActivity.relativeDays
            );

            calculatedDates.push({ id: foundActivity.id, date: newDate });
            startDate = newDate;
          } else {
            calculatedDates.push({
              id: foundActivity.id,
              date: foundActivity.relativeDate,
            });
            startDate = foundActivity.relativeDate;
          }
        }

        const updatedActivities = await Promise.all(
          calculatedDates.map((v, index) => {
            return prisma.activity.update({
              where: {
                id: v.id,
              },
              data: {
                date: v.date,
                order: index,
              },
            });
          })
        );
      }

      res.send(yrCal);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
