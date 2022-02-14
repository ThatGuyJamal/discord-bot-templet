import {
  GuildDocument,
  GuildDocumentModel,
} from "../../database/models/guild.schema";
import { ENV } from "../../../config";
import { Collection } from "discord.js";
import { container } from "@sapphire/framework";

type insertOneOptions = "prefix" | "language";

export class GuildConfigHandler {
  public _model = GuildDocumentModel;
  public _cache = new Collection<string, GuildDocument>();

  /**
   * Inserts a new guild config into the database
   * @param id Guild ID
   * @param options Options to insert into the database (channel, prefix, language)
   */
  public async insertOne(id: string, options: insertOneOptions, value: string) {
    const doc = await this._model.findOneAndUpdate(
      { _id: id },
      { $set: { [options]: value } },
      { upsert: true, new: true }
    );
    if (doc) {
      this._cache.set(id, doc);
      if (ENV.database.dev)
        container.logger.info(`[MONGODB] Updating config.\n ${doc}`);
      switch (options) {
        case "prefix":
          container.logger.info(`[MONGODB] Updated prefix. ${doc.prefix}`);
          return doc.prefix;
        case "language":
          container.logger.info(`[MONGODB] Updated language. ${doc.language}`);
          return doc.language;
      }
    }
    if (!doc) {
      if (ENV.database.dev) {
        console.log(
          `[GuildConfigHandler] Guild ${id} does not exist in the database. Creating...\n ${this._cache.entries()}`
        );
      }
      const newGuild = new this._model({
        _id: id,
        [options]: value,
      });
      this._cache.set(id, newGuild);
      if (ENV.database.dev) {
        console.log(
          `[GuildConfigHandler] Guild ${id} has been created in the database.\n ${newGuild}`
        );
      }
      return await newGuild.save();
    } else {
      if (ENV.database.dev) {
        console.log(
          `[GuildConfigHandler] Guild ${id} does not exist in the database.`
        );
      }
      return null;
    }
  }

  public async returnOne(id: string, key: insertOneOptions) {
    if (key === "language") {
      let doc = await this.getDocument(id);
      return doc?.language;
    } else if (key === "prefix") {
      let doc = await this.getDocument(id);
      return doc?.prefix;
    }
    return null;
  }

  /**
   * Returns a document from the db
   * @param id
   * @returns
   */
  public async getDocument(id: string) {
    if (ENV.database.dev)
      container.logger.info(`[MONGODB] Getting guild configuration.`);

    let doc = this._model.findOne({ _id: id });

    if (!doc) {
      if (ENV.database.dev)
        container.logger.info(`[MONGODB] Guild configuration not found.`);
      let newDoc = new this._model({
        _id: id,
      }).save();
      if (ENV.database.dev)
        container.logger.info(`[MONGODB] Guild configuration created.`);
      return await newDoc;
    }
    if (ENV.database.dev)
      container.logger.info(`[MONGODB] Guild configuration found.`);
    return doc;
  }

  /**
   * Deletes a guild configuration from the database.
   * @param id Guild ID
   */
  public async wipe(id: string) {
    if (ENV.database.dev)
      container.logger.info(`[MONGODB] Deleting guild configuration.`);
    this._cache.delete(id);
    return this._model.deleteOne({ _id: id });
  }

  /**
   * Deletes a guild configuration in the database.
   * @param id Guild ID
   * @param options Guild configuration to delete
   */
  public async deleteOne(id: string, options: insertOneOptions) {
    if (ENV.database.dev)
      container.logger.info(
        `[MONGODB] Deleting guild configuration. ${options}`
      );
    let cache = this._cache.get(id);
    if (cache) {
      if (cache.hasOwnProperty(options) && cache[options] !== null) {
        delete cache[options];
        if (ENV.database.dev)
          container.logger.info(
            `[MONGODB] Guild configuration deleted from cache. ${options}`
          );
      }
    }
    return this._model.deleteOne({ _id: id }, { [options]: true });
  }

  /**
   * Creates a new guild configuration in the database.
   * @param id
   * @param options
   */
  public async createOne(id: string, options: insertOneOptions) {
    if (ENV.database.dev)
      container.logger.info(`[MONGODB] Creating guild configuration.`);
    let data = this._cache.get(id) || { _id: id };
    data[options] = options;
    this._cache.set(id, data);
    if (ENV.database.dev)
      container.logger.info(`[MONGODB] Created guild configuration.`);
    return this._model.create({ _id: id, [options]: null });
  }

  /**
   * Caches all guild configurations in the database to memory. This is used for faster access.
   */
  public async initCache() {
    if (ENV.database.dev)
      container.logger.info(`[MONGODB] Initializing guild configuration.`);
    const documents = await this._model.find();
    // We cache the documents in memory to avoid querying the database every time.
    for (const doc of documents) {
      this._cache.set(doc._id, doc);
      if (ENV.database.dev)
        container.logger.info(
          `[MONGODB] Caching guild configuration. \n ${doc}`
        );
    }
    if (ENV.database.dev)
      container.logger.info(`[MONGODB] Guild configuration initialized.`);
  }
}
