import { dbWrapper } from "../../../../bootstrapper";
import Entity from "../../../../Dal/Entity";
import EntityRelationsPair from "../../../../Dal/Pair/EntityRelationsPair";

export default {
  createEntity: async (req, res) => {
    const { entity } = req.body;

    if (!entity) {
      res.status(400);
      res.send("no entity in req body");
    }
    try {
      const dbRes = await dbWrapper.createEntity(
        new EntityRelationsPair(new Entity(entity.type, entity.properties), [])
      );
      res.send({ id: dbRes.id });
    } catch (err) {
      res.status(500);
      res.send(`error while tried to create entity ${err}`);
    }
  },
};
