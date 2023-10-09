import adminRoutes from "../routes/admin/admin.routes.js";
import userRoutes from "../routes/user/user.routes.js";
import bookRoutes from "../routes/book/book.routes.js";

const routers = (app) => {
  app.use("/api/admin", adminRoutes);
  app.use("/api/user", userRoutes);
  app.use("/api/books", bookRoutes);
};

export default routers;
