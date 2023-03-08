const router = require("express").Router();
const prisma = require("../utils/dbClient");

router.get("/", async (req, res, next) => {
  try {
    const templates = await prisma.template.findMany();
    res.send(templates);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const tempobj = await prisma.template.findUnique({
      where: {
        id: Number(id),
      },
    });
    res.send(tempobj);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const tempobj = await prisma.template.create({
      data: req.body,
    });
    res.send(tempobj);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const tempobj = await prisma.template.delete({
      where: {
        id: Number(id),
      },
    });
    res.send(tempobj);
  } catch (error) {
    next(error);
  }
});

router.patch("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const tempobj = await prisma.template.update({
      where: {
        id: Number(id),
      },
      data: req.body,
    });
    res.send(tempobj);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
