const router = require("express").Router();
const { body, param } = require("express-validator");
const {
  addWeekdaysWithoutHolidays,
  differenceWeekdaysWithHolidays,
} = require("../utils");
const prisma = require("../utils/dbClient");
const validateRequest = require("../utils/validateRequest");

const baseURL = "/:year/planner";

router.get(
  baseURL,
  validateRequest([
    param("year")
      .isNumeric()
      .withMessage("Year must be a valid number")
      .customSanitizer((value, { req }) => Number(value)),
  ]),
  async (req, res, next) => {
    const { year } = req.params;
    try {
      const plans = await prisma.planner.findMany({
        orderBy: { id: "desc" },
        where: {
          calendarYear: year,
        },
        include: { activities: { orderBy: { order: "asc" } }, calendar: true },
      });

      for (let i = 0; i < plans; i++) {
        const today = new Date();
        const lastDate = new Date(plans[i].lastDate);
        today.setHours(0, 0, 0, 0);
        lastDate.setHours(0, 0, 0, 0);
        const holidays = plans[i].calendar.holidays;
        const remainingDays = differenceWeekdaysWithHolidays(
          (holidays || []).map((v) => new Date(v.date).toLocaleDateString()),
          today,
          lastDate
        );
        plans[i] = { ...plans[i], remainingDays };
      }

      res.send(plans);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  `${baseURL}/:id`,
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
      const { id } = req.params;
      let plannerobj = await prisma.planner.findUnique({
        where: {
          id: Number(id),
        },
        include: { activities: { orderBy: { order: "asc" } }, calendar: true },
      });

      const today = new Date();
      const lastDate = new Date(plannerobj.lastDate);
      today.setHours(0, 0, 0, 0);
      lastDate.setHours(0, 0, 0, 0);

      const holidays = plannerobj.calendar.holidays;
      const remainingDays = differenceWeekdaysWithHolidays(
        (holidays || []).map((v) => new Date(v.date).toLocaleDateString()),
        today,
        lastDate
      );

      plannerobj = { ...plannerobj, remainingDays };

      res.send(plannerobj);
    } catch (error) {
      next(error);
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
    body("startDate")
      .exists()
      .withMessage("Start Date is missing")
      .isISO8601()
      .withMessage("Start Date must be a valid date"),
    body("name")
      .isString()
      .withMessage("Name must be string")
      .isLength({ min: 3 })
      .withMessage("Name must be atleast 3 characters long"),
    body("totalWorkingDays")
      .isNumeric()
      .withMessage("Total working days must be a valid number")
      .customSanitizer((value, { req }) => Number(value)),
  ]),
  async (req, res, next) => {
    const { year } = req.params;
    try {
      const calendar = await prisma.calendar.findUnique({
        where: { year },
      });

      const holidays = calendar.holidays;
      const lastDate = addWeekdaysWithoutHolidays(
        (holidays || []).map((v) => new Date(v.date).toLocaleDateString()),
        req.body.startDate,
        req.body.totalWorkingDays
      );

      let plannerobj = await prisma.planner.create({
        data: {
          ...req.body,
          lastDate,
          calendarYear: year,
        },
        include: {
          activities: { orderBy: { order: "asc" } },
        },
      });

      const today = new Date();
      // lastDate = new Date(plannerobj.lastDate);
      today.setHours(0, 0, 0, 0);
      lastDate.setHours(0, 0, 0, 0);
      // const holidays = plannerobj.calendar.holidays;
      const remainingDays = differenceWeekdaysWithHolidays(
        (holidays || []).map((v) => new Date(v.date).toLocaleDateString()),
        today,
        lastDate
      );

      plannerobj = { ...plannerobj, remainingDays };

      res.send(plannerobj);
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  `${baseURL}/:id`,
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
      const { id } = req.params;
      let plannerobj = await prisma.planner.delete({
        where: {
          id: Number(id),
        },
        include: { activities: { orderBy: { order: "asc" } } },
      });
      res.send(plannerobj);
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  `${baseURL}/:id`,
  validateRequest([
    param("year")
      .isNumeric()
      .withMessage("Year must be a valid number")
      .customSanitizer((value, { req }) => Number(value)),
    param("id")
      .isNumeric()
      .withMessage("Id must be a valid number")
      .customSanitizer((value, { req }) => Number(value)),
    body("startDate")
      .exists()
      .withMessage("Start Date is missing")
      .isISO8601()
      .withMessage("Start Date must be a valid date"),
    body("name")
      .isString()
      .withMessage("Name must be string")
      .isLength({ min: 3 })
      .withMessage("Name must be atleast 3 characters long"),
    body("totalWorkingDays")
      .isNumeric()
      .withMessage("Total working days must be a valid number"),
  ]),
  async (req, res, next) => {
    try {
      const { year, id } = req.params;

      const calendar = await prisma.calendar.findUnique({
        where: { year },
      });

      let holidays = calendar.holidays;
      const lastDate = addWeekdaysWithoutHolidays(
        (holidays || []).map((v) => new Date(v.date).toLocaleDateString()),
        req.body.startDate,
        req.body.totalWorkingDays
      );

      let plannerobj = await prisma.planner.update({
        where: {
          id,
        },
        data: { ...req.body, lastDate },
        include: { activities: { orderBy: { order: "asc" } }, calendar: true },
      });

      let startDate = new Date(plannerobj.startDate);
      holidays = plannerobj.calendar.holidays;
      const acitivites = plannerobj.activities;

      const calculatedDates = [];

      for (let i = 0; i < acitivites.length; i++) {
        const foundActivity = acitivites[i];
        const newDate = addWeekdaysWithoutHolidays(
          (holidays || []).map((v) => new Date(v.date).toLocaleDateString()),
          startDate,
          foundActivity.relativeDays
        );
        calculatedDates.push({ id: foundActivity.id, date: newDate });
        startDate = newDate;
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

      const today = new Date();
      // lastDate = new Date(plannerobj.lastDate);
      today.setHours(0, 0, 0, 0);
      lastDate.setHours(0, 0, 0, 0);
      // const holidays = plannerobj.calendar.holidays;
      const remainingDays = differenceWeekdaysWithHolidays(
        (holidays || []).map((v) => new Date(v.date).toLocaleDateString()),
        today,
        lastDate
      );

      plannerobj = { ...plannerobj, remainingDays };

      res.send({ ...plannerobj, activities: updatedActivities });
    } catch (error) {
      next(error);
    }
  }
);

// router.patch(
//   `${baseURL}/:id`,
//   validateRequest([
//     param("year").isNumeric().withMessage("Year must be a valid number"),
//     body("activities").isArray().withMessage("Acitivites must be an array"),
//   ]),
//   async (req, res, next) => {
//     try {
//       const { id } = req.params;
//       const plannerobj = await prisma.planner.update({
//         where: {
//           id: Number(id),
//         },
//         data: req.body,
//       });
//       res.send(plannerobj);
//     } catch (error) {
//       next(error);
//     }
//   }
// );

module.exports = router;
