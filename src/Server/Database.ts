import "reflect-metadata";
import { Connection, createConnection, getRepository } from "typeorm";
import { User }                                        from './DB/Entity/User';
import { Game }                                        from "./DB/Entity/Game";


export class Database {
    private static _instance: Database;
    private connection: Connection;

    public static get Instance() {
        return this._instance || (this._instance = new this());
    }

    constructor() {
        this.init()
            .catch((e) => console.error("Initializing the database failed", e));
    }

    async init() {
        createConnection().then(async connection => {
            this.connection = await connection;
            console.log("Database intialized!");
        }).catch(error => console.log(error));
    }

    createNewUser(info: { id: number; games: string; steamId: string }) {
        if (!this.connection.isConnected) {
            throw new Error("Database is not connected");
        }

        let user = new User();
        user.id = info.id;
        user.steamId = info.steamId;
        user.games = info.games;
        user.createdOn = Date.now();

        this.connection.manager.save(user)
            .catch(e => console.error("Something went wrong saving a new user", user, e));
    }

    static saveEntityType(type, entries) {
        const repository = getRepository(type);
        return repository.save(entries, {chunk: (entries.length > 500 ? entries.length / 500 : 1)})
                         .catch(e => console.error("Something went wrong writing to the database", e));
    }

    async getGamesWithoutContent() {
        const repository = getRepository(Game);
        return await repository.find({hasContent: null})
    }
}