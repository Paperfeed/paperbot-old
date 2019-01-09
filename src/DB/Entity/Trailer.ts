import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { Game }                                              from "./Game";

@Entity()
export class Trailer {
    @PrimaryColumn()
    id: number;

    @Column()
    thumbnail: string;

    @Column()
    webm480: string;

    @Column()
    webmFull: string;

    @ManyToOne(type => Game, game => game.trailers)
    game: Game;
}