import {
  getModelForClass,
  modelOptions,
  prop,
  Severity,
} from "@typegoose/typegoose";

@modelOptions({
  schemaOptions: {
    id: false,
    collection: "rpg-guild-collection",
  },
  options: {
    allowMixed: Severity.ALLOW,
    runSyncIndexes: true,
  },
})
export class GuildDocument {
  @prop({ type: () => String, required: true })
  /**
   * Guild ID
   */
  public _id?: string;

  @prop({ type: () => String, required: false, default: null })
  /**
   * The guild prefix config
   */
  public prefix?: string | null;

  @prop({ type: () => String, required: false, default: "en-US" })
  /**
   * The guild's language config
   */
  public language?: string;
}

export const GuildDocumentModel = getModelForClass(GuildDocument);
