import {createServer} from "http";
import {app} from "./app";
import {sequelize} from "./sequelize";

const port = process.env.PORT || 3000;

(async () => {
  await sequelize.sync().catch((err: any) => console.log(err));

  createServer(app)
	.listen(
		port,
		() => console.log(`Server running on port ${port}`)
	);
})();
