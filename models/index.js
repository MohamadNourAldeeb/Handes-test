import Note from "./note.model.js";
import Author from "./author.model.js";
import ApiError from "./api_error.model.js";
import UserRefreshToken from "./user_refresh_tokens.model.js";
import LogMaliciousUser from "./log_malicious_user.model.js";

Author.hasMany(Note, {
  foreignKey: "author_id",
  as: "notes_info",
  constraints: true,
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
  hooks: true,
});

Note.belongsTo(Author, {
  foreignKey: "author_id",
  as: "creator",
});

Author.hasMany(UserRefreshToken, {
  constraints: true,
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
  hooks: true,
  foreignKey: "user_id",
});
UserRefreshToken.belongsTo(Author, {
  foreignKey: "user_id",
});

Author.hasMany(ApiError, {
  constraints: true,
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
  hooks: true,
  foreignKey: "user_id",
});
ApiError.belongsTo(Author, {
  foreignKey: "user_id",
});
// -------------------------------------------------------------------
export { Note, Author, ApiError, UserRefreshToken, LogMaliciousUser };
