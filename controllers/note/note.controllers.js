import dotenv from "dotenv";
dotenv.config({ path: `../.env` });
import { StatusCodes } from "http-status-codes";
import CustomError from "../../utils/custom_error.js";
import { sendHttpResponse } from "../../utils/HttpResponse.js";
import { generateUuid } from "../../utils/gen_uuid.js";
import { Op } from "sequelize";
import Note from "../../models/note.model.js";

export default {
  // __________________________________________________________
  create: async (req, res) => {
    const body = req.body;

    let note = await Note.findOne({
      raw: true,
      attributes: ["id"],
      where: {
        title: body.title,
        author_id: req.user.id,
      },
    });
    if (note) throw new CustomError("this note already found !");

    note = await Note.create({
      _id: generateUuid(),
      content: body.content,
      title: body.title,
      author_id: req.user.id,
    });
    delete note.dataValues.id;
    delete note.dataValues.author_id;

    sendHttpResponse(res, StatusCodes.OK, {
      message: "operation accomplished successfully",
      ...note.dataValues,
    });
  },
  // __________________________________________________________
  update: async (req, res) => {
    const body = req.body;
    let note = await Note.findOne({
      raw: true,
      attributes: ["id"],
      where: { _id: req.params.id, author_id: req.user.id },
    });
    if (!note) throw new CustomError("the note id is incorrect");

    if (
      await Note.findOne({
        raw: true,
        attributes: ["id"],
        where: { title: body.title, _id: { [Op.not]: req.params.id } },
      })
    )
      throw new CustomError(" the tile found before");

    await Note.update(
      {
        ...body,
      },
      { where: { id: note.id } }
    );

    sendHttpResponse(res, StatusCodes.OK);
  },
  // __________________________________________________________
  delete: async (req, res) => {
    let note = await Note.findOne({
      raw: true,
      attributes: ["id"],
      where: { _id: req.params.id, author_id: req.user.id },
    });
    if (!note) throw new CustomError("the note id is incorrect");

    await Note.destroy({
      where: { id: note.id },
    });

    sendHttpResponse(res, StatusCodes.OK);
  },
  // __________________________________________________________
  getAll: async (req, res) => {
    let { size, page, q } = req.query;
    let whereClause = { author_id: req.user.id };

    if (q) {
      whereClause = {
        [Op.or]: [
          { content: { [Op.like]: `%${q}%` } },
          { title: { [Op.like]: `%${q}%` } },
          { _id: { [Op.eq]: q } },
        ],
        author_id: req.user.id,
      };
    }
    let { rows: notes, count: total } = await Note.findAndCountAll({
      raw: true,
      attributes: { exclude: ["author_id", "id"] },
      limit: +size,
      offset: (+page - 1) * +size,
      where: whereClause,
      order: [["createdAt", "DESC"]],
    });

    sendHttpResponse(res, StatusCodes.OK, {
      notes,
      total,
      page: +page,
      perPage: +size,
      totalPages: Math.ceil(total / +size),
    });
  },
  // __________________________________________________________
  getOne: async (req, res) => {
    let note = await Note.findOne({
      raw: true,
      attributes: { exclude: ["author_id", "id"] },
      where: { _id: req.params.id, author_id: req.user.id },
      order: [["createdAt", "DESC"]],
    });
    if (!note) throw new CustomError("The id is incorrect");

    sendHttpResponse(res, StatusCodes.OK, {
      ...note,
    });
  },
};
