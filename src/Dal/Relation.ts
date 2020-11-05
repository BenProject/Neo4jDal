export default class Relation {
    public RelType: string;
    public RelEntityId: string;
    public StartEntityId: string | null;
    public EndEntityId: string | null;
  
    constructor(relType: string, relEntityId: string, start = null, end = null) {
      this.RelType = relType;
      this.RelEntityId = relEntityId;
      this.StartEntityId = start;
      this.EndEntityId = end;
    }
  }
  
  