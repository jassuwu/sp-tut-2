const router = require("express").Router();
const { body, param } = require("express-validator");
const { addWeekdaysWithoutHolidays } = require("../utils");
const prisma = require("../utils/dbClient");
const validateRequest = require("../utils/validateRequest");
const { route } = require("./Planner");

const baseURL = "/:year/planner/:id/activity";


// Common functions for the updatedActivity
const getUpdatedActivities = async (plannerId) => {
  let planner = await prisma.planner.findUnique({
    where: { id: Number(plannerId) },
    include: { calendar: true, activities: { orderBy: { order: "asc" } } },
  });

  let startDate = new Date(planner.startDate);
  const holidays = planner.calendar.holidays;
  const acitivites = planner.activities;

  const calculatedDates = [];

  for (let i = 0; i < acitivites.length; i++) {
    const foundActivity = acitivites[i];
    if (foundActivity.type === "RELATIVE") {
      const newDate = addWeekdaysWithoutHolidays(
        (holidays || []).map((v) => new Date(v.date).toLocaleDateString()),
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

  return updatedActivities;
};





router.get(
  baseURL,
  validateRequest([
    param("year")
      .isNumeric()
      .withMessage("Year must be a valid number")
      .customSanitizer((value, { req }) => Number(value)),
    param("id")
      .isNumeric()
      .withMessage("Id must be a valid number")
      .customSanitizer((value, { req }) => Number(value)),
  ]),
  async (req, res, next) => {
    try {
      const { year, id } = req.params;
      prisma.activity.findMany({
        where: {
          plannerId: Number(id),
        },
      });
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  baseURL,
  validateRequest([
    param("year")
      .isNumeric()
      .withMessage("Year must be a valid number")
      .customSanitizer((value, { req }) => Number(value)),
    param("id")
      .isNumeric()
      .withMessage("Id must be a valid number")
      .customSanitizer((value, { req }) => Number(value)),
    body("name")
      .isString()
      .withMessage("Name must be string")
      .isLength({ min: 3 })
      .withMessage("Name must be atleast 3 characters long"),
    body("type")
      .isIn(["RELATIVE", "ABSOLUTE"])
      .withMessage("Type must either of RELATIVE or ABSOLUTE"),

    body("relativeDays")
      .if(body("type").equals("RELATIVE"))
      .isNumeric()
      .withMessage("Relative Days must be a valid number")
      .customSanitizer((value, { req }) => Number(value)),
    body("relativeDays")
      .if(body("type").equals("ABSOLUTE"))
      .optional({ nullable: true }),

    body("relativeDate")
      .if(body("type").equals("ABSOLUTE"))
      .isISO8601()
      .withMessage("Relative Date must be a valid date"),
    body("relativeDate")
      .if(body("type").equals("RELATIVE"))
      .optional({ nullable: true }),
  ]),
  async (req, res, next) => {
    try {
      const { year, id } = req.params;
      const { type } = req.body;

      if (type === "RELATIVE") {
        const planner = await prisma.planner.findUnique({
          where: { id: Number(id) },
          include: {
            activities: { orderBy: { order: "asc" } },
            calendar: true,
          },
        });

        const holidays = planner.calendar?.holidays;

        let startDate = null;
        if (planner.activities.length === 0) {
          startDate = planner.startDate;
        } else {
          startDate = planner.activities[planner.activities.length - 1].date;
        }
        const order = planner.activities.length;

        // Calculate the date.
        const date = addWeekdaysWithoutHolidays(
          (holidays || []).map((v) => new Date(v.date).toLocaleDateString()),
          startDate,
          req.body.relativeDays
        );

        const activity = await prisma.activity.create({
          data: {
            ...req.body,
            relativeDate: null,
            date,
            order,
            plannerId: id,
          },
        });

        return res.send(activity);
      } else {
        const planner = await prisma.planner.findUnique({
          where: { id: Number(id) },
          include: {
            activities: { orderBy: { order: "asc" } },
            calendar: true,
          },
        });
        const order = planner.activities.length;

        const activity = await prisma.activity.create({
          data: {
            ...req.body,
            relativeDays: null,
            date: req.body.relativeDate,
            order,
            plannerId: id,
          },
        });

        return res.send(activity);
      }
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  `${baseURL}/:activity_id`,
  validateRequest([
    param("year")
      .isNumeric()
      .withMessage("Year must be a valid number")
      .customSanitizer((value, { req }) => Number(value)),
    param("id")
      .isNumeric()
      .withMessage("Id must be a valid number")
      .customSanitizer((value, { req }) => Number(value)),
    param("activity_id")
      .isNumeric()
      .withMessage("Activity ID must be a valid number")
      .customSanitizer((value, { req }) => Number(value)),
  ]),
  async (req, res, next) => {
    try {
      const { year, id, activity_id } = req.params;
      const activity = await prisma.activity.findUnique({
        where: {
          id: activity_id,
        },
      });
      res.send(activity);
    } catch (err) {
      next(err);
    }
  }
);

router.put(
  `${baseURL}/:activity_id`,
  validateRequest([
    param("year")
      .isNumeric()
      .withMessage("Year must be a valid number")
      .customSanitizer((value, { req }) => Number(value)),
    param("id")
      .isNumeric()
      .withMessage("Id must be a valid number")
      .customSanitizer((value, { req }) => Number(value)),
    param("activity_id")
      .isNumeric()
      .withMessage("Activity ID must be a valid number")
      .customSanitizer((value, { req }) => Number(value)),

    body("name")
      .isString()
      .withMessage("Name must be string")
      .isLength({ min: 3 })
      .withMessage("Name must be atleast 3 characters long"),

    body("type")
      .isIn(["RELATIVE", "ABSOLUTE"])
      .withMessage("Type must either of RELATIVE or ABSOLUTE"),

    body("relativeDays")
      .if(body("type").equals("RELATIVE"))
      .isNumeric()
      .withMessage("Relative Days must be a valid number")
      .customSanitizer((value, { req }) => Number(value)),
    body("relativeDays").if(body("type").equals("ABSOLUTE")).optional(),

    body("relativeDate")
      .if(body("type").equals("ABSOLUTE"))
      .isISO8601()
      .withMessage("Relative Date must be a valid date"),
    body("relativeDate").if(body("type").equals("RELATIVE")).optional(),
  ]),
  async (req, res, next) => {
    try {
      const { year, id, activity_id } = req.params;
      const { type } = req.body;

      if (type === "RELATIVE") {
        const activity = await prisma.activity.update({
          where: {
            id: activity_id,
          },
          data: {
            ...req.body,
            relativeDate: null,
          },
        });
        // return res.send(activity);
      } else {
        const activity = await prisma.activity.update({
          where: {
            id: activity_id,
          },
          data: {
            ...req.body,
            relativeDays: null,
            date: req.body.relativeDate,
          },
        });
        // return res.send(activity);
      }
      const updatedActivities = getUpdatedActivities(id);
      return res.send(updatedActivities);
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  `${baseURL}/order`,
  validateRequest([
    param("year")
      .isNumeric()
      .withMessage("Year must be a valid number")
      .customSanitizer((value, { req }) => Number(value)),
    param("id")
      .isNumeric()
      .withMessage("Id must be a valid number")
      .customSanitizer((value, { req }) => Number(value)),
    body("orders").isArray().withMessage("Name must be string"),
  ]),
  async (req, res, next) => {
    try {
      const { year, id } = req.params;
      const { orders } = req.body;
      const updatedActivities = getUpdatedActivities(id);
      res.send(updatedActivities);
    } catch (err) {
      next(err);
    }
  }
);

router.delete(
  `${baseURL}/:activity_id`,
  validateRequest([
    param("year")
      .isNumeric()
      .withMessage("Year must be a valid number")
      .customSanitizer((value, { req }) => Number(value)),
    param("id")
      .isNumeric()
      .withMessage("Id must be a valid number")
      .customSanitizer((value, { req }) => Number(value)),
    param("activity_id")
      .isNumeric()
      .withMessage("Activity ID must be a valid number")
      .customSanitizer((value, { req }) => Number(value)),
  ]),
  async (req, res, next) => {
    try {
      const { year, id, activity_id } = req.params;
      const activity = await prisma.activity.delete({
        where: {
          id: activity_id,
        },
      });

      const updatedActivities = getUpdatedActivities(id);
      return res.send(updatedActivities);
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
